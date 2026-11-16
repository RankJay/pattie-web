import { Section, SectionHeading } from "@/components/section";

const rows = [
  {
    topic: "Install",
    cable: "Run a setup as administrator, then restart Windows.",
    pattie: "One admin install, once. Your app never prompts.",
  },
  {
    topic: "Naming",
    cable: "CABLE Input is the playback side. CABLE Output is the microphone.",
    pattie: "Your app names the Device: Microphone (Agent Mic).",
  },
  {
    topic: "Lifetime",
    cable: "A fixed pair of devices, shared by every app, always present.",
    pattie: "Exists while your app runs. Close or crash and it is gone.",
  },
  {
    topic: "Control",
    cable: "Routed by hand in Windows Sound settings.",
    pattie: "Created and read from code: Device::builder().create().",
  },
  {
    topic: "Added latency",
    cable: "~109 ms added on the test VM.",
    pattie: "~40 ms mic, ~28 ms speaker on the same VM.",
  },
];

export function Compare() {
  return (
    <Section className="flex flex-col gap-10 pb-16 lg:pb-24">
      <SectionHeading
        eyebrow="VERSUS A VIRTUAL CABLE"
        title="Stop telling users to install a cable."
      />
      <div className="border-border bg-card border">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Pattie compared with a virtual audio cable</caption>
          <thead className="hidden md:table-header-group">
            <tr className="border-border text-muted-foreground border-b font-mono text-xs tracking-[0.12em]">
              <th scope="col" className="w-40 px-6 py-4 font-normal">
                <span className="sr-only">Topic</span>
              </th>
              <th scope="col" className="px-6 py-4 font-normal">
                VIRTUAL AUDIO CABLE
              </th>
              <th scope="col" className="text-amber-ink px-6 py-4 font-normal">
                PATTIE
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.topic}
                className="border-border block border-b last:border-b-0 md:table-row md:align-top"
              >
                <th
                  scope="row"
                  className="text-foreground block px-5 pt-5 pb-1 font-mono text-sm font-semibold md:table-cell md:px-6 md:py-5"
                >
                  {row.topic}
                </th>
                <td
                  data-label="VIRTUAL AUDIO CABLE"
                  className="text-muted-foreground block px-5 py-2 text-[15px] leading-normal before:mb-1 before:block before:font-mono before:text-[11px] before:tracking-[0.12em] before:content-[attr(data-label)] md:table-cell md:px-6 md:py-5 md:before:hidden"
                >
                  {row.cable}
                </td>
                <td
                  data-label="PATTIE"
                  className="text-foreground before:text-amber-ink block px-5 pt-2 pb-5 text-[15px] leading-normal before:mb-1 before:block before:font-mono before:text-[11px] before:tracking-[0.12em] before:content-[attr(data-label)] md:table-cell md:px-6 md:py-5 md:before:hidden"
                >
                  {row.pattie}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
