import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("border-border bg-card text-card-foreground flex flex-col border", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3 className={cn("font-display text-foreground text-xl font-bold", className)} {...props} />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-muted-foreground text-[13px]", className)} {...props} />;
}
