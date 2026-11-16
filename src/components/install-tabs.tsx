import { CopyButton } from "@/components/copy-button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const installTabs = [
  { label: "Rust", command: "cargo add pattie" },
  { label: "Python", command: "pip install pattie" },
  { label: "CLI", command: 'pattie-cli mic "Agent Mic"' },
];

export function InstallTabs() {
  return (
    <Tabs defaultValue={installTabs[0].label}>
      <TabsList aria-label="Install with">
        {installTabs.map((tab) => (
          <TabsTrigger key={tab.label} value={tab.label}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {installTabs.map((tab) => (
        <TabsContent key={tab.label} value={tab.label}>
          <Card className="flex-row items-center gap-3.5 px-4 py-4 sm:px-6 sm:py-4.5">
            <span aria-hidden="true" className="text-primary font-mono text-base">
              &gt;
            </span>
            <code className="text-foreground min-w-0 flex-1 overflow-x-auto font-mono text-sm whitespace-nowrap sm:text-base">
              {tab.command}
            </code>
            <CopyButton value={tab.command} />
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
