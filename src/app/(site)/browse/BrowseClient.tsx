"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { Hero, AvailabilityStatus } from "@/lib/types";
import { HeroBrowseCard } from "./HeroBrowseCard";

type StatusFilter = "all" | AvailabilityStatus;

const chips: { key: StatusFilter; label: string; dot?: string; text?: string }[] = [
  { key: "all", label: "الكل" },
  { key: "freelance", label: "متاح للعمل الحر", dot: "bg-success", text: "text-success-ink" },
  { key: "job", label: "يبحث عن وظيفة", dot: "bg-info", text: "text-info-ink" },
  { key: "both", label: "متاح للاثنين", dot: "bg-amber", text: "text-warn-ink" },
];

function matchStatus(hero: Hero, f: StatusFilter): boolean {
  if (f === "all") return true;
  if (f === "freelance") return hero.status === "freelance" || hero.status === "both";
  if (f === "job") return hero.status === "job" || hero.status === "both";
  return hero.status === "both";
}

export function BrowseClient({ heroes }: { heroes: Hero[] }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const cities = useMemo(
    () => Array.from(new Set(heroes.map((h) => h.city))).sort(),
    [heroes]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return heroes.filter((h) => {
      const inQuery =
        !q ||
        h.name.toLowerCase().includes(q) ||
        h.title.toLowerCase().includes(q) ||
        h.skills.some((s) => s.toLowerCase().includes(q));
      const inCity = city === "all" || h.city === city;
      return inQuery && inCity && matchStatus(h, status);
    });
  }, [heroes, query, city, status]);

  return (
    <>
      {/* البحث + المدينة */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2.5 rounded-[13px] border-[1.5px] border-line bg-white px-4 py-3 focus-within:border-jazan">
          <SearchIcon className="h-[19px] w-[19px] shrink-0 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث بالاسم أو المهارة…"
            className="w-full bg-transparent text-[15px] text-charcoal outline-none placeholder:text-[#9aa29d]"
          />
        </div>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-[13px] border-[1.5px] border-line bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-jazan"
        >
          <option value="all">كل المدن</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* شرائح الحالة */}
      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        {chips.map((chip) => {
          const active = status === chip.key;
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => setStatus(chip.key)}
              className={cn(
                "inline-flex cursor-pointer items-center gap-[7px] rounded-full border-[1.5px] px-4 py-2 text-[13px] font-semibold transition-colors",
                active
                  ? "border-jazan bg-jazan text-white"
                  : cn("border-line bg-white hover:border-jazan", chip.text ?? "text-charcoal")
              )}
            >
              {chip.dot ? (
                <span className={cn("h-[7px] w-[7px] rounded-full", active ? "bg-white" : chip.dot)} />
              ) : null}
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* العدّاد */}
      <p className="mt-5 text-[13px] text-muted">
        <span className="mono font-semibold text-charcoal">{results.length}</span> نتيجة
      </p>

      {/* الشبكة */}
      {results.length > 0 ? (
        <div className="mt-3 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((hero) => (
            <HeroBrowseCard key={hero.id} hero={hero} />
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-[18px] border border-dashed border-line bg-white py-16 text-center">
          <p className="text-[15px] font-semibold text-charcoal">لا توجد نتائج مطابقة</p>
          <p className="mt-1 text-[13px] text-muted">جرّب تعديل البحث أو المُرشّحات.</p>
        </div>
      )}
    </>
  );
}
