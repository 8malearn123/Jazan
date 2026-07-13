"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { governorates, type Governorate } from "@/lib/jazan-map";
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
const MAX_ZOOM = 6;

type ViewBox = { x: number; y: number; w: number; h: number };
const BASE_VB: ViewBox = { x: 0, y: 0, w: VB_W, h: VB_H };

/** تثبيت إطار العرض داخل حدود الخريطة */
function clampVb(vb: ViewBox): ViewBox {
  const w = Math.min(VB_W, Math.max(VB_W / MAX_ZOOM, vb.w));
  const h = Math.min(VB_H, Math.max(VB_H / MAX_ZOOM, vb.h));
  return {
    w,
    h,
    x: Math.min(Math.max(vb.x, 0), VB_W - w),
    y: Math.min(Math.max(vb.y, 0), VB_H - h),
  };
}

/** تكبير/تصغير حول نقطة مركزية (بإحداثيات viewBox) */
function zoomVb(vb: ViewBox, factor: number, cx?: number, cy?: number): ViewBox {
  const centerX = cx ?? vb.x + vb.w / 2;
  const centerY = cy ?? vb.y + vb.h / 2;
  const w = vb.w / factor;
  const h = vb.h / factor;
  return clampVb({
    w,
    h,
    x: centerX - ((centerX - vb.x) / vb.w) * w,
    y: centerY - ((centerY - vb.y) / vb.h) * h,
  });
}

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

  // --- السحب والتكبير ---
  const [vb, setVb] = useState<ViewBox>(BASE_VB);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const drag = useRef<{ id: number; x: number; y: number; vb: ViewBox; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
  const pinch = useRef<Map<number, { x: number; y: number }>>(new Map());
  const zoom = VB_W / vb.w;

  /** تحويل نقطة شاشة إلى إحداثيات viewBox */
  function toVbPoint(clientX: number, clientY: number) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: vb.x + vb.w / 2, y: vb.y + vb.h / 2 };
    return {
      x: vb.x + ((clientX - rect.left) / rect.width) * vb.w,
      y: vb.y + ((clientY - rect.top) / rect.height) * vb.h,
    };
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pinch.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current.size === 1) {
      drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, vb, moved: false };
      setDragging(true);
    } else {
      drag.current = null;
      setDragging(false);
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    const prev = pinch.current.get(e.pointerId);
    if (!prev) return;

    // قرصة بإصبعين = تكبير/تصغير
    if (pinch.current.size === 2) {
      const pts = [...pinch.current.entries()];
      const other = pts.find(([id]) => id !== e.pointerId)?.[1];
      if (other) {
        const before = Math.hypot(prev.x - other.x, prev.y - other.y);
        const after = Math.hypot(e.clientX - other.x, e.clientY - other.y);
        if (before > 0) {
          const mid = toVbPoint((e.clientX + other.x) / 2, (e.clientY + other.y) / 2);
          setVb((v) => zoomVb(v, after / before, mid.x, mid.y));
        }
      }
      pinch.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      return;
    }

    pinch.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // سحب بإصبع/مؤشر واحد = تحريك الخريطة
    const dstate = drag.current;
    if (!dstate || dstate.id !== e.pointerId) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = ((e.clientX - dstate.x) / rect.width) * dstate.vb.w;
    const dy = ((e.clientY - dstate.y) / rect.height) * dstate.vb.h;
    if (Math.abs(e.clientX - dstate.x) + Math.abs(e.clientY - dstate.y) > 6) dstate.moved = true;
    setVb(clampVb({ ...dstate.vb, x: dstate.vb.x - dx, y: dstate.vb.y - dy }));
  }

  function onPointerUp(e: React.PointerEvent) {
    pinch.current.delete(e.pointerId);
    if (drag.current?.id === e.pointerId) {
      // أخّر التصفير حتى يلتقط onClick قيمة moved
      const moved = drag.current.moved;
      drag.current = null;
      setDragging(false);
      if (moved) suppressClick.current = true;
      setTimeout(() => (suppressClick.current = false), 0);
    }
  }
  const suppressClick = useRef(false);

  function onWheel(e: React.WheelEvent) {
    const pt = toVbPoint(e.clientX, e.clientY);
    setVb((v) => zoomVb(v, e.deltaY < 0 ? 1.18 : 1 / 1.18, pt.x, pt.y));
  }

  // إغلاق مع تصفير الاختيار
  function handleClose() {
    setSelected(null);
    setHovered(null);
    setVb(BASE_VB);
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

  // موضع التلميح يراعي إطار العرض الحالي (السحب/التكبير)
  // مع تثبيته داخل حدود الخريطة حتى لا ينقص النص عند الحواف
  const tipXPct = hovered ? ((hovered.cx - vb.x) / vb.w) * 100 : 50;
  const tipYPct = hovered ? ((hovered.cy - vb.y) / vb.h) * 100 : 50;
  const tipLeft = `clamp(135px, ${tipXPct}%, calc(100% - 135px))`;
  const tipTop = `${Math.min(Math.max(tipYPct, 0), 100)}%`;
  // قرب أعلى الخريطة يظهر التلميح تحت المؤشر بدل فوقه
  const tipBelow = tipYPct < 42;

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
              ref={svgRef}
              viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
              className={cn("h-auto w-full touch-none select-none", dragging ? "cursor-grabbing" : "cursor-grab")}
              role="group"
              aria-label={d.map.title}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onWheel={onWheel}
            >
              {governorates.map((g) => (
                <path
                  key={g.id}
                  d={g.d}
                  onMouseEnter={() => setHovered(g)}
                  onClick={() => {
                    if (!suppressClick.current) setSelected(g);
                  }}
                  aria-label={isAr ? g.ar : g.en}
                  className={cn(
                    "cursor-pointer stroke-surface transition-[fill] duration-150",
                    selected?.id === g.id
                      ? "fill-jazan"
                      : hovered?.id === g.id
                        ? "fill-jazan/45"
                        : "fill-jazan/20"
                  )}
                  strokeWidth={1.5 / zoom}
                />
              ))}
            </svg>

            {/* أزرار التكبير/التصغير */}
            <div className="absolute bottom-6 start-6 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setVb((v) => zoomVb(v, 1.4))}
                aria-label="تكبير"
                title="تكبير"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border border-line bg-surface text-[18px] font-bold text-charcoal shadow-[0_4px_14px_rgba(28,42,38,.12)] transition-colors hover:border-jazan hover:text-jazan"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setVb((v) => zoomVb(v, 1 / 1.4))}
                aria-label="تصغير"
                title="تصغير"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border border-line bg-surface text-[18px] font-bold text-charcoal shadow-[0_4px_14px_rgba(28,42,38,.12)] transition-colors hover:border-jazan hover:text-jazan"
              >
                −
              </button>
              {zoom > 1.01 ? (
                <button
                  type="button"
                  onClick={() => setVb(BASE_VB)}
                  aria-label="إعادة الضبط"
                  title="إعادة الضبط"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border border-line bg-surface text-[13px] font-bold text-charcoal shadow-[0_4px_14px_rgba(28,42,38,.12)] transition-colors hover:border-jazan hover:text-jazan"
                >
                  ⟳
                </button>
              ) : null}
            </div>

            {/* تلميح التمرير — يظهر تحت المؤشر قرب أعلى الخريطة وفوقه في باقيها */}
            {hovered && hoverM && hovered.id !== selected?.id ? (
              <div
                className={cn(
                  "pointer-events-none absolute z-10 -translate-x-1/2",
                  tipBelow ? "translate-y-[14px]" : "-translate-y-full"
                )}
                style={{ left: tipLeft, top: tipTop }}
                dir={isAr ? "rtl" : "ltr"}
              >
                {tipBelow ? (
                  <span className="mx-auto block h-2.5 w-2.5 translate-y-[6px] rotate-45 border-s border-t border-line bg-surface" />
                ) : null}
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
                {!tipBelow ? (
                  <span className="mx-auto block h-2.5 w-2.5 -translate-y-[6px] rotate-45 border-b border-e border-line bg-surface" />
                ) : null}
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
