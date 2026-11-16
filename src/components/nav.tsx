import { MobileMenu } from "@/components/mobile-menu";
import { Brand, SmartLink } from "@/components/ui";
import { links, navLinks } from "@/lib/constants";
import { MessageCircle } from "lucide-react";

export function Nav() {
  return (
    <header className="border-line bg-bg sticky top-0 z-50 border-b">
      <div className="container-x flex items-center justify-between gap-6 py-4 sm:py-5">
        <Brand size="md" />
        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <SmartLink
              key={link.label}
              href={link.href}
              className="text-muted hover:text-fg text-[15px] transition-colors"
            >
              {link.label}
            </SmartLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <SmartLink
            href={links.discord}
            className="bg-amber text-bg hidden items-center gap-2 px-5 py-2.5 text-sm font-bold transition hover:brightness-110 sm:inline-flex"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Join Discord
          </SmartLink>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
