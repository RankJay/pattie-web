import { CopyButton } from "@/components/copy-button";
import { LayerStack } from "@/components/layer-stack";
import { Section } from "@/components/section";
import { Card } from "@/components/ui/card";

const snippet = `let mic = Device::builder()
    .name("Agent Mic")
    .kind(Kind::Microphone)
    .format(48_000, 1)
    .create()?;

let mut tx = mic.writer()?;
tx.write(&samples)?;

drop(mic);`;

function CodeWindow() {
  return (
    <Card className="min-w-0 lg:sticky lg:top-24">
      <div className="border-border flex items-center justify-between border-b px-5 py-2">
        <span className="text-muted-foreground font-mono text-[13px]">main.rs</span>
        <CopyButton value={snippet} />
      </div>
      <pre className="bg-code text-code-foreground flex-1 p-5 font-mono text-[13px] leading-7 sm:p-7 sm:text-[15px]">
        <code className="contents">
          <span className="block break-words whitespace-pre-wrap">
            {"let mic = Device::builder()"}
          </span>
          <span className="text-amber block break-words whitespace-pre-wrap">
            {'    .name("Agent Mic")'}
          </span>
          <span className="block break-words whitespace-pre-wrap">
            {"    .kind(Kind::Microphone)"}
          </span>
          <span className="block break-words whitespace-pre-wrap">{"    .format(48_000, 1)"}</span>
          <span className="group-has-checked/life:bg-amber/20 -mx-5 block bg-transparent px-5 break-words whitespace-pre-wrap transition-colors sm:-mx-7 sm:px-7">
            {"    .create()?;"}
          </span>
          <span className="block break-words whitespace-pre-wrap">{" "}</span>
          <span className="block break-words whitespace-pre-wrap">
            {"let mut tx = mic.writer()?;"}
          </span>
          <span className="text-code-muted block break-words whitespace-pre-wrap">
            {"tx.write(&samples)?;  // Zoom hears this"}
          </span>
          <span className="block break-words whitespace-pre-wrap">{" "}</span>
          <span className="bg-amber/20 -mx-5 block px-5 break-words whitespace-pre-wrap transition-colors group-has-checked/life:bg-transparent sm:-mx-7 sm:px-7">
            {"drop(mic);  // the device disappears"}
          </span>
        </code>
      </pre>
    </Card>
  );
}

export function Lifecycle() {
  return (
    <Section id="how-it-works" className="py-16 lg:py-24">
      <div className="group/life flex flex-col gap-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5">
            <p className="eyebrow">HOW IT WORKS</p>
            <h2 className="title-xl max-w-3xl">One call to create. One to drop.</h2>
            <p className="text-muted-foreground max-w-2xl text-lg leading-normal">
              Your app writes samples into a shared Ring. The driver presents them to Windows as a
              device any app can pick. Close or crash and the Device goes with you, like unplugging
              hardware.
            </p>
          </div>
          <label className="border-border bg-card has-focus-visible:ring-ring inline-flex w-fit cursor-pointer items-center gap-3 border px-4 py-3 font-mono text-sm has-focus-visible:ring-2">
            <input type="checkbox" defaultChecked className="peer sr-only" />
            <span className="text-foreground peer-checked:text-muted-foreground font-semibold peer-checked:font-normal">
              drop()
            </span>
            <span
              aria-hidden="true"
              className="border-border bg-muted after:bg-dim peer-checked:after:bg-amber relative h-5 w-10 border after:absolute after:top-0.5 after:left-0.5 after:size-3.5 after:transition-transform peer-checked:after:translate-x-5"
            />
            <span className="text-muted-foreground peer-checked:text-foreground font-normal peer-checked:font-semibold">
              create()
            </span>
          </label>
        </div>
        <p className="sr-only" aria-live="polite">
          <span className="group-has-checked/life:hidden">Device removed.</span>
          <span className="hidden group-has-checked/life:inline">Device created.</span>
        </p>
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <CodeWindow />
          <LayerStack />
        </div>
      </div>
    </Section>
  );
}
