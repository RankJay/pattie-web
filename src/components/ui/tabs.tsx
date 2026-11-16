"use client";

import { cn } from "@/lib/utils";
import { Tabs as TabsPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

export function Tabs({ className, ...props }: ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn("flex flex-col", className)} {...props} />;
}

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List className={cn("flex", className)} {...props} />;
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "border-border text-muted-foreground hover:text-foreground focus-visible:ring-ring data-[state=active]:bg-card data-[state=active]:text-primary border border-b-0 px-4 py-2 font-mono text-[13px] transition-colors outline-none focus-visible:ring-2",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn("outline-none", className)} {...props} />;
}
