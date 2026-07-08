"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { useLocale } from "@/lib/i18n";

type TabKey = "heroes" | "producers" | "jobs";

/** شريط تبويب التصفّح المشترك (الأبطال · الأسر المنتجة · الوظائف) */
export function BrowseTabs({ active }: { active: TabKey }) {
  const { d } = useLocale();

  const tabs: { key: TabKey; label: string; href: string }[] = [
    { key: "heroes", label: d.tabs.heroes, href: "/browse" },
    { key: "producers", label: d.tabs.producers, href: "/producers" },
    { key: "jobs", label: d.tabs.jobs, href: "/companies" },
  ];

  return (
    <nav className="flex flex-wrap items-center gap-1.5">
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <Link
            key={t.key}
            href={t.href}
            className={cn(
              "rounded-[9px] px-3.5 py-2 text-sm no-underline transition-colors",
              isActive
                ? "bg-jazan/10 font-semibold text-jazan"
                : "text-muted hover:bg-black/[.03]"
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
