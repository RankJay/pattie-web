import { readFileSync } from "node:fs";

/**
 * Regenerates token art with gpt-image-1 for the coins named in a JSON map and updates `coins.image_url`.
 *
 *   bun tools/backfill-token-images.ts subjects.json
 *
 * subjects.json: { "<token address>": "<dish description>", ... }
 * Old blobs are left in place because on-chain tokenURI metadata may still point at them.
 */
import { loadEnvConfig } from "@next/env";
import { z } from "zod";

loadEnvConfig(process.cwd());

const subjectsSchema = z.record(z.string().regex(/^0x[a-fA-F0-9]{40}$/), z.string().min(3));

async function main() {
  const file = process.argv[2];

  if (!file) {
    throw new Error("Usage: bun tools/backfill-token-images.ts subjects.json");
  }

  const subjects = subjectsSchema.parse(JSON.parse(readFileSync(file, "utf8")));

  const [
    { env },
    { db },
    { coins },
    { renderTextFreeTokenImage },
    { isPublicBlobImageUrl },
    { put },
    { eq, inArray },
  ] = await Promise.all([
    import("@/lib/env"),
    import("@/lib/db"),
    import("@/lib/db/schema/coins"),
    import("@/lib/cook/image-generate"),
    import("@/lib/cook/image"),
    import("@vercel/blob"),
    import("drizzle-orm"),
  ]);

  const apiKey = env.OPENAI_API_KEY;
  const blobToken = env.BLOB_READ_WRITE_TOKEN;

  if (!apiKey || !blobToken) {
    throw new Error("OPENAI_API_KEY and BLOB_READ_WRITE_TOKEN are required");
  }

  const addresses = Object.keys(subjects);

  const rows = await db
    .select({ tokenAddress: coins.tokenAddress, symbol: coins.symbol, imageUrl: coins.imageUrl })
    .from(coins)
    .where(inArray(coins.tokenAddress, addresses));

  const known = new Map(rows.map((row) => [row.tokenAddress.toLowerCase(), row]));

  /* eslint-disable no-await-in-loop -- image generation is rate-limited, so one coin finishes before the next starts */
  for (const [address, subject] of Object.entries(subjects)) {
    const row = known.get(address.toLowerCase());

    if (!row) {
      process.stdout.write(`skip ${address}: not in coins\n`);
      continue;
    }

    process.stdout.write(`${row.symbol}: generating "${subject}"\n`);

    const started = Date.now();

    const bytes = await renderTextFreeTokenImage({
      subject,
      apiKey,
      onAttempt: (attempt, hasText) => {
        if (hasText) {
          console.warn(`${row.symbol}: attempt ${attempt} had text, re-rendering`);
        }
      },
    });

    const blob = await put("tokens/image.png", bytes, {
      access: "public",
      addRandomSuffix: true,
      contentType: "image/png",
      token: blobToken,
    });

    if (!isPublicBlobImageUrl(blob.url)) {
      throw new Error(`${row.symbol}: blob store returned a non-public URL`);
    }

    await db
      .update(coins)
      .set({ imageUrl: blob.url })
      .where(eq(coins.tokenAddress, row.tokenAddress));

    process.stdout.write(
      `${row.symbol}: ${Math.round((Date.now() - started) / 1000)}s, ${Math.round(bytes.byteLength / 1024)}KB\n  old ${row.imageUrl ?? "(none)"}\n  new ${blob.url}\n`,
    );
  }
  /* eslint-enable no-await-in-loop */
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
