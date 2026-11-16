import { readFileSync } from "node:fs";

import { appChain } from "@/lib/chain";
import { restaurantFeeCursor } from "@/lib/fees/restaurant-payout";
import {
  assessCase,
  feeCursorName,
  formatFlyWei,
  type CaseChain,
  type CaseSnapshot,
  type FeeStatus,
  type Finding,
  type LaunchStatus,
  type SupportCoin,
  type SupportCursor,
  type SupportFee,
  type SupportLaunch,
  type SupportSnapshot,
  type SupportUser,
  type TxReceipt,
} from "@/lib/support/case";
import { FlynetDiscoveryClient } from "@flynetdev/core";
import postgres from "postgres";
import { createPublicClient, http, isHex, type Hex } from "viem";
import { z } from "zod";

const wei = z
  .string()
  .regex(/^\d+$/)
  .transform((value) => BigInt(value));

const userRow = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  flynet_subject: z.string().nullable(),
  flynet_name: z.string().nullable(),
  wallet_address: z.string().nullable(),
  wallet_chain_id: z.number().nullable(),
});

const payloadSchema = z.object({
  tokenAddress: z.string().optional(),
  walletAddress: z.string().optional(),
  txHash: z.string().optional(),
  name: z.string().optional(),
  symbol: z.string().optional(),
});

const launchRow = z.object({
  id: z.string(),
  status: z.enum(["simulating", "pending", "confirmed", "failed"]),
  token_address: z.string().nullable(),
  created_at: z.coerce.date(),
  simulate_payload: payloadSchema.nullable().catch(null),
});

const feeStatusSchema = z.enum(["pending", "issued", "held", "unassigned", "empty"]);

const feeRow = z.object({
  tx_hash: z.string(),
  log_index: z.number(),
  status: feeStatusSchema,
  token_address: z.string().nullable(),
  creator_user_id: z.string().nullable(),
  fly_out: wei,
  usdc_in: wei,
  reward_id: z.string(),
  indexed_at: z.coerce.date(),
  block_number: wei,
});

const claimRow = z.object({
  id: z.string(),
  amount_fly: wei,
  status: z.enum(["pending", "paid", "failed"]),
});

const shortfallRow = z.object({
  id: z.string(),
  amount_fly: wei,
  destination: z.string(),
  location_id: z.string().nullable(),
  token_address: z.string().nullable(),
  created_at: z.coerce.date(),
});

const cursorRow = z.object({
  name: z.string(),
  block_number: wei,
  updated_at: z.coerce.date(),
});

const coinRow = z.object({
  token_address: z.string(),
  symbol: z.string(),
  name: z.string(),
  pool_id: z.string(),
  creator_user_id: z.string().nullable(),
  creator_address: z.string(),
  restaurant_location_id: z.string().nullable(),
  restaurant_name: z.string().nullable(),
  deploy_tx: z.string().nullable(),
  zerion_missed_at: z.coerce.date().nullable(),
});

const quoteRow = z.object({
  token_address: z.string(),
  captured_at: z.coerce.date(),
});

const idRow = z.object({ id: z.string() });

const countRow = z.object({ count: z.coerce.number() });

const sumRow = z.object({ total: wei });

type Sql = ReturnType<typeof postgres>;

type Identity =
  | { kind: "email"; value: string }
  | { kind: "user"; value: string }
  | { kind: "wallet"; value: string }
  | { kind: "token"; value: string }
  | { kind: "tx"; value: string };

type Cli =
  | { kind: "help" }
  | { kind: "queue"; json: boolean }
  | { kind: "case"; json: boolean; verbose: boolean; identity: Identity; txs: readonly string[] };

function emit(line: string): void {
  process.stdout.write(`${line}\n`);
}

function loadEnvFile(path: string): void {
  let text: string;

  try {
    text = readFileSync(path, "utf8");
  } catch {
    return;
  }

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (trimmed.length === 0 || trimmed.startsWith("#")) {
      continue;
    }

    const eq = trimmed.indexOf("=");

    if (eq <= 0) {
      continue;
    }

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function flag(argv: readonly string[], name: string): string | null {
  const index = argv.indexOf(name);

  if (index === -1) {
    return null;
  }

  const value = argv[index + 1];

  if (!value || value.startsWith("--")) {
    return null;
  }

  return value;
}

function repeated(argv: readonly string[], name: string): string[] {
  const values: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] !== name) {
      continue;
    }

    const value = argv[index + 1];

    if (value && !value.startsWith("--")) {
      values.push(value);
    }
  }

  return values;
}

function parseCli(argv: readonly string[]): Cli {
  if (argv.includes("--help") || argv.length === 0) {
    return { kind: "help" };
  }

  const json = argv.includes("--json");
  const verbose = argv.includes("--verbose");
  const txs = repeated(argv, "--tx");

  if (argv.includes("--queue")) {
    return { kind: "queue", json };
  }

  const email = flag(argv, "--email");
  const user = flag(argv, "--user");
  const wallet = flag(argv, "--wallet");
  const token = flag(argv, "--token");
  const chosen = [email, user, wallet, token].filter((value) => value !== null);

  if (chosen.length > 1) {
    throw new Error("Pass one of --email, --user, --wallet, or --token");
  }

  if (email) {
    return { kind: "case", json, verbose, identity: { kind: "email", value: email }, txs };
  }

  if (user) {
    return { kind: "case", json, verbose, identity: { kind: "user", value: user }, txs };
  }

  if (wallet) {
    return { kind: "case", json, verbose, identity: { kind: "wallet", value: wallet }, txs };
  }

  if (token) {
    return { kind: "case", json, verbose, identity: { kind: "token", value: token }, txs };
  }

  const onlyTx = txs[0];

  if (onlyTx && txs.length === 1) {
    return { kind: "case", json, verbose, identity: { kind: "tx", value: onlyTx }, txs };
  }

  throw new Error("Pass --email, --user, --wallet, --token, --tx, or --queue");
}

function help(): void {
  emit(`Read-only case file. Compares fly_available, claims, fee logs, and launches with the chain.

  bun tools/support/case.ts --email ada@example.com
  bun tools/support/case.ts --wallet 0x... --tx 0x...
  bun tools/support/case.ts --token 0x...
  bun tools/support/case.ts --queue

--json prints findings. --verbose includes the rows that already match.
Does not write. A pending claim may already be paid at Flynet.`);
}

function txHash(value: string): Hex | null {
  if (!isHex(value, { strict: true }) || value.length !== 66) {
    return null;
  }

  return value;
}

async function readChain(hashes: readonly string[]): Promise<CaseChain | null> {
  const unique: Hex[] = [];

  for (const hash of hashes) {
    const parsed = txHash(hash);

    if (parsed && !unique.some((item) => item.toLowerCase() === parsed.toLowerCase())) {
      unique.push(parsed);
    }
  }

  const rpc = process.env.ALCHEMY_RPC_URL ?? appChain.rpcUrls.default.http[0];

  if (!rpc) {
    return null;
  }

  try {
    const client = createPublicClient({ chain: appChain, transport: http(rpc) });
    const head = await client.getBlockNumber();
    const limited = unique.slice(0, 15);
    const receipts = await Promise.all(limited.map((hash) => readReceipt(client, hash)));

    return { head, receipts };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "rpc failed";

    console.error(`chain unread: ${message}`);

    return null;
  }
}

async function readReceipt(
  client: ReturnType<typeof createPublicClient>,
  hash: Hex,
): Promise<TxReceipt> {
  try {
    const receipt = await client.getTransactionReceipt({ hash });

    return {
      txHash: hash,
      status: receipt.status === "success" ? "success" : "reverted",
      blockNumber: receipt.blockNumber,
    };
  } catch {
    return { txHash: hash, status: "missing", blockNumber: null };
  }
}

async function readFloat(): Promise<bigint | null> {
  const apiKey = process.env.FLYNET_REWARDS_API_KEY;
  const serverURL = process.env.FLYNET_API_BASE_URL;

  if (!apiKey || !serverURL) {
    return null;
  }

  try {
    const client = new FlynetDiscoveryClient({ apiKey, serverURL });
    const account = await client.rewards.getBalance();

    if (!/^\d+$/.test(account.balance.value)) {
      return null;
    }

    return BigInt(account.balance.value);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "balance read failed";

    console.error(`rewards float unreadable: ${message}`);

    return null;
  }
}

async function resolveUser(sql: Sql, identity: Identity): Promise<string | null> {
  switch (identity.kind) {
    case "user":
      return identity.value;
    case "email": {
      const rows = z.array(idRow).parse(
        await sql`
        select id from "user" where lower(email) = lower(${identity.value}) limit 1
      `,
      );

      return rows[0]?.id ?? null;
    }

    case "wallet": {
      const rows = z.array(z.object({ user_id: z.string() })).parse(
        await sql`
        select user_id from wallet_address where lower(address) = lower(${identity.value}) limit 1
      `,
      );

      return rows[0]?.user_id ?? null;
    }

    case "token": {
      const rows = z.array(z.object({ creator_user_id: z.string().nullable() })).parse(
        await sql`
        select creator_user_id from coins where lower(token_address) = lower(${identity.value}) limit 1
      `,
      );

      return rows[0]?.creator_user_id ?? null;
    }

    case "tx":
      return resolveTx(sql, identity.value);
    default: {
      const unreachable: never = identity;

      throw new Error(`Unhandled ${JSON.stringify(unreachable)}`);
    }
  }
}

async function resolveTx(sql: Sql, hash: string): Promise<string | null> {
  const fees = z.array(z.object({ creator_user_id: z.string().nullable() })).parse(
    await sql`
    select creator_user_id from fee_collections
    where lower(tx_hash) = lower(${hash}) and creator_user_id is not null
    limit 1
  `,
  );

  const feeUser = fees[0]?.creator_user_id;

  if (feeUser) {
    return feeUser;
  }

  const launches = z.array(z.object({ user_id: z.string() })).parse(
    await sql`
    select user_id from launches
    where lower(simulate_payload->>'txHash') = lower(${hash})
    limit 1
  `,
  );

  const launchUser = launches[0]?.user_id;

  if (launchUser) {
    return launchUser;
  }

  const coins = z.array(z.object({ creator_user_id: z.string().nullable() })).parse(
    await sql`
    select creator_user_id from coins
    where deploy_tx is not null and lower(deploy_tx) = lower(${hash})
    limit 1
  `,
  );

  return coins[0]?.creator_user_id ?? null;
}

function toUser(row: z.infer<typeof userRow>): SupportUser {
  const address = row.wallet_address;
  const chainId = row.wallet_chain_id;

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    flynetSubject: row.flynet_subject,
    flynetName: row.flynet_name,
    wallet: address !== null && chainId !== null ? { address, chainId } : null,
  };
}

function toCoin(row: z.infer<typeof coinRow>): SupportCoin {
  return {
    tokenAddress: row.token_address,
    symbol: row.symbol,
    name: row.name,
    poolId: row.pool_id,
    creatorUserId: row.creator_user_id,
    creatorAddress: row.creator_address,
    restaurantLocationId: row.restaurant_location_id,
    restaurantName: row.restaurant_name,
    deployTx: row.deploy_tx,
    zerionMissedAt: row.zerion_missed_at,
  };
}

function toLaunch(row: z.infer<typeof launchRow>): SupportLaunch {
  const payload = row.simulate_payload;
  const status: LaunchStatus = row.status;

  return {
    id: row.id,
    status,
    tokenAddress: row.token_address,
    predictedToken: payload?.tokenAddress ?? null,
    txHash: payload?.txHash ?? null,
    walletAddress: payload?.walletAddress ?? null,
    name: payload?.name ?? null,
    symbol: payload?.symbol ?? null,
    createdAt: row.created_at,
  };
}

function toFee(row: z.infer<typeof feeRow>): SupportFee {
  const status: FeeStatus = row.status;

  return {
    txHash: row.tx_hash,
    logIndex: row.log_index,
    status,
    tokenAddress: row.token_address,
    creatorUserId: row.creator_user_id,
    flyOut: row.fly_out,
    usdcIn: row.usdc_in,
    rewardId: row.reward_id,
    indexedAt: row.indexed_at,
    blockNumber: row.block_number,
  };
}

async function loadSnapshot(
  sql: Sql,
  userId: string,
  lookedUpTxs: readonly string[],
  chain: CaseChain | null,
  rewardsFloat: bigint | null,
  now: Date,
): Promise<CaseSnapshot | null> {
  const users = z.array(userRow).parse(
    await sql`
    select u.id, u.email, u.name, u.flynet_subject, u.flynet_name,
           w.address as wallet_address, w.chain_id as wallet_chain_id
    from "user" u
    left join wallet_address w on w.user_id = u.id
    where u.id = ${userId}
    limit 1
  `,
  );

  const user = users[0];

  if (!user) {
    return null;
  }

  const [coins, launches, claims, shortfalls, cursors] = await Promise.all([
    sql`
      select token_address, symbol, name, pool_id, creator_user_id, creator_address,
             restaurant_location_id, restaurant_name, deploy_tx, zerion_missed_at
      from coins
      where creator_user_id = ${userId}
      order by created_at desc
      limit 50
    `,
    sql`
      select id, status, token_address, created_at, simulate_payload
      from launches
      where user_id = ${userId}
      order by created_at desc
      limit 20
    `,
    sql`select id, amount_fly::text, status from claims where user_id = ${userId}`,
    sql`
      select id, amount_fly::text, destination, location_id::text, token_address, created_at
      from claim_shortfalls
      where user_id = ${userId}
      order by created_at desc
      limit 20
    `,
    sql`
      select name, block_number::text, updated_at
      from indexer_cursors
      where name in (${feeCursorName}, ${restaurantFeeCursor})
    `,
  ]);

  const parsedCoins = z.array(coinRow).parse(coins);
  const tokenAddresses = parsedCoins.map((coin) => coin.token_address);

  const fees = z.array(feeRow).parse(
    tokenAddresses.length === 0
      ? await sql`
          select tx_hash, log_index, status, token_address, creator_user_id,
                 fly_out::text, usdc_in::text, reward_id, indexed_at, block_number::text
          from fee_collections
          where creator_user_id = ${userId}
          order by indexed_at desc
          limit 100
        `
      : await sql`
          select tx_hash, log_index, status, token_address, creator_user_id,
                 fly_out::text, usdc_in::text, reward_id, indexed_at, block_number::text
          from fee_collections
          where creator_user_id = ${userId} or token_address in ${sql(tokenAddresses)}
          order by indexed_at desc
          limit 100
        `,
  );

  const quotes = z.array(quoteRow).parse(
    tokenAddresses.length === 0
      ? []
      : await sql`
          select token_address, captured_at from market_snapshots
          where token_address in ${sql(tokenAddresses)}
        `,
  );

  const availableRows = z
    .array(z.object({ amount_fly: wei }))
    .parse(await sql`select amount_fly::text from fly_available where user_id = ${userId} limit 1`);

  return {
    now,
    user: toUser(user),
    coins: parsedCoins.map(toCoin),
    launches: z.array(launchRow).parse(launches).map(toLaunch),
    fees: fees.map(toFee),
    claims: z
      .array(claimRow)
      .parse(claims)
      .map((row) => ({
        id: row.id,
        amountFly: row.amount_fly,
        status: row.status,
      })),
    shortfalls: z
      .array(shortfallRow)
      .parse(shortfalls)
      .map((row) => ({
        id: row.id,
        amountFly: row.amount_fly,
        destination: row.destination,
        locationId: row.location_id,
        tokenAddress: row.token_address,
        createdAt: row.created_at,
      })),
    flyAvailable: availableRows[0]?.amount_fly ?? BigInt(0),
    cursors: z.array(cursorRow).parse(cursors).map(toCursor),
    quotes: quotes.map(toQuote),
    lookedUpTxs,
    chain,
    rewardsFloat,
  };
}

function toCursor(row: z.infer<typeof cursorRow>): SupportCursor {
  return { name: row.name, blockNumber: row.block_number, updatedAt: row.updated_at };
}

function toQuote(row: z.infer<typeof quoteRow>): SupportSnapshot {
  return { tokenAddress: row.token_address, capturedAt: row.captured_at };
}

function printHeader(snapshot: CaseSnapshot): void {
  const wallet = snapshot.user.wallet;

  emit(`${snapshot.user.email}  ${snapshot.user.id}`);
  emit(
    `blackbird ${snapshot.user.flynetSubject ?? "not linked"}  ${snapshot.user.flynetName ?? ""}`.trim(),
  );
  emit(wallet ? `wallet ${wallet.address} chain ${wallet.chainId}` : "wallet none");
  emit(`fly_available ${formatFlyWei(snapshot.flyAvailable)}`);

  if (snapshot.chain) {
    emit(`chain head ${snapshot.chain.head.toString()}`);
  }

  for (const coin of snapshot.coins) {
    const destination = coin.restaurantName ?? "creator, until they lock a restaurant";

    emit(`${coin.symbol} ${coin.tokenAddress} creator ${coin.creatorAddress} fees ${destination}`);
  }
}

function printFindings(findings: readonly Finding[], verbose: boolean): void {
  const shown = verbose ? findings : findings.filter((item) => item.severity !== "ok");

  if (shown.length === 0) {
    emit("No stuck rows.");

    return;
  }

  for (const item of shown) {
    emit("");
    emit(`${item.severity.toUpperCase()}  ${item.code}`);
    emit(`user  ${item.userSees}`);
    emit(`db    ${item.dbSays}`);
    emit(`do    ${item.action}`);
  }
}

async function runCase(sql: Sql, cli: Extract<Cli, { kind: "case" }>): Promise<number> {
  const userId = await resolveUser(sql, cli.identity);

  if (!userId) {
    console.error("No user for that lookup.");

    return 1;
  }

  const now = new Date();
  const rewardsFloat = await readFloat();
  const preview = await loadSnapshot(sql, userId, cli.txs, null, rewardsFloat, now);

  if (!preview) {
    console.error("User id did not match a row.");

    return 1;
  }

  const hashes = [
    ...cli.txs,
    ...preview.launches
      .map((launch) => launch.txHash)
      .filter((hash): hash is string => hash !== null),
  ];

  const chain = await readChain(hashes);
  const snapshot = chain ? { ...preview, chain } : preview;
  const findings = assessCase(snapshot);

  if (cli.json) {
    emit(JSON.stringify(findings, null, 2));

    return findings.some((item) => item.severity === "human") ? 2 : 0;
  }

  printHeader(snapshot);
  printFindings(findings, cli.verbose);

  return findings.some((item) => item.severity === "human") ? 2 : 0;
}

async function queueUserIds(sql: Sql): Promise<string[]> {
  const rows = z.array(idRow).parse(
    await sql`
    select id from (
      select user_id as id from claims where status = 'pending'
      union
      select creator_user_id as id from fee_collections
      where status = 'pending' and creator_user_id is not null
        and indexed_at < now() - interval '15 minutes'
      union
      select user_id as id from launches
      where status in ('pending', 'failed')
        and simulate_payload->>'txHash' is not null
        and created_at < now() - interval '15 minutes'
      union
      select user_id as id from claim_shortfalls
      where created_at > now() - interval '7 days'
      union
      select creator_user_id as id from coins
      where restaurant_location_id is not null and creator_user_id is not null
        and not exists (
          select 1 from indexer_cursors
          where name = ${restaurantFeeCursor}
            and updated_at > now() - interval '26 hours'
        )
    ) queued
    where id is not null
    limit 40
  `,
  );

  return rows.map((row) => row.id);
}

async function runQueue(sql: Sql, json: boolean): Promise<number> {
  const [unassigned, owed, float, ids] = await Promise.all([
    sql`select count(*)::int as count from fee_collections where status = 'unassigned'`,
    sql`select coalesce(sum(amount_fly), 0)::text as total from fly_available`,
    readFloat(),
    queueUserIds(sql),
  ]);

  const unassignedCount = z.array(countRow).parse(unassigned)[0]?.count ?? 0;
  const claimable = z.array(sumRow).parse(owed)[0]?.total ?? BigInt(0);
  const now = new Date();
  const lines: Array<{ email: string; id: string; codes: string[] }> = [];

  /* eslint-disable no-await-in-loop -- each user reads several tables; loading all of them at once would stampede the database */
  for (const id of ids) {
    const snapshot = await loadSnapshot(sql, id, [], null, float, now);

    if (!snapshot) {
      continue;
    }

    const codes = [
      ...new Set(
        assessCase(snapshot)
          .filter((item) => item.severity === "human")
          .map((item) => item.code),
      ),
    ];

    if (codes.length > 0) {
      lines.push({ email: snapshot.user.email, id, codes });
    }
  }
  /* eslint-enable no-await-in-loop */

  if (json) {
    emit(
      JSON.stringify(
        {
          unassignedCount,
          claimable: claimable.toString(),
          rewardsFloat: float?.toString() ?? null,
          users: lines,
        },
        null,
        2,
      ),
    );

    return lines.length > 0 || unassignedCount > 0 ? 2 : 0;
  }

  emit(`unassigned fee logs ${unassignedCount}`);
  emit(`claimable ${formatFlyWei(claimable)}`);
  emit(float === null ? "rewards float unreadable" : `rewards float ${formatFlyWei(float)}`);

  if (float !== null && float < claimable) {
    emit(
      "HUMAN  rewards wallet does not cover claimable balances. Top it up before asking anyone to retry.",
    );
  }

  if (unassignedCount > 0) {
    emit("HUMAN  unassigned logs are not retried. Match each pool to a coin before crediting.");
  }

  if (lines.length === 0) {
    emit("No users in the stuck queue.");

    return unassignedCount > 0 || (float !== null && float < claimable) ? 2 : 0;
  }

  for (const line of lines) {
    emit(`${line.email}  ${line.id}  ${line.codes.join(" ")}`);
  }

  return 2;
}

async function main(): Promise<number> {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const cli = parseCli(process.argv.slice(2));

  if (cli.kind === "help") {
    help();

    return 0;
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("DATABASE_URL is not set.");

    return 1;
  }

  const sql = postgres(databaseUrl, { max: 1, idle_timeout: 5 });

  try {
    switch (cli.kind) {
      case "queue":
        return await runQueue(sql, cli.json);
      case "case":
        return await runCase(sql, cli);
      default: {
        const unreachable: never = cli;

        throw new Error(`Unhandled ${JSON.stringify(unreachable)}`);
      }
    }
  } finally {
    await sql.end();
  }
}

const code = await main();

process.exit(code);
