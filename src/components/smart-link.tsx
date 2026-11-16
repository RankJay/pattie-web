import { Button, type ButtonVariant } from "@/components/ui/button";
import Link from "next/link";
import type { ComponentProps } from "react";

interface SmartLinkProps extends ComponentProps<"a"> {
  href: string;
}

export function SmartLink({ href, children, ...props }: SmartLinkProps) {
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

interface ButtonLinkProps {
  href: string;
  variant: ButtonVariant;
  children: React.ReactNode;
}

export function ButtonLink({ href, variant, children }: ButtonLinkProps) {
  return (
    <Button asChild variant={variant}>
      <SmartLink href={href}>{children}</SmartLink>
    </Button>
  );
}
