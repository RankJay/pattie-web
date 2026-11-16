import { ButtonLink, Section, SectionHeading, toneClass } from "@/components/ui";
import { links } from "@/lib/constants";
import {
  agentPrompt,
  apps,
  benchmark,
  platformRows,
  standsRows,
  stats,
  steps,
  scenarios,
  vocabulary,
  type StatusRow,
} from "@/lib/content";

export function WorksWith() {
  return (
    <Section
      outerClassName="border-t border-line"
      className="flex flex-wrap items-center gap-x-10 gap-y-4 py-7"
    >
      <p className="text-muted w-full font-mono text-xs tracking-[0.17em] sm:w-auto">
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

export function Stats() {
  return (
    <Section>
      <dl className="border-line grid grid-cols-2 border lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse gap-2 p-5 sm:p-7">
            <dd className="text-muted text-sm">{stat.label}</dd>
            <dt className="text-amber font-mono text-3xl font-bold sm:text-4xl lg:text-[40px]">
              {stat.value}
            </dt>
          </div>
        ))}
      </dl>
    </Section>
  );
}

export function Scenarios() {
  return (
    <Section className="flex flex-col gap-9 pt-16 pb-6 lg:pt-26">
      <SectionHeading
        eyebrow="BUILT FOR APPS THAT TALK"
        title="If your app makes sound, give it a name."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {scenarios.map((item) => (
          <article key={item.title} className="panel flex flex-col gap-3.5 p-6">
            <item.icon className="text-amber size-6" aria-hidden="true" />
            <h3 className="font-display text-fg text-[21px] font-bold">{item.title}</h3>
            <p className="text-muted text-[15px] leading-normal">{item.body}</p>
            <code className="text-amber font-mono text-[13px]">{item.tag}</code>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="flex flex-col gap-10 pt-16 pb-10 lg:pt-26">
      <SectionHeading eyebrow="HOW IT WORKS" title="Your app writes. The kernel does the rest." />
      <ol className="border-line grid border sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <li key={step.index} className="flex flex-col gap-3.5 p-6 sm:p-7">
            <span className="text-amber font-mono text-sm">{step.index}</span>
            <h3 className="font-display text-fg text-[22px] font-bold">{step.title}</h3>
            <p className="text-muted text-[15px] leading-normal">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Benchmark() {
  return (
    <Section className="py-14">
      <div className="panel flex flex-col gap-5 p-5 sm:p-8">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-fg text-xl font-bold">
            Added latency, VMware Windows 11
          </h3>
          <p className="text-muted text-[13px]">milliseconds (lower is better)</p>
        </div>
        {benchmark.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 sm:grid-cols-[8.75rem_1fr_5rem]"
          >
            <span className="text-fg font-mono text-sm">{row.label}</span>
            <div className="bg-track order-3 col-span-2 h-7 sm:order-none sm:col-span-1">
              <div className={`h-full ${row.barClass}`} />
            </div>
            <span
              className={`font-mono text-lg font-bold sm:text-left ${toneClass[row.valueTone]}`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Vocabulary() {
  return (
    <Section className="flex flex-col gap-7 py-14 lg:py-18">
      <p className="eyebrow">THE VOCABULARY</p>
      <dl className="border-line grid border md:grid-cols-2">
        {vocabulary.map((item) => (
          <div
            key={item.term}
            className="border-line flex flex-col gap-1.5 border-b p-6 last:border-b-0 sm:p-7 md:nth-last-2:border-b-0"
          >
            <dt className="text-amber font-mono text-lg font-semibold">{item.term}</dt>
            <dd className="text-muted text-[15px]">{item.meaning}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

interface StatusPanelProps {
  title: string;
  rows: readonly StatusRow[];
}

function StatusPanel({ title, rows }: StatusPanelProps) {
  return (
    <div className="panel flex flex-col">
      <h3 className="border-line text-muted border-b px-5 py-4 font-mono text-xs tracking-[0.12em] sm:px-6">
        {title}
      </h3>
      {rows.map((row) => (
        <div key={row.label} className="status-row">
          <span className="text-fg min-w-0 flex-1 text-[15px]">{row.label}</span>
          <span className={`shrink-0 font-mono text-[13px] ${toneClass[row.tone]}`}>
            {row.value}
          </span>
        </div>
      ))}
    </div>
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
      <div className="panel flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-center lg:gap-10">
        <div className="flex flex-col gap-3 lg:flex-1">
          <h2 className="font-display text-fg text-2xl leading-[1.1] font-extrabold tracking-[-0.03em] sm:text-3xl lg:text-[32px]">
            {agentPrompt.title}
          </h2>
          <p className="text-muted text-base leading-normal">{agentPrompt.body}</p>
        </div>
        <p className="border-line bg-bg text-amber border p-5 font-mono text-sm leading-[1.6] lg:flex-1">
          {agentPrompt.prompt}
        </p>
      </div>
    </Section>
  );
}

export function FinalCta() {
  return (
    <Section outerClassName="bg-amber" className="flex flex-col gap-6 py-16 lg:py-22">
      <h2 className="font-display text-brown max-w-200 text-4xl leading-none font-extrabold tracking-[-0.05em] sm:text-5xl lg:text-[64px]">
        Stop telling users to install a cable.
      </h2>
      <p className="text-brown text-base sm:text-[19px]">
        Add Pattie to your Rust app and ship real virtual devices.
      </p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href={links.docs} variant="ctaPrimary">
          Get started →
        </ButtonLink>
        <ButtonLink href={links.github} variant="ctaSecondary">
          View on GitHub
        </ButtonLink>
        <ButtonLink href={links.discord} variant="ctaOutline">
          Join the Discord
        </ButtonLink>
      </div>
    </Section>
  );
}
