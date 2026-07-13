"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { useLocale } from "@/lib/i18n";
import { normalizeText } from "@/lib/text";
import { heroMatches, producerMatches, companyMatches } from "@/lib/search";
import { governorates } from "@/lib/jazan-map";
import { producers, companies, jobs } from "@/lib/data";
import type { Hero, AvailabilityStatus } from "@/lib/types";
import { HeroBrowseCard } from "./HeroBrowseCard";
import { ProducerCard } from "../producers/ProducerCard";
import { CompanyCard } from "../companies/CompanyCard";

type StatusFilter = "all" | AvailabilityStatus;

const chipStyles: { key: StatusFilter; dot?: string; text?: string }[] = [
  { key: "all" },
  { key: "freelance", dot: "bg-success", text: "text-success-ink" },
  { key: "job", dot: "bg-info", text: "text-info-ink" },
  { key: "both", dot: "bg-amber", text: "text-warn-ink" },
];

function matchStatus(hero: Hero, f: StatusFilter): boolean {
  if (f === "all") return true;
  if (f === "freelance") return hero.status === "freelance" || hero.status === "both";
  if (f === "job") return hero.status === "job" || hero.status === "both";
  return hero.status === "both";
}

export function BrowseClient({
  heroes,
  initialQuery = "",
}: {
  heroes: Hero[];
  initialQuery?: string;
}) {
  const { d, isAr } = useLocale();
  const [query, setQuery] = useState(initialQuery);
  const [city, setCity] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  // كل محافظات جازان — نفس قائمة الخريطة التفاعلية
  const cities = governorates.map((g) => ({ value: g.ar, label: isAr ? g.ar : g.en }));

  const chips = chipStyles.map((c) => ({
    ...c,
    label: d.browse.chips[c.key as keyof typeof d.browse.chips] ?? d.browse.chips.all,
  }));

  const q = normalizeText(query.trim());

  const results = useMemo(() => {
    return heroes.filter((h) => {
      const inCity = city === "all" || normalizeText(h.city) === normalizeText(city);
      return heroMatches(h, q) && inCity && matchStatus(h, status);
    });
  }, [heroes, q, city, status]);

  // نتائج عابرة للأقسام: أسر منتجة وشركات تقدّم ما يبحث عنه الزائر
  // (منتجات، خدمات، أكلات، مجالات توظيف) — تظهر فقط عند وجود بحث
  const producerResults = useMemo(
    () => (q ? producers.filter((p) => producerMatches(p, q)) : []),
    [q]
  );
  const companyResults = useMemo(
    () => (q ? companies.filter((c) => companyMatches(c, q, jobs)) : []),
    [q]
  );

  return (
    <>
      {/* البحث + المدينة */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2.5 rounded-[13px] border-[1.5px] border-line bg-surface px-4 py-3 focus-within:border-jazan">
          <SearchIcon className="h-[19px] w-[19px] shrink-0 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={d.browse.searchPh}
            className="w-full bg-transparent text-[15px] text-charcoal outline-none placeholder:text-[#9aa29d]"
          />
        </div>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-[13px] border-[1.5px] border-line bg-surface px-4 py-3 text-sm text-charcoal outline-none focus:border-jazan"
        >
          <option value="all">{d.browse.allCities}</option>
          {cities.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
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
                  : cn("border-line bg-surface hover:border-jazan", chip.text ?? "text-charcoal")
              )}
            >
              {chip.dot ? (
                <span className={cn("h-[7px] w-[7px] rounded-full", active ? "bg-surface" : chip.dot)} />
              ) : null}
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* العدّاد */}
      <p className="mt-5 text-[13px] text-muted">
        <span className="mono font-semibold text-charcoal">
          {results.length + producerResults.length + companyResults.length}
        </span>{" "}
        {d.browse.result}
      </p>

      {/* الشبكة */}
      {results.length > 0 ? (
        <div className="mt-3 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((hero) => (
            <HeroBrowseCard key={hero.id} hero={hero} />
          ))}
        </div>
      ) : producerResults.length === 0 && companyResults.length === 0 ? (
        <div className="mt-3 rounded-[18px] border border-dashed border-line bg-surface py-16 text-center">
          <p className="text-[15px] font-semibold text-charcoal">{d.browse.emptyTitle}</p>
          <p className="mt-1 text-[13px] text-muted">{d.browse.emptyDesc}</p>
        </div>
      ) : null}

      {/* أسر منتجة تقدّم المنتج / الأكلة المطلوبة */}
      {producerResults.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-[16px] font-extrabold text-charcoal">
            {d.browse.alsoProducers}{" "}
            <span className="mono text-[13px] font-medium text-muted">({producerResults.length})</span>
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {producerResults.map((p) => (
              <ProducerCard key={p.id} producer={p} />
            ))}
          </div>
        </section>
      ) : null}

      {/* شركات تقدّم الخدمة أو توظّف في المجال المطلوب */}
      {companyResults.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-[16px] font-extrabold text-charcoal">
            {d.browse.alsoCompanies}{" "}
            <span className="mono text-[13px] font-medium text-muted">({companyResults.length})</span>
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {companyResults.map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
