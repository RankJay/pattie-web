"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface CopyButtonProps {
  value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Couldn't copy. Select the text instead.");
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={`Copy ${value}`}
      onClick={copy}
    >
      <Copy className="size-4" aria-hidden="true" />
    </Button>
  );
}
