import { InstallTabs } from "@/components/install-tabs";
import { ButtonLink, Section, toneClass } from "@/components/ui";
import { links } from "@/lib/constants";
import { agentLine, heroCode, soundRows } from "@/lib/content";
import { Mic } from "lucide-react";

function HeroCopy() {
  return (
    <div className="flex min-w-0 flex-col gap-7">
      <p className="border-line text-muted w-fit border px-3 py-1.5 font-mono text-[13px]">
        v0 · Windows + Linux · not yet released
      </p>
      <h1 className="font-display text-fg text-4xl leading-[1.05] font-extrabold tracking-[-0.055em] sm:text-5xl lg:text-[56px]">
        <span className="block">Virtual audio devices,</span>
        <span className="block">
          made by your <span className="text-amber">app.</span>
        </span>
      </h1>
      <p className="text-muted max-w-xl text-base leading-normal sm:text-lg lg:text-[19px]">
        Named virtual microphones and speakers that any app can create, and every other app sees as
        real audio devices. No VB-CABLE. No reboot. No admin prompt in your app.
      </p>
      <InstallTabs />
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[13px]">
        <span className="text-muted">{agentLine.lead}</span>
        <span className="text-amber">{agentLine.prompt}</span>
      </p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href={links.docs} variant="primary">
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
    <div className="panel flex min-w-0 flex-col">
      <div className="border-line flex items-center gap-2 border-b px-5 py-3.5">
        <span className="text-muted font-mono text-[13px]">main.rs</span>
      </div>
      <pre className="flex flex-col gap-1.5 overflow-x-auto p-5 font-mono text-[13px] leading-5 sm:p-7 sm:text-[15px]">
        <code className="contents">
          {heroCode.map((line) => (
            <span key={line.id} className={`block whitespace-pre ${toneClass[line.tone]}`}>
              {line.text || " "}
            </span>
          ))}
        </code>
      </pre>
      <div className="border-line border-t">
        <div className="bg-inset text-muted flex items-center justify-between gap-4 px-5 py-3 font-mono text-[11px] sm:px-7">
          <span className="tracking-[0.14em] whitespace-nowrap">WINDOWS · SOUND · INPUT</span>
          <span className="hidden shrink-0 sm:inline">what Zoom sees</span>
        </div>
        {soundRows.map((row) => (
          <div
            key={row.label}
            className={`flex items-center gap-3 px-5 py-3.5 sm:px-7 ${row.active ? "bg-amber/12" : ""}`}
          >
            <Mic
              className={`size-4.5 shrink-0 ${row.active ? "text-amber" : "text-muted"}`}
              aria-hidden="true"
            />
            <span
              className={`min-w-0 flex-1 truncate font-mono text-sm ${row.active ? "text-amber" : "text-muted"}`}
            >
              {row.label}
            </span>
            {row.active ? (
              <span className="bg-amber text-bg px-2 py-0.5 font-mono text-[11px] font-bold">
                NEW
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
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
