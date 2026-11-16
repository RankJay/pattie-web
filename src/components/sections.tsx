import { CopyButton } from "@/components/copy-button";
import { Section, SectionHeading } from "@/components/section";
import { ButtonLink, SmartLink } from "@/components/smart-link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardTitle } from "@/components/ui/card";
import { links } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Bot, Music4, Radio, Shuffle } from "lucide-react";

const scenarios = [
  {
    icon: Bot,
    title: "AI voice agents",
    body: "Give your agent a mic Zoom can pick. interrupt() stops the reply and reports how much the listener heard.",
    tag: "Playout.interrupt()",
  },
  {
    icon: Music4,
    title: "Soundboards",
    body: "One named mic. Any app can use your clips, and nobody installs a cable.",
    tag: 'name("Soundboard")',
  },
  {
    icon: Shuffle,
    title: "Audio routers",
    body: "Create a Speaker, read what apps play to it, send it anywhere.",
    tag: "Kind::Speaker",
  },
  {
    icon: Radio,
    title: "Live relays",
    body: "Relay a call or capture card through a LiveWriter. Drift compensation is built in.",
    tag: "LiveWriter",
  },
];

export function Scenarios() {
  return (
    <Section className="flex flex-col gap-9 pb-16 lg:pb-24">
      <SectionHeading
        eyebrow="BUILT FOR APPS THAT TALK"
        title="If your app makes sound, give it a name."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {scenarios.map((item) => (
          <Card key={item.title} className="gap-3.5 p-6">
            <item.icon className="text-amber-ink size-6" aria-hidden="true" />
            <CardTitle className="text-[21px]">{item.title}</CardTitle>
            <p className="text-muted-foreground text-[15px] leading-normal">{item.body}</p>
            <code className="text-amber-ink font-mono text-[13px]">{item.tag}</code>
          </Card>
        ))}
      </div>
    </Section>
  );
}

const standsRows = [
  { label: "Zoom test call, about 2 minutes", value: "0 Gap, 0 Overflow", done: true },
  { label: "One hour of mic streaming", value: "no latency drift", done: true },
  { label: "Every core at full load", value: "latency unchanged", done: true },
  { label: "CPU cost per stream", value: "under 0.2% of a core", done: true },
  { label: "8 Devices from 8 apps", value: "created and removed cleanly", done: true },
  { label: "Security review of the driver", value: "findings fixed or documented", done: true },
];

const platformRows = [
  { label: "Windows 11", value: "available", done: true },
  { label: "Linux (PipeWire, no driver)", value: "available", done: true },
  { label: "Rust SDK and CLI", value: "available", done: true },
  { label: "Python 3.14 and newer", value: "available", done: true },
  { label: "macOS", value: "later", done: false },
  { label: "Node", value: "later", done: false },
];

interface StatusPanelProps {
  title: string;
  rows: typeof standsRows;
}

function StatusPanel({ title, rows }: StatusPanelProps) {
  return (
    <Card>
      <h3 className="border-border text-muted-foreground border-b px-5 py-4 font-mono text-xs tracking-[0.12em] sm:px-6">
        {title}
      </h3>
      {rows.map((row) => (
        <div key={row.label} className="status-row">
          <span className="text-foreground min-w-0 flex-1 text-[15px]">{row.label}</span>
          <span
            className={cn(
              "shrink-0 font-mono text-[13px]",
              row.done ? "text-amber-ink" : "text-muted-foreground",
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
    <Section id="status" className="flex flex-col gap-9 pb-16 lg:pb-24">
      <SectionHeading eyebrow="STATUS" title="Where it stands, measured." />
      <div className="grid gap-4 lg:grid-cols-2">
        <StatusPanel title="WHAT WE MEASURED" rows={standsRows} />
        <StatusPanel title="PLATFORMS AND BINDINGS" rows={platformRows} />
      </div>
    </Section>
  );
}

const faqs = [
  {
    id: "driver",
    question: "Is it safe to load a kernel driver?",
    answer:
      "The logic lives in a small C core that runs on any PC under test: 98.98% line coverage, no missed mutants, and a fuzzer run of 5.3 million inputs with no finding. The kernel part only copies audio. Driver Verifier reported no violations in our security-review runs. Try it in a VM first.",
  },
  {
    id: "admin",
    question: "Does my app need admin rights?",
    answer:
      "No. Installing the driver is a separate admin step, done once. After that, any app can create a Device without elevation.",
  },
  {
    id: "crash",
    question: "What happens when my app crashes?",
    answer:
      "The Device disappears right away, like unplugging hardware. The Ring memory is released and Windows keeps running. We killed an app mid-stream under Driver Verifier and nothing crashed.",
  },
  {
    id: "cable",
    question: "Why not VB-CABLE?",
    answer:
      "A cable is a fixed pair of devices that you route by hand. Pattie lets each app create its own named Device. On the same test VM, one run each, it adds about 40 ms on the mic against about 109 ms for VB-CABLE.",
  },
  {
    id: "agents",
    question: "Can my AI agent use it?",
    answer:
      "Yes. Create a Microphone from Rust or Python, write the agent's speech into it, and Zoom hears it. Playout.interrupt() stops a reply mid-sentence and returns how much was heard. A Pipecat transport is built and tested against the SDK.",
  },
  {
    id: "limits",
    question: "How many Devices can I create?",
    answer:
      "Up to 8 on a machine, in 44.1, 48 or 96 kHz with 1 to 8 channels. Changing a Device's format makes a new Device, so listeners pick it again.",
  },
];

export function Faq() {
  return (
    <Section id="faq" className="flex flex-col gap-9 pb-16 lg:pb-24">
      <SectionHeading eyebrow="FAQ" title="Questions we would ask." />
      <Accordion type="single" collapsible defaultValue="driver" className="border-border border-y">
        {faqs.map((item) => (
          <AccordionItem key={item.id} value={item.id} className="border-border">
            <AccordionTrigger className="font-display text-foreground py-5 text-lg font-bold hover:no-underline sm:text-xl">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground max-w-3xl pb-6 text-base leading-normal">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}

const promptStart = "Read ";

const promptEnd = `. Then add a virtual microphone named "Agent Mic" to this Rust app using the Pattie SDK from that repository (it is not on crates.io yet), and write a 440 Hz test tone to it. On Windows, test in a VM first.`;

const agentPrompt = `${promptStart}${links.readme}${promptEnd}`;

export function FinalCta() {
  return (
    <Section
      outerClassName="bg-amber"
      className="grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-22"
    >
      <div className="flex flex-col gap-6">
        <p className="text-brown font-mono text-[13px] tracking-[0.15em]">FOR AI AGENTS</p>
        <h2 className="font-display text-brown text-4xl leading-none font-extrabold tracking-[-0.05em] sm:text-5xl lg:text-[60px]">
          Your agent needs a microphone.
        </h2>
        <p className="text-brown max-w-xl text-lg leading-normal">
          Other apps list a Pattie Device as an ordinary microphone, so an agent can speak into a
          call, and stop mid-sentence when you talk over it. Paste the prompt into your coding agent
          and let it build the first one.
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={links.readme} variant="brand">
            Read the README
          </ButtonLink>
          <ButtonLink href={links.discord} variant="on-amber">
            Join the Discord
          </ButtonLink>
        </div>
      </div>
      <Card className="bg-code text-code-foreground min-w-0 gap-0 border-transparent p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <span className="text-code-muted font-mono text-xs tracking-[0.15em]">
            PASTE INTO YOUR CODING AGENT
          </span>
          <CopyButton
            value={agentPrompt}
            label="Copy"
            className="text-code-foreground hover:bg-code-foreground/10 hover:text-code-foreground"
          />
        </div>
        <p className="mt-5 font-mono text-[15px] leading-7 break-words">
          {promptStart}
          <span className="text-amber">{links.readme}</span>
          {promptEnd}
        </p>
        <p className="border-code-foreground/15 text-code-muted mt-6 border-t pt-4 font-mono text-xs">
          Reading this as an agent?{" "}
          <SmartLink href="/llms.txt" className="text-code-foreground underline underline-offset-4">
            /llms.txt
          </SmartLink>{" "}
          has the short version.
        </p>
      </Card>
    </Section>
  );
}
