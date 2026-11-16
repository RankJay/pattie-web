import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps } from "react";

export const buttonVariants = cva(
  "focus-visible:ring-ring focus-visible:ring-offset-background inline-flex shrink-0 items-center justify-center gap-2 text-[15px] whitespace-nowrap transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground font-bold hover:brightness-110",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent font-semibold",
        outline: "border-border text-foreground hover:bg-accent border",
        ghost: "text-muted-foreground hover:text-foreground",
        brand: "bg-brown text-cream font-bold hover:brightness-125",
        cream: "bg-cream text-brown font-bold hover:brightness-95",
        "brand-outline": "border-brown text-brown hover:bg-brown/10 border-2 font-bold",
      },
      size: {
        default: "px-7 py-4",
        sm: "px-5 py-2.5 text-sm",
        icon: "size-11",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;

interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
