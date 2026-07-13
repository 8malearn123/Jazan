"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { governorates, JAZAN_VIEWBOX, type Governorate } from "@/lib/jazan-map";
import { sampleHeroes, producers, companies } from "@/lib/data";
import { normalizeText } from "@/lib/text";
import {
  loadRegistry,
  onRegistryChange,
  type RegisteredMember,
} from "@/lib/registry";
import { useLocale } from "@/lib/i18n";
import {
  XIcon,
  UsersIcon,
  StoreIcon,
  BuildingIcon,
  ArrowLeftIcon,
} from "@/components/icons";
import { cn } from "@/lib/cn";
import type { Hero, Producer, Company } from "@/lib/types";

type GovMembers = {
  heroes: Hero[];
  producers: Producer[];
  companies: Company[];
  /** المسجّلون الجدد في هذه المحافظة (من سجل التسجيل الحي) */
  newHeroes: RegisteredMember[];
  newProducers: RegisteredMember[];
  newCompanies: RegisteredMember[];
};

/** إجمالي فئة في المحافظة (البيانات الأساسية + المسجّلون الجدد) */
function total(m: GovMembers, kind: "heroes" | "producers" | "companies"): number {
  const extra =
    kind === "heroes" ? m.newHeroes : kind === "producers" ? m.newProducers : m.newCompanies;
  return m[kind].length + extra.length;
}

/**
 * أعضاء كل محافظة — بيانات المنصة بمطابقة اسم المدينة (مع التطبيع
 * العربي) + المسجّلون الجدد من سجل التسجيل، ويتحدثون تلقائياً
 * فور أي تسجيل جديد دون إعادة تحميل.
 */
function useGovMembers(): Record<string, GovMembers> {
  const [registry, setRegistry] = useState<RegisteredMember[]>([]);

  useEffect(() => {
    const update = () => setRegistry(loadRegistry());
    update();
    return onRegistryChange(update);
  }, []);

  return useMemo(() => {
    const members: Record<string, GovMembers> = {};
    for (const g of governorates) {
      const key = normalizeText(g.ar);
      const inGov = registry.filter((m) => normalizeText(m.city ?? "") === key);
      members[g.id] = {
        heroes: sampleHeroes.filter((h) => normalizeText(h.city) === key),
        producers: producers.filter((p) => normalizeText(p.city) === key),
        companies: companies.filter((c) => normalizeText(c.city ?? "") === key),
        newHeroes: inGov.filter((m) => m.role === "hero"),
        newProducers: inGov.filter((m) => m.role === "producer"),
        newCompanies: inGov.filter((m) => m.role === "company"),
      };
    }
    return members;
  }, [registry]);
}

const VB_W = 520;
const VB_H = 473;

/** صف عضو مسجّل حديثاً — بدون صفحة عامة بعد */
function NewMemberRow({ name, sub, tone }: { name: string; sub: string; tone: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[12px] border border-dashed border-line bg-surface px-3.5 py-2.5">
      <span
        className={cn(
          "flex h-9 w-9 flex-none items-center justify-center rounded-full text-[14px] font-bold",
          tone
        )}
      >
        {name.trim().charAt(0)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-bold text-charcoal">{name}</span>
        <span className="block truncate text-[12px] text-muted">{sub}</span>
      </span>
      <span className="flex-none rounded-full bg-success/12 px-2 py-0.5 text-[10px] font-bold text-success-ink">
        ✦
      </span>
    </div>
  );
}

/** صف عضو داخل قائمة المحافظة — رابط لملفه */
function MemberRow({
  href,
  name,
  sub,
  tone,
  onNavigate,
}: {
  href: string;
  name: string;
  sub?: string;
  tone: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group flex items-center gap-3 rounded-[12px] border border-line bg-surface px-3.5 py-2.5 no-underline transition-colors hover:border-jazan"
    >
      <span
        className={cn(
          "flex h-9 w-9 flex-none items-center justify-center rounded-full text-[14px] font-bold",
          tone
        )}
      >
        {name.trim().charAt(0)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-bold text-charcoal group-hover:text-jazan">
          {name}
        </span>
        {sub ? <span className="block truncate text-[12px] text-muted">{sub}</span> : null}
      </span>
      <ArrowLeftIcon width={15} height={15} className="flex-none text-muted ltr:-scale-x-100" />
    </Link>
  );
}

export function JazanMap({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { d, isAr } = useLocale();
  const members = useGovMembers();
  const [hovered, setHovered] = useState<Governorate | null>(null);
  const [selected, setSelected] = useState<Governorate | null>(null);

  // إغلاق مع تصفير الاختيار
  function handleClose() {
    setSelected(null);
    setHovered(null);
    onClose();
  }

  // إغلاق بمفتاح Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);

  if (!open) return null;

  const hoverM = hovered ? members[hovered.id] : null;
  const hoverAny = hoverM
    ? total(hoverM, "heroes") + total(hoverM, "producers") + total(hoverM, "companies") > 0
    : false;

  const selM = selected ? members[selected.id] : null;
  const selAny = selM
    ? total(selM, "heroes") + total(selM, "producers") + total(selM, "companies") > 0
    : false;

  const tipLeft = hovered ? `${(hovered.cx / VB_W) * 100}%` : "50%";
  const tipTop = hovered ? `${(hovered.cy / VB_H) * 100}%` : "50%";

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
        onClick={handleClose}
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-[2px]"
      />

      {/* البطاقة */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-[640px] flex-col overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_24px_70px_rgba(0,0,0,.35)]">
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
            onClick={handleClose}
            aria-label={d.map.close}
            className="flex h-9 w-9 flex-none cursor-pointer items-center justify-center rounded-[10px] border border-line text-muted transition-colors hover:border-jazan hover:text-jazan"
          >
            <XIcon width={18} height={18} />
          </button>
        </div>

        <div className="overflow-y-auto">
          {/* الخريطة */}
          <div className="relative p-4 sm:p-6" onMouseLeave={() => setHovered(null)}>
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
                  onMouseEnter={() => setHovered(g)}
                  onClick={() => setSelected(g)}
                  aria-label={isAr ? g.ar : g.en}
                  className={cn(
                    "cursor-pointer stroke-surface stroke-[1.5] transition-[fill] duration-150",
                    selected?.id === g.id
                      ? "fill-jazan"
                      : hovered?.id === g.id
                        ? "fill-jazan/45"
                        : "fill-jazan/20"
                  )}
                />
              ))}
            </svg>

            {/* تلميح التمرير */}
            {hovered && hoverM && hovered.id !== selected?.id ? (
              <div
                className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
                style={{ left: tipLeft, top: tipTop }}
                dir={isAr ? "rtl" : "ltr"}
              >
                <div className="w-max max-w-[240px] rounded-[14px] border border-line bg-surface px-4 py-3 shadow-[0_12px_32px_rgba(0,0,0,.25)]">
                  <div className="text-[14px] font-extrabold text-charcoal">
                    {isAr ? hovered.ar : hovered.en}
                  </div>
                  {hoverAny ? (
                    <>
                      <div className="mt-2 flex flex-col gap-1.5">
                        <span className="inline-flex items-center gap-2 text-[12px] text-ink">
                          <UsersIcon width={14} height={14} className="text-jazan" />
                          <span className="mono font-bold text-jazan">{total(hoverM, "heroes")}</span>
                          {d.map.heroes}
                        </span>
                        <span className="inline-flex items-center gap-2 text-[12px] text-ink">
                          <StoreIcon width={14} height={14} className="text-amber-dark" />
                          <span className="mono font-bold text-amber-dark">{total(hoverM, "producers")}</span>
                          {d.map.producers}
                        </span>
                        <span className="inline-flex items-center gap-2 text-[12px] text-ink">
                          <BuildingIcon width={14} height={14} className="text-info-ink" />
                          <span className="mono font-bold text-info-ink">{total(hoverM, "companies")}</span>
                          {d.map.companies}
                        </span>
                      </div>
                      <p className="mt-2 border-t border-line pt-1.5 text-[11px] font-semibold text-jazan">
                        {d.map.clickHint}
                      </p>
                    </>
                  ) : (
                    <p className="mt-1.5 max-w-[200px] text-[12px] leading-relaxed text-muted">
                      {d.map.empty}
                    </p>
                  )}
                </div>
                <span className="mx-auto block h-2.5 w-2.5 -translate-y-[6px] rotate-45 border-b border-e border-line bg-surface" />
              </div>
            ) : null}
          </div>

          {/* لوحة الحسابات للمحافظة المختارة */}
          {selected && selM ? (
            <div className="border-t border-line px-4 pb-5 pt-4 sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[15px] font-extrabold text-charcoal">
                  {d.map.membersIn} {isAr ? selected.ar : selected.en}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="cursor-pointer text-[12px] font-semibold text-muted transition-colors hover:text-jazan"
                >
                  {d.map.backToMap}
                </button>
              </div>

              {selAny ? (
                <div className="mt-3 flex flex-col gap-4">
                  {total(selM, "heroes") > 0 ? (
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-[12px] font-bold text-jazan">
                        <UsersIcon width={14} height={14} />
                        {d.map.heroes}
                        <span className="mono">({total(selM, "heroes")})</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {selM.heroes.map((h) => (
                          <MemberRow
                            key={h.id}
                            href={`/heroes/${h.id}`}
                            name={h.name}
                            sub={h.title}
                            tone="bg-jazan/10 text-jazan"
                            onNavigate={handleClose}
                          />
                        ))}
                        {selM.newHeroes.map((m) => (
                          <NewMemberRow
                            key={m.id}
                            name={m.name}
                            sub={d.map.newMember}
                            tone="bg-jazan/10 text-jazan"
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {total(selM, "producers") > 0 ? (
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-[12px] font-bold text-amber-dark">
                        <StoreIcon width={14} height={14} />
                        {d.map.producers}
                        <span className="mono">({total(selM, "producers")})</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {selM.producers.map((p) => (
                          <MemberRow
                            key={p.id}
                            href={`/producers/${p.id}`}
                            name={p.name}
                            sub={d.prodCat[p.category] ?? p.category}
                            tone="bg-amber/15 text-amber-dark"
                            onNavigate={handleClose}
                          />
                        ))}
                        {selM.newProducers.map((m) => (
                          <NewMemberRow
                            key={m.id}
                            name={m.name}
                            sub={d.map.newMember}
                            tone="bg-amber/15 text-amber-dark"
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {total(selM, "companies") > 0 ? (
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-[12px] font-bold text-info-ink">
                        <BuildingIcon width={14} height={14} />
                        {d.map.companies}
                        <span className="mono">({total(selM, "companies")})</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {selM.companies.map((c) => (
                          <MemberRow
                            key={c.id}
                            href={`/companies/${c.id}`}
                            name={c.name}
                            sub={c.field}
                            tone="bg-info/12 text-info-ink"
                            onNavigate={handleClose}
                          />
                        ))}
                        {selM.newCompanies.map((m) => (
                          <NewMemberRow
                            key={m.id}
                            name={m.name}
                            sub={d.map.newMember}
                            tone="bg-info/12 text-info-ink"
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="mt-3 rounded-[12px] border border-dashed border-line bg-cream/40 px-4 py-5 text-center text-[13px] text-muted">
                  {d.map.empty}
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
