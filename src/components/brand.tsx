import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

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
        width={40}
        height={40}
        className={isMd ? "size-10" : "size-8"}
      />
      <span
        className={cn(
          "font-display text-foreground font-extrabold",
          isMd ? "text-[26px]" : "text-[22px]",
        )}
      >
        Pattie
      </span>
    </Link>
  );
}
