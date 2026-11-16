import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const badgeVariants = cva("inline-flex w-fit shrink-0 items-center font-mono whitespace-nowrap", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground px-2 py-0.5 text-[11px] font-bold",
      outline: "border-border text-muted-foreground border px-3 py-1.5 text-[13px]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface BadgeProps extends ComponentProps<"span">, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
