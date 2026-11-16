import { SmartLink } from "@/components/smart-link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { links, navLinks } from "@/lib/constants";
import { Menu } from "lucide-react";

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="gap-0 px-5 pt-16 pb-4 sm:px-8">
        <SheetHeader className="sr-only">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>Site navigation</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col">
          {navLinks.map((link) => (
            <SheetClose key={link.label} asChild>
              <SmartLink
                href={link.href}
                className="border-border text-foreground border-b py-4 text-base"
              >
                {link.label}
              </SmartLink>
            </SheetClose>
          ))}
          <SheetClose asChild>
            <SmartLink href={links.discord} className={buttonVariants({ className: "mt-4" })}>
              Join Discord
            </SmartLink>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
