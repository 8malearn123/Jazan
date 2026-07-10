"use client";

import { useEffect, useMemo, useState } from "react";
import { governorates, JAZAN_VIEWBOX, type Governorate } from "@/lib/jazan-map";
import { sampleHeroes, producers, companies } from "@/lib/data";
import { normalizeText } from "@/lib/text";
import { useLocale } from "@/lib/i18n";
import { XIcon, UsersIcon, StoreIcon, BuildingIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

type GovStats = { heroes: number; producers: number; companies: number };

/** إحصائيات كل محافظة — تُحسب من البيانات بمطابقة اسم المدينة (مع التطبيع العربي) */
function useGovStats(): Record<string, GovStats> {
  return useMemo(() => {
    const stats: Record<string, GovStats> = {};
    for (const g of governorates) {
      const key = normalizeText(g.ar);
      stats[g.id] = {
        heroes: sampleHeroes.filter((h) => normalizeText(h.city) === key).length,
        producers: producers.filter((p) => normalizeText(p.city) === key).length,
        companies: companies.filter((c) => normalizeText(c.city ?? "") === key).length,
      };
    }
    return stats;
  }, []);
}

const VB_W = 520;
const VB_H = 473;

export function JazanMap({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { d, isAr } = useLocale();
  const stats = useGovStats();
  const [active, setActive] = useState<Governorate | null>(null);

  // إغلاق بمفتاح Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const s = active ? stats[active.id] : null;
  const hasAny = s ? s.heroes + s.producers + s.companies > 0 : false;

  // موضع التلميح كنسبة من أبعاد الخريطة
  const tipLeft = active ? `${(active.cx / VB_W) * 100}%` : "50%";
  const tipTop = active ? `${(active.cy / VB_H) * 100}%` : "50%";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={d.map.title}
    >
      {/* الخلفية */}
      <button
        aria-label={d.map.close}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-[2px]"
      />

      {/* البطاقة */}
      <div className="relative z-10 w-full max-w-[640px] overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_24px_70px_rgba(0,0,0,.35)]">
        {/* الترويسة */}
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-[17px] font-extrabold text-charcoal sm:text-[19px]">
              {d.map.title}
            </h2>
            <p className="mt-0.5 text-[13px] text-muted">{d.map.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={d.map.close}
            className="flex h-9 w-9 flex-none cursor-pointer items-center justify-center rounded-[10px] border border-line text-muted transition-colors hover:border-jazan hover:text-jazan"
          >
            <XIcon width={18} height={18} />
          </button>
        </div>

        {/* الخريطة */}
        <div className="relative p-4 sm:p-6" onMouseLeave={() => setActive(null)}>
          <svg
            viewBox={JAZAN_VIEWBOX}
            className="h-auto w-full"
            role="group"
            aria-label={d.map.title}
          >
            {governorates.map((g) => (
              <path
                key={g.id}
                d={g.d}
                onMouseEnter={() => setActive(g)}
                onClick={() => setActive(g)}
                aria-label={isAr ? g.ar : g.en}
                className={cn(
                  "cursor-pointer stroke-surface stroke-[1.5] transition-[fill] duration-150",
                  active?.id === g.id ? "fill-jazan" : "fill-jazan/20 hover:fill-jazan/45"
                )}
              />
            ))}
          </svg>

          {/* التلميح */}
          {active && s ? (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
              style={{ left: tipLeft, top: tipTop }}
              dir={isAr ? "rtl" : "ltr"}
            >
              <div className="w-max max-w-[240px] rounded-[14px] border border-line bg-surface px-4 py-3 shadow-[0_12px_32px_rgba(0,0,0,.25)]">
                <div className="text-[14px] font-extrabold text-charcoal">
                  {isAr ? active.ar : active.en}
                </div>
                {hasAny ? (
                  <div className="mt-2 flex flex-col gap-1.5">
                    <span className="inline-flex items-center gap-2 text-[12px] text-ink">
                      <UsersIcon width={14} height={14} className="text-jazan" />
                      <span className="mono font-bold text-jazan">{s.heroes}</span>
                      {d.map.heroes}
                    </span>
                    <span className="inline-flex items-center gap-2 text-[12px] text-ink">
                      <StoreIcon width={14} height={14} className="text-amber-dark" />
                      <span className="mono font-bold text-amber-dark">{s.producers}</span>
                      {d.map.producers}
                    </span>
                    <span className="inline-flex items-center gap-2 text-[12px] text-ink">
                      <BuildingIcon width={14} height={14} className="text-info-ink" />
                      <span className="mono font-bold text-info-ink">{s.companies}</span>
                      {d.map.companies}
                    </span>
                  </div>
                ) : (
                  <p className="mt-1.5 max-w-[200px] text-[12px] leading-relaxed text-muted">
                    {d.map.empty}
                  </p>
                )}
              </div>
              {/* سهم صغير */}
              <span className="mx-auto block h-2.5 w-2.5 -translate-y-[6px] rotate-45 border-b border-e border-line bg-surface" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
