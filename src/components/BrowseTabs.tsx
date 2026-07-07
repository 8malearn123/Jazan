import Link from "next/link";
import { cn } from "@/lib/cn";

type TabKey = "heroes" | "producers" | "jobs";

const tabs: { key: TabKey; label: string; href: string }[] = [
  { key: "heroes", label: "الأبطال", href: "/browse" },
  { key: "producers", label: "الأسر المنتجة", href: "/producers" },
  { key: "jobs", label: "الوظائف", href: "/companies" },
];

/** شريط تبويب التصفّح المشترك (الأبطال · الأسر المنتجة · الوظائف) */
export function BrowseTabs({ active }: { active: TabKey }) {
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
