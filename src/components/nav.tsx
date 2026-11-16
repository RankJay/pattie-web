import { Brand } from "@/components/brand";
import { MobileMenu } from "@/components/mobile-menu";
import { SmartLink } from "@/components/smart-link";
import { Button } from "@/components/ui/button";
import { links, navLinks } from "@/lib/constants";

export function Nav() {
  return (
    <header className="border-border bg-background sticky top-0 z-40 border-b">
      <div className="container-x flex items-center justify-between gap-6 py-4 sm:py-5">
        <Brand size="md" />
        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <SmartLink
              key={link.label}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-[15px] transition-colors"
            >
              {link.label}
            </SmartLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <SmartLink href={links.github}>Star on GitHub</SmartLink>
          </Button>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
