import { InstallTabs } from "@/components/install-tabs";
import { Section } from "@/components/section";
import { ButtonLink } from "@/components/smart-link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { links } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Mic } from "lucide-react";

const soundRows = [
  { label: "Microphone (Realtek Audio)", active: false },
  { label: "Microphone (Agent Mic)", active: true },
];

const codeLine = "block whitespace-pre";

function HeroCopy() {
  return (
    <div className="flex min-w-0 flex-col gap-7">
      <Badge variant="outline">v0 · Windows + Linux · not yet released</Badge>
      <h1 className="font-display text-foreground text-4xl leading-[1.05] font-extrabold tracking-[-0.055em] sm:text-5xl lg:text-[56px]">
        <span className="block">Virtual audio devices,</span>
        <span className="block">
          made by your <span className="text-primary">app.</span>
        </span>
      </h1>
      <p className="text-muted-foreground max-w-xl text-base leading-normal sm:text-lg lg:text-[19px]">
        Named virtual microphones and speakers that any app can create, and every other app sees as
        real audio devices. No VB-CABLE. No reboot. No admin prompt in your app.
      </p>
      <InstallTabs />
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[13px]">
        <span className="text-muted-foreground">or tell your agent</span>
        <span className="text-primary">
          ❯ add a virtual mic called “Agent Mic” to my app, using pattie
        </span>
      </p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href={links.docs} variant="default">
          Get started →
        </ButtonLink>
        <ButtonLink href={links.docs} variant="secondary">
          Read the docs
        </ButtonLink>
      </div>
    </div>
  );
}

function HeroCode() {
  return (
    <Card className="min-w-0">
      <div className="border-border text-muted-foreground border-b px-5 py-3.5 font-mono text-[13px]">
        main.rs
      </div>
      <pre className="flex flex-col gap-1.5 overflow-x-auto p-5 font-mono text-[13px] leading-5 sm:p-7 sm:text-[15px]">
        <code className="contents">
          <span className={cn(codeLine, "text-muted-foreground")}>
            {"use pattie::{Device, Kind};"}
          </span>
          <span className={codeLine}>{" "}</span>
          <span className={codeLine}>{"let mic = Device::builder()"}</span>
          <span className={cn(codeLine, "text-primary")}>{'    .name("Agent Mic")'}</span>
          <span className={codeLine}>{"    .kind(Kind::Microphone)"}</span>
          <span className={codeLine}>{"    .format(48_000, 1)"}</span>
          <span className={codeLine}>{"    .create()?;"}</span>
          <span className={codeLine}>{" "}</span>
          <span className={codeLine}>{"let mut tx = mic.writer()?;"}</span>
          <span className={cn(codeLine, "text-muted-foreground")}>
            {"tx.write(&samples)?;  // Zoom hears this"}
          </span>
          <span className={cn(codeLine, "text-muted-foreground")}>
            {"// drop(mic): the device disappears"}
          </span>
        </code>
      </pre>
      <div className="border-border border-t">
        <div className="bg-inset text-muted-foreground flex items-center justify-between gap-4 px-5 py-3 font-mono text-[11px] sm:px-7">
          <span className="tracking-[0.14em] whitespace-nowrap">WINDOWS · SOUND · INPUT</span>
          <span className="hidden shrink-0 sm:inline">what Zoom sees</span>
        </div>
        {soundRows.map((row) => (
          <div
            key={row.label}
            className={cn(
              "flex items-center gap-3 px-5 py-3.5 sm:px-7",
              row.active && "bg-primary/12",
            )}
          >
            <Mic
              className={cn(
                "size-4.5 shrink-0",
                row.active ? "text-primary" : "text-muted-foreground",
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                "min-w-0 flex-1 truncate font-mono text-sm",
                row.active ? "text-primary" : "text-muted-foreground",
              )}
            >
              {row.label}
            </span>
            {row.active ? <Badge>NEW</Badge> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}

export function Hero() {
  return (
    <Section className="grid gap-12 py-12 sm:py-16 lg:grid-cols-2 lg:items-center lg:pt-22 lg:pb-24">
      <HeroCopy />
      <HeroCode />
    </Section>
  );
}
