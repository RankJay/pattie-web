"use client";

import { SmartLink } from "@/components/ui";
import { links, navLinks } from "@/lib/constants";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(!open)}
        className="border-line text-fg flex size-11 items-center justify-center border"
      >
        {open ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <Menu className="size-5" aria-hidden="true" />
        )}
      </button>
      <nav
        id="mobile-menu"
        aria-label="Mobile"
        hidden={!open}
        className="border-line bg-bg absolute inset-x-0 top-full flex flex-col border-b px-5 py-2 sm:px-8"
      >
        {navLinks.map((link) => (
          <SmartLink
            key={link.label}
            href={link.href}
            onClick={close}
            className="border-line text-fg border-b py-4 text-base last:border-b-0"
          >
            {link.label}
          </SmartLink>
        ))}
        <SmartLink
          href={links.discord}
          onClick={close}
          className="bg-amber text-bg my-3 px-5 py-3.5 text-center text-[15px] font-bold"
        >
          Join Discord
        </SmartLink>
      </nav>
    </div>
  );
}
