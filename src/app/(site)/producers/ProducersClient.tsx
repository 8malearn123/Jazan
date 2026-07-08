"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { Producer } from "@/lib/types";
import { ProducerCard } from "./ProducerCard";

const categories = ["الكل", "طعام", "حِرف", "عطور"];

export function ProducersClient({ producers }: { producers: Producer[] }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [category, setCategory] = useState("الكل");

  const cities = useMemo(
    () => Array.from(new Set(producers.map((p) => p.city))).sort(),
    [producers]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return producers.filter((p) => {
      const inQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.bio ?? "").toLowerCase().includes(q);
      const inCity = city === "all" || p.city === city;
      const inCat = category === "الكل" || p.category === category;
      return inQuery && inCity && inCat;
    });
  }, [producers, query, city, category]);

  return (
    <>
      {/* البحث + المدينة */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-[13px] border-[1.5px] border-line bg-surface px-4 py-3 focus-within:border-amber">
          <SearchIcon className="h-[19px] w-[19px] flex-none text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن نشاط أو منتج…"
            className="w-full bg-transparent text-[15px] text-charcoal placeholder:text-muted/70 focus:outline-none"
          />
        </div>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-[13px] border-[1.5px] border-line bg-surface px-4 py-3 text-sm text-charcoal outline-none focus:border-amber"
        >
          <option value="all">كل المدن</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* فئات النشاط */}
      <div className="mt-4 flex flex-wrap items-center gap-[9px]">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              "cursor-pointer rounded-full border-[1.5px] px-4 py-2 text-[13px] font-semibold transition-colors",
              category === cat
                ? "border-amber bg-amber text-white"
                : "border-line bg-surface text-ink hover:bg-black/[.02]"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="mt-5 text-[13px] text-muted">
        <span className="mono font-semibold text-charcoal">{results.length}</span> نتيجة
      </p>

      {results.length > 0 ? (
        <div className="mt-3 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {results.map((producer) => (
            <ProducerCard key={producer.id} producer={producer} />
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-[18px] border border-dashed border-line bg-surface py-16 text-center">
          <p className="text-[15px] font-semibold text-charcoal">لا توجد نتائج مطابقة</p>
          <p className="mt-1 text-[13px] text-muted">جرّب تعديل البحث أو الفئة.</p>
        </div>
      )}
    </>
  );
}
