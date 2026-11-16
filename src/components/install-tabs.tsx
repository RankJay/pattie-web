"use client";

import { installTabs } from "@/lib/content";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function InstallTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const active = installTabs[activeIndex];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(active.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div role="tablist" aria-label="Install with" className="flex">
        {installTabs.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            id={`install-tab-${tab.label}`}
            aria-selected={index === activeIndex}
            aria-controls="install-panel"
            onClick={() => setActiveIndex(index)}
            className={`border-line border border-b-0 px-4 py-2 font-mono text-[13px] transition-colors ${
              index === activeIndex ? "bg-panel text-amber" : "text-muted hover:text-fg"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        id="install-panel"
        role="tabpanel"
        aria-labelledby={`install-tab-${active.label}`}
        className="panel flex items-center gap-3.5 px-4 py-4 sm:px-6 sm:py-4.5"
      >
        <span aria-hidden="true" className="text-amber font-mono text-base">
          &gt;
        </span>
        <code className="text-fg min-w-0 flex-1 overflow-x-auto font-mono text-sm whitespace-nowrap sm:text-base">
          {active.command}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : `Copy ${active.command}`}
          className="text-muted hover:text-fg flex size-9 shrink-0 items-center justify-center transition-colors"
        >
          {copied ? (
            <Check className="text-amber size-4" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
        </button>
        <output className="sr-only">{copied ? "Copied to clipboard" : ""}</output>
      </div>
    </div>
  );
}
