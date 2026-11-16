import { Brand } from "@/components/brand";
import { SmartLink } from "@/components/smart-link";
import { links, siteConfig } from "@/lib/constants";

const columns = [
  {
    title: "PRODUCT",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Status", href: "/#status" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "PROJECT",
    links: [
      { label: "GitHub", href: links.github },
      { label: "Contributing", href: `${links.github}/blob/main/CONTRIBUTING.md` },
      { label: "Report a bug", href: `${links.github}/issues` },
    ],
  },
  {
    title: "COMMUNITY",
    links: [{ label: "Discord", href: links.discord }],
  },
];

export function Footer() {
  return (
    <footer className="border-border bg-background border-t">
      <div className="container-x flex flex-col gap-10 py-12 lg:py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="flex max-w-80 flex-col gap-3.5">
            <Brand size="sm" />
            <p className="text-muted-foreground text-sm leading-normal">
              Named virtual microphones and speakers any app can create.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3 lg:gap-x-20">
            {columns.map((column) => (
              <nav key={column.title} aria-label={column.title} className="flex flex-col gap-3">
                <h2 className="text-muted-foreground font-mono text-xs tracking-[0.17em]">
                  {column.title}
                </h2>
                {column.links.map((link) => (
                  <SmartLink
                    key={link.label}
                    href={link.href}
                    className="text-foreground hover:text-amber-ink text-sm transition-colors"
                  >
                    {link.label}
                  </SmartLink>
                ))}
              </nav>
            ))}
          </div>
        </div>
        <div className="border-border text-muted-foreground flex flex-col gap-2 border-t pt-5 font-mono text-xs sm:flex-row sm:justify-between">
          <p>© {siteConfig.name}. v0 pre-release · Windows + Linux · macOS later.</p>
          <p>Not affiliated with VB-Audio.</p>
        </div>
      </div>
    </footer>
  );
}
