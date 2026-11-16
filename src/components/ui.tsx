import type { Tone } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export const toneClass: Record<Tone, string> = {
  fg: "text-fg",
  muted: "text-muted",
  amber: "text-amber",
};

const buttonVariants = {
  primary: "bg-amber text-bg font-bold hover:brightness-110",
  secondary: "bg-panel text-fg font-semibold hover:bg-line",
  ctaPrimary: "bg-brown text-cream font-bold hover:brightness-125",
  ctaSecondary: "bg-cream text-brown font-bold hover:brightness-95",
  ctaOutline: "border-2 border-brown text-brown font-bold hover:bg-brown/10",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

interface SmartLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

export function SmartLink({ href, className, children, onClick }: SmartLinkProps) {
  if (href.startsWith("http")) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

interface ButtonLinkProps {
  href: string;
  variant: ButtonVariant;
  children: ReactNode;
}

export function ButtonLink({ href, variant, children }: ButtonLinkProps) {
  return (
    <SmartLink
      href={href}
      className={`inline-flex items-center justify-center gap-2 px-7 py-4 text-[15px] transition ${buttonVariants[variant]}`}
    >
      {children}
    </SmartLink>
  );
}

interface BrandProps {
  size: "md" | "sm";
}

export function Brand({ size }: BrandProps) {
  const isMd = size === "md";

  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Pattie home">
      <Image
        src="/pattie-logo.svg"
        alt=""
        width={isMd ? 40 : 32}
        height={isMd ? 40 : 32}
        className={isMd ? "size-10" : "size-8"}
      />
      <span
        className={`font-display text-fg font-extrabold ${isMd ? "text-[26px]" : "text-[22px]"}`}
      >
        Pattie
      </span>
    </Link>
  );
}

interface SectionProps {
  id?: string;
  className?: string;
  outerClassName?: string;
  children: ReactNode;
}

export function Section({ id, className = "", outerClassName = "", children }: SectionProps) {
  return (
    <section id={id} className={outerClassName}>
      <div className={`container-x ${className}`}>{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
}

export function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="title-xl max-w-4xl">{title}</h2>
    </div>
  );
}
