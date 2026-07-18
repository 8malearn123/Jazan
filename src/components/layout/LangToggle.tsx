"use client";

import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export function LangToggle({ className }: { className?: string }) {
  const { isAr, toggle } = useLocale();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
      title={isAr ? "English" : "العربية"}
      className={cn(
        "inline-flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-[11px] border-[1.5px] border-line bg-surface px-2 text-[13px] font-bold text-charcoal transition-colors hover:border-jazan hover:text-jazan",
        className
      )}
    >
      {isAr ? "EN" : "ع"}
    </button>
  );
}
