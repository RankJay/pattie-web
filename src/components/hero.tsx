import { Section } from "@/components/section";
import { ButtonLink, SmartLink } from "@/components/smart-link";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { links } from "@/lib/constants";
import { cn } from "@/lib/utils";

const benchmarkScaleMs = 143;

const benchmark = [
  { label: "pattie speaker", ms: 28, highlight: true },
  { label: "pattie mic", ms: 40, highlight: true },
  { label: "VB-CABLE", ms: 109, highlight: false },
];

function HeroCopy() {
  return (
    <div className="flex min-w-0 flex-col gap-7">
      <Badge variant="outline">v0 · Windows + Linux · pre-release</Badge>
      <h1 className="font-display text-foreground text-4xl leading-[1.02] font-extrabold tracking-[-0.055em] sm:text-5xl lg:text-[60px]">
        Virtual audio devices, <span className="text-amber-ink">created from code.</span>
      </h1>
      <p className="text-muted-foreground max-w-xl text-lg leading-normal lg:text-[19px]">
        Your app creates a named microphone or speaker. Other apps list it like ordinary hardware.
        One call creates it, one call drops it, and your users never install a virtual cable.
      </p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href={links.readme} variant="default">
          Read the README
        </ButtonLink>
        <ButtonLink href={links.discord} variant="secondary">
          Join the Discord
        </ButtonLink>
      </div>
    </div>
  );
}

function HeroProof() {
  return (
    <Card className="min-w-0 gap-5 p-5 sm:p-8">
      <CardHeader>
        <p className="font-display text-foreground text-xl font-bold">
          Added latency on the same Windows 11 VM
        </p>
        <CardDescription>milliseconds · lower is better</CardDescription>
      </CardHeader>
      {benchmark.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 sm:grid-cols-[8.75rem_1fr_5rem]"
        >
          <span className="text-foreground font-mono text-sm">{row.label}</span>
          <div className="border-border bg-muted order-3 col-span-2 h-7 border sm:order-none sm:col-span-1">
            <div
              className={cn("h-full", row.highlight ? "bg-amber" : "bg-dim")}
              style={{ width: `${(row.ms / benchmarkScaleMs) * 100}%` }}
            />
          </div>
          <span
            className={cn(
              "font-mono text-lg font-bold",
              row.highlight ? "text-amber-ink" : "text-muted-foreground",
            )}
          >
            {row.ms} ms
          </span>
        </div>
      ))}
      <p className="text-muted-foreground font-mono text-[11px] leading-normal">
        One run per row on a VMware guest, VB-CABLE at its defaults. Our goal is under 10 ms;
        Windows' default engine period sets today's floor.{" "}
        <SmartLink href={links.method} className="text-foreground underline underline-offset-4">
          Method and raw output
        </SmartLink>
      </p>
    </Card>
  );
}

export function Hero() {
  return (
    <Section className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:pt-22 lg:pb-24">
      <HeroCopy />
      <HeroProof />
    </Section>
  );
}
