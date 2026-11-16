import { Section, SectionHeading } from "@/components/section";
import { ButtonLink } from "@/components/smart-link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { links } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Bot, FlaskConical, Music4, Shuffle } from "lucide-react";

const apps = ["Zoom", "Teams", "OBS", "Discord", "Sound Recorder", "Your agent"];

export function WorksWith() {
  return (
    <Section
      outerClassName="border-t border-border"
      className="flex flex-wrap items-center gap-x-10 gap-y-4 py-7"
    >
      <p className="text-muted-foreground w-full font-mono text-xs tracking-[0.17em] sm:w-auto">
        APPS THAT SEE IT
      </p>
      {apps.map((app) => (
        <span key={app} className="font-display text-faint text-xl font-bold sm:text-[22px]">
          {app}
        </span>
      ))}
    </Section>
  );
}

const stats = [
  { value: "~28 ms", label: "speaker latency" },
  { value: "~40 ms", label: "mic latency, vs ~109 ms VB-CABLE" },
  { value: "<0.2%", label: "of one core per stream" },
  { value: "0", label: "dropouts in a real Zoom call" },
];

export function Stats() {
  return (
    <Section>
      <dl className="border-border grid grid-cols-2 border lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse gap-2 p-5 sm:p-7">
            <dd className="text-muted-foreground text-sm">{stat.label}</dd>
            <dt className="text-primary font-mono text-3xl font-bold sm:text-4xl lg:text-[40px]">
              {stat.value}
            </dt>
          </div>
        ))}
      </dl>
    </Section>
  );
}

const scenarios = [
  {
    icon: Bot,
    title: "AI voice agents",
    body: "Give your agent a mic Zoom can pick. Hear the call on a speaker you own.",
    tag: "Kind::Microphone",
  },
  {
    icon: Music4,
    title: "Soundboards",
    body: "One named mic. Any app can use your clips, no cable required.",
    tag: 'name("Soundboard")',
  },
  {
    icon: Shuffle,
    title: "Audio routers",
    body: "Create a Speaker, read its stream, send it anywhere.",
    tag: "Kind::Speaker",
  },
  {
    icon: FlaskConical,
    title: "Test automation",
    body: "Feed known audio into real apps in CI. Devices vanish on drop.",
    tag: "drop(mic)",
  },
];

export function Scenarios() {
  return (
    <Section className="flex flex-col gap-9 pt-16 pb-6 lg:pt-26">
      <SectionHeading
        eyebrow="BUILT FOR APPS THAT TALK"
        title="If your app makes sound, give it a name."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {scenarios.map((item) => (
          <Card key={item.title} className="gap-3.5 p-6">
            <item.icon className="text-primary size-6" aria-hidden="true" />
            <CardTitle className="text-[21px]">{item.title}</CardTitle>
            <p className="text-muted-foreground text-[15px] leading-normal">{item.body}</p>
            <code className="text-primary font-mono text-[13px]">{item.tag}</code>
          </Card>
        ))}
      </div>
    </Section>
  );
}

const steps = [
  {
    index: "01",
    title: "Root device",
    body: "One permanent Root\\Pattie device makes Windows load the driver.",
  },
  {
    index: "02",
    title: "Create a Device",
    body: "The SDK shares a ring buffer and sends name, kind and format.",
  },
  {
    index: "03",
    title: "Stream",
    body: "Samples move through shared memory. No syscalls per buffer.",
  },
  {
    index: "04",
    title: "Drop",
    body: "Close or crash, and the endpoint vanishes. Nothing leaks.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="flex flex-col gap-10 pt-16 pb-10 lg:pt-26">
      <SectionHeading eyebrow="HOW IT WORKS" title="Your app writes. The kernel does the rest." />
      <ol className="border-border grid border sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <li key={step.index} className="flex flex-col gap-3.5 p-6 sm:p-7">
            <span className="text-primary font-mono text-sm">{step.index}</span>
            <h3 className="font-display text-foreground text-[22px] font-bold">{step.title}</h3>
            <p className="text-muted-foreground text-[15px] leading-normal">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

const benchmarkScaleMs = 143;

const benchmark = [
  { label: "pattie speaker", ms: 28, highlight: true },
  { label: "pattie mic", ms: 40, highlight: true },
  { label: "VB-CABLE", ms: 109, highlight: false },
];

export function Benchmark() {
  return (
    <Section className="py-14">
      <Card className="gap-5 p-5 sm:p-8">
        <CardHeader>
          <CardTitle>Added latency, VMware Windows 11</CardTitle>
          <CardDescription>milliseconds (lower is better)</CardDescription>
        </CardHeader>
        {benchmark.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 sm:grid-cols-[8.75rem_1fr_5rem]"
          >
            <span className="text-foreground font-mono text-sm">{row.label}</span>
            <div className="bg-muted order-3 col-span-2 h-7 sm:order-none sm:col-span-1">
              <div
                className={cn("h-full", row.highlight ? "bg-primary" : "bg-dim")}
                style={{ width: `${(row.ms / benchmarkScaleMs) * 100}%` }}
              />
            </div>
            <span
              className={cn(
                "font-mono text-lg font-bold",
                row.highlight ? "text-primary" : "text-muted-foreground",
              )}
            >
              {row.ms} ms
            </span>
          </div>
        ))}
      </Card>
    </Section>
  );
}

const vocabulary = [
  { term: "Device", meaning: "A virtual mic or speaker an app created." },
  { term: "Kind", meaning: "Microphone (app → Windows) or Speaker (Windows → app)." },
  { term: "Ring", meaning: "Shared-memory buffer of 32-bit float frames." },
  { term: "Gap", meaning: "Frames needed but missing. Silence played, counted." },
  { term: "Overflow", meaning: "Frames written that did not fit. Dropped, counted." },
  { term: "Owner", meaning: "The app handle. When it closes, its Devices go." },
];

export function Vocabulary() {
  return (
    <Section className="flex flex-col gap-7 py-14 lg:py-18">
      <p className="eyebrow">THE VOCABULARY</p>
      <dl className="border-border grid border md:grid-cols-2">
        {vocabulary.map((item) => (
          <div
            key={item.term}
            className="border-border flex flex-col gap-1.5 border-b p-6 last:border-b-0 sm:p-7 md:nth-last-2:border-b-0"
          >
            <dt className="text-primary font-mono text-lg font-semibold">{item.term}</dt>
            <dd className="text-muted-foreground text-[15px]">{item.meaning}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

const standsRows = [
  { label: "Zoom test call, mic + speaker", value: "0 dropouts ✓", done: true },
  { label: "One hour of streaming", value: "no drift ✓", done: true },
  { label: "8 devices from 8 apps", value: "works ✓", done: true },
  { label: "Signed install, Secure Boot on", value: "next · v0 gate ⏳", done: false },
];

const platformRows = [
  { label: "Windows 11 (ACX driver)", value: "v0 ✓", done: true },
  { label: "Linux (PipeWire, no driver)", value: "works ✓", done: true },
  { label: "Python binding", value: "works ✓", done: true },
  { label: "macOS", value: "later", done: false },
];

interface StatusPanelProps {
  title: string;
  rows: typeof standsRows;
}

function StatusPanel({ title, rows }: StatusPanelProps) {
  return (
    <Card>
      <CardHeader className="border-border border-b px-5 py-4 sm:px-6">
        <CardTitle className="text-muted-foreground font-mono text-xs font-normal tracking-[0.12em]">
          {title}
        </CardTitle>
      </CardHeader>
      {rows.map((row) => (
        <div key={row.label} className="status-row">
          <span className="text-foreground min-w-0 flex-1 text-[15px]">{row.label}</span>
          <span
            className={cn(
              "shrink-0 font-mono text-[13px]",
              row.done ? "text-primary" : "text-muted-foreground",
            )}
          >
            {row.value}
          </span>
        </div>
      ))}
    </Card>
  );
}

export function Status() {
  return (
    <Section id="status" className="grid gap-4 pt-6 pb-16 lg:grid-cols-2 lg:pb-24">
      <StatusPanel title="WHERE IT STANDS" rows={standsRows} />
      <StatusPanel title="PLATFORMS & BINDINGS" rows={platformRows} />
    </Section>
  );
}

export function AgentPrompt() {
  return (
    <Section className="pb-16 lg:pb-24">
      <Card className="gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:gap-10">
        <div className="flex flex-col gap-3 lg:flex-1">
          <h2 className="font-display text-foreground text-2xl leading-[1.1] font-extrabold tracking-[-0.03em] sm:text-3xl lg:text-[32px]">
            Loved by humans, and by the agents they send.
          </h2>
          <p className="text-muted-foreground text-base leading-normal">
            Paste this into your coding agent. It reads the README, adds the SDK, and creates your
            first device.
          </p>
        </div>
        <p className="border-border bg-background text-primary border p-5 font-mono text-sm leading-[1.6] lg:flex-1">
          Read the Pattie README and add a virtual microphone named “Agent Mic” to this Rust app,
          then write a 440 Hz test tone to it.
        </p>
      </Card>
    </Section>
  );
}

export function FinalCta() {
  return (
    <Section outerClassName="bg-primary" className="flex flex-col gap-6 py-16 lg:py-22">
      <h2 className="font-display text-brown max-w-200 text-4xl leading-none font-extrabold tracking-[-0.05em] sm:text-5xl lg:text-[64px]">
        Stop telling users to install a cable.
      </h2>
      <p className="text-brown text-base sm:text-[19px]">
        Add Pattie to your Rust app and ship real virtual devices.
      </p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href={links.docs} variant="brand">
          Get started →
        </ButtonLink>
        <ButtonLink href={links.github} variant="cream">
          View on GitHub
        </ButtonLink>
        <ButtonLink href={links.discord} variant="brand-outline">
          Join the Discord
        </ButtonLink>
      </div>
    </Section>
  );
}
