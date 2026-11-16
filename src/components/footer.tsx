import { Brand, SmartLink } from "@/components/ui";
import { links, siteConfig } from "@/lib/constants";
import type { FooterColumn } from "@/lib/content";

const columns: readonly FooterColumn[] = [
  {
    title: "DOCS",
    links: [
      { label: "Quickstart", href: links.docs },
      { label: "CLI reference", href: `${links.docs}/cli` },
      { label: "How it works", href: "/#how-it-works" },
    ],
  },
  {
    title: "PROJECT",
    links: [
      { label: "Roadmap", href: "/#status" },
      { label: "GitHub", href: links.github },
      { label: "Contributing", href: `${links.github}/blob/main/CONTRIBUTING.md` },
    ],
  },
  {
    title: "COMMUNITY",
    links: [
      { label: "Discord", href: links.discord },
      { label: "Report a bug", href: `${links.github}/issues` },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-line bg-bg border-t">
      <div className="container-x flex flex-col gap-10 py-12 lg:py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="flex max-w-80 flex-col gap-3.5">
            <Brand size="sm" />
            <p className="text-muted text-sm leading-normal">
              Named virtual microphones and speakers any app can create.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3 lg:gap-x-20">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title} className="flex flex-col gap-3">
                <h2 className="text-muted font-mono text-xs tracking-[0.17em]">{column.title}</h2>
                {column.links.map((link) => (
                  <SmartLink
                    key={link.label}
                    href={link.href}
                    className="text-fg hover:text-amber text-sm transition-colors"
                  >
                    {link.label}
                  </SmartLink>
                ))}
              </nav>
            ))}
          </div>
        </div>
        <div className="border-line text-muted flex flex-col gap-2 border-t pt-5 font-mono text-xs sm:flex-row sm:justify-between">
          <p>© {siteConfig.name}. v0 · Windows + Linux · macOS later.</p>
          <p>Not affiliated with VB-Audio.</p>
        </div>
      </div>
    </footer>
  );
}
