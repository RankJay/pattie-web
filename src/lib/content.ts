import { Bot, FlaskConical, Music4, Shuffle, type LucideIcon } from "lucide-react";

export type Tone = "fg" | "muted" | "amber";

export interface InstallTab {
  label: string;
  command: string;
}

export interface CodeLine {
  id: string;
  text: string;
  tone: Tone;
}

export interface SoundRow {
  label: string;
  active: boolean;
}

export interface Stat {
  value: string;
  label: string;
}

export interface UseCase {
  icon: LucideIcon;
  title: string;
  body: string;
  tag: string;
}

export interface Step {
  index: string;
  title: string;
  body: string;
}

export interface BenchmarkRow {
  label: string;
  value: string;
  barClass: string;
  valueTone: Tone;
}

export interface Term {
  term: string;
  meaning: string;
}

export interface StatusRow {
  label: string;
  value: string;
  tone: Tone;
}

export interface FooterColumn {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}

export const installTabs: readonly InstallTab[] = [
  { label: "Rust", command: "cargo add pattie" },
  { label: "Python", command: "pip install pattie" },
  { label: "CLI", command: 'pattie-cli mic "Agent Mic"' },
];

export const agentLine = {
  lead: "or tell your agent",
  prompt: "❯ add a virtual mic called “Agent Mic” to my app, using pattie",
};

export const heroCode: readonly CodeLine[] = [
  { id: "import", text: "use pattie::{Device, Kind};", tone: "muted" },
  { id: "gap-1", text: "", tone: "fg" },
  { id: "builder", text: "let mic = Device::builder()", tone: "fg" },
  { id: "name", text: '    .name("Agent Mic")', tone: "amber" },
  { id: "kind", text: "    .kind(Kind::Microphone)", tone: "fg" },
  { id: "format", text: "    .format(48_000, 1)", tone: "fg" },
  { id: "create", text: "    .create()?;", tone: "fg" },
  { id: "gap-2", text: "", tone: "fg" },
  { id: "writer", text: "let mut tx = mic.writer()?;", tone: "fg" },
  { id: "write", text: "tx.write(&samples)?;  // Zoom hears this", tone: "muted" },
  { id: "drop", text: "// drop(mic): the device disappears", tone: "muted" },
];

export const soundRows: readonly SoundRow[] = [
  { label: "Microphone (Realtek Audio)", active: false },
  { label: "Microphone (Agent Mic)", active: true },
];

export const apps = ["Zoom", "Teams", "OBS", "Discord", "Sound Recorder", "Your agent"] as const;

export const stats: readonly Stat[] = [
  { value: "~28 ms", label: "speaker latency" },
  { value: "~40 ms", label: "mic latency, vs ~109 ms VB-CABLE" },
  { value: "<0.2%", label: "of one core per stream" },
  { value: "0", label: "dropouts in a real Zoom call" },
];

export const scenarios: readonly UseCase[] = [
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

export const steps: readonly Step[] = [
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

export const benchmark: readonly BenchmarkRow[] = [
  { label: "pattie speaker", value: "28 ms", barClass: "w-[19.6%] bg-amber", valueTone: "amber" },
  { label: "pattie mic", value: "40 ms", barClass: "w-[28%] bg-amber", valueTone: "amber" },
  { label: "VB-CABLE", value: "109 ms", barClass: "w-[76.2%] bg-dim", valueTone: "muted" },
];

export const vocabulary: readonly Term[] = [
  { term: "Device", meaning: "A virtual mic or speaker an app created." },
  { term: "Kind", meaning: "Microphone (app → Windows) or Speaker (Windows → app)." },
  { term: "Ring", meaning: "Shared-memory buffer of 32-bit float frames." },
  { term: "Gap", meaning: "Frames needed but missing. Silence played, counted." },
  { term: "Overflow", meaning: "Frames written that did not fit. Dropped, counted." },
  { term: "Owner", meaning: "The app handle. When it closes, its Devices go." },
];

export const standsRows: readonly StatusRow[] = [
  { label: "Zoom test call, mic + speaker", value: "0 dropouts ✓", tone: "amber" },
  { label: "One hour of streaming", value: "no drift ✓", tone: "amber" },
  { label: "8 devices from 8 apps", value: "works ✓", tone: "amber" },
  { label: "Signed install, Secure Boot on", value: "next · v0 gate ⏳", tone: "muted" },
];

export const platformRows: readonly StatusRow[] = [
  { label: "Windows 11 (ACX driver)", value: "v0 ✓", tone: "amber" },
  { label: "Linux (PipeWire, no driver)", value: "works ✓", tone: "amber" },
  { label: "Python binding", value: "works ✓", tone: "amber" },
  { label: "macOS", value: "later", tone: "muted" },
];

export const agentPrompt = {
  title: "Loved by humans, and by the agents they send.",
  body: "Paste this into your coding agent. It reads the README, adds the SDK, and creates your first device.",
  prompt:
    "Read the Pattie README and add a virtual microphone named “Agent Mic” to this Rust app, then write a 440 Hz test tone to it.",
};
