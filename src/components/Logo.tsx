"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { useLocale } from "@/lib/i18n";
import { StarIcon } from "./icons";

export function Logo({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { isAr } = useLocale();
  const box = { sm: "h-[34px] w-[34px]", md: "h-[42px] w-[42px]", lg: "h-[54px] w-[54px]" }[size];
  const icon = { sm: 19, md: 24, lg: 30 }[size];
  const text = { sm: "text-[17px]", md: "text-xl", lg: "text-2xl" }[size];

  return (
    <Link
      href="/"
      className={cn("flex items-center gap-3 no-underline", className)}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-[12px] bg-jazan shadow-[0_6px_18px_rgba(15,92,74,.28)]",
          box
        )}
      >
        <StarIcon width={icon} height={icon} className="text-amber" strokeWidth={2.1} />
      </span>
      <span className={cn("font-extrabold tracking-[-.3px] text-charcoal", text)}>
        {isAr ? site.name : "Jazan Heroes"}
      </span>
    </Link>
  );
}
