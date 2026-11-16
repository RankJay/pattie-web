import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  className?: string;
  outerClassName?: string;
  children: ReactNode;
}

export function Section({ id, className, outerClassName, children }: SectionProps) {
  return (
    <section id={id} className={outerClassName}>
      <div className={cn("container-x", className)}>{children}</div>
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
