"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "jazanheroes.theme";

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !(dark ?? false);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // ignore
    }
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "الوضع الفاتح" : "الوضع الداكن"}
      title={dark ? "الوضع الفاتح" : "الوضع الداكن"}
      className={cn(
        "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[11px] border-[1.5px] border-line bg-surface text-charcoal transition-colors hover:border-jazan hover:text-jazan",
        className
      )}
    >
      {dark ? (
        <SunIcon width={18} height={18} />
      ) : (
        <MoonIcon width={18} height={18} />
      )}
    </button>
  );
}
