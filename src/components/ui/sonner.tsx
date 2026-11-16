"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      toastOptions={{
        classNames: {
          toast: "!rounded-none !border-border !bg-card !font-mono !text-[13px] !text-foreground",
        },
      }}
      {...props}
    />
  );
}
