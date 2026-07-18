"use client";

import { useMemo, useState } from "react";
import { SearchIcon, MapIcon } from "@/components/icons";
import { JazanMap } from "@/components/home/JazanMap";
import { cn } from "@/lib/cn";
import { useLocale } from "@/lib/i18n";
import { normalizeText } from "@/lib/text";
import { producerMatches } from "@/lib/search";
import { governorates } from "@/lib/jazan-map";
import type { Producer } from "@/lib/types";
import { ProducerCard } from "./ProducerCard";

const categories = ["الكل", "طعام", "حِرف", "عطور"];

export function ProducersClient({ producers }: { producers: Producer[] }) {
  const { d, isAr } = useLocale();
  const [query, setQuery] = useState("");
  const [mapOpen, setMapOpen] = useState(false);
  const [city, setCity] = useState("all");
  const [category, setCategory] = useState("الكل");

  const cities = governorates.map((g) => ({ value: g.ar, label: isAr ? g.ar : g.en }));

  const results = useMemo(() => {
    const q = normalizeText(query.trim());
    return producers.filter((p) => {
      const inQuery = producerMatches(p, q);
      const inCity = city === "all" || normalizeText(p.city) === normalizeText(city);
      const inCat = category === "الكل" || p.category === category;
      return inQuery && inCity && inCat;
    });
  }, [producers, query, city, category]);

  return (
    <>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 rounded-[13px] border-[1.5px] border-line bg-surface px-4 py-3 focus-within:border-amber">
          <SearchIcon className="h-[19px] w-[19px] flex-none text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={d.producersPage.searchPh}
            className="w-full bg-transparent text-[15px] text-charcoal placeholder:text-muted/70 focus:outline-none"
          />
        </div>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-[13px] border-[1.5px] border-line bg-surface px-4 py-3 text-sm text-charcoal outline-none focus:border-amber"
        >
          <option value="all">{d.producersPage.allCities}</option>
          {cities.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setMapOpen(true)}
          aria-label={d.map.open}
          title={d.map.open}
          className="flex h-[46px] w-[46px] flex-none cursor-pointer items-center justify-center self-end rounded-[13px] border-[1.5px] border-line bg-surface text-jazan transition-colors hover:border-amber hover:bg-amber hover:text-white sm:self-auto"
        >
          <MapIcon width={19} height={19} />
        </button>
      </div>

      <JazanMap open={mapOpen} onClose={() => setMapOpen(false)} />

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
            {cat === "الكل" ? d.producersPage.all : d.prodCat[cat] ?? cat}
          </button>
        ))}
      </div>

      <p className="mt-5 text-[13px] text-muted">
        <span className="mono font-semibold text-charcoal">{results.length}</span> {d.producersPage.result}
      </p>

      {results.length > 0 ? (
        <div className="mt-3 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {results.map((producer) => (
            <ProducerCard key={producer.id} producer={producer} />
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-[18px] border border-dashed border-line bg-surface py-16 text-center">
          <p className="text-[15px] font-semibold text-charcoal">{d.producersPage.emptyTitle}</p>
          <p className="mt-1 text-[13px] text-muted">{d.producersPage.emptyDesc}</p>
        </div>
      )}
    </>
  );
}
