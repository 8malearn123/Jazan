"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { StatCard } from "./StatCard";
import { sampleHeroes, companies, producers, pendingVerifications } from "@/lib/data";
import { counts } from "@/lib/stats";

/* ===== أيقونات محلية صغيرة ===== */

function UserBadgeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
    </svg>
  );
}

function StoreBadgeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7l1.5-3h17L22 7" />
      <path d="M4 9.5V20h16V9.5" />
    </svg>
  );
}

function BuildingBadgeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V7l8-4v18" />
      <path d="M19 21V11l-6-4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx="12" cy="5" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="12" cy="19" r="1.4" />
    </svg>
  );
}

/* ===== مكوّنات مساعدة ===== */

type RoleKey = "hero" | "producer" | "company";

const roleConfig: Record<
  RoleKey,
  { label: string; cls: string; icon: () => React.ReactNode; shape: "circle" | "rounded" }
> = {
  hero: {
    label: "مستقل",
    cls: "bg-jazan/10 text-jazan",
    icon: UserBadgeIcon,
    shape: "circle",
  },
  producer: {
    label: "أسرة منتجة",
    cls: "bg-amber/[.14] text-[#C5781C]",
    icon: StoreBadgeIcon,
    shape: "rounded",
  },
  company: {
    label: "شركة",
    cls: "bg-info/12 text-[#1F5FCC]",
    icon: BuildingBadgeIcon,
    shape: "rounded",
  },
};

function RolePill({ role }: { role: RoleKey }) {
  const c = roleConfig[role];
  const Icon = c.icon;
  return (
    <span
      className={cn(
        "inline-flex w-max items-center gap-1.5 rounded-[8px] px-[11px] py-[5px] text-[12px] font-semibold",
        c.cls
      )}
    >
      <Icon />
      {c.label}
    </span>
  );
}

function PendingPill() {
  return (
    <span className="inline-flex w-max items-center gap-1.5 rounded-full bg-warn/16 px-[11px] py-[5px] text-[12px] font-semibold text-warn-ink">
      <span className="h-1.5 w-1.5 rounded-full bg-warn" />
      قيد المراجعة
    </span>
  );
}

function ActivePill() {
  return (
    <span className="inline-flex w-max items-center gap-1.5 rounded-full bg-success/12 px-[10px] py-1 text-[12px] font-semibold text-success-ink">
      <span className="h-1.5 w-1.5 rounded-full bg-success" />
      نشط
    </span>
  );
}

function SuspendedPill() {
  return (
    <span className="inline-flex w-max items-center gap-1.5 rounded-full bg-muted/[.14] px-[10px] py-1 text-[12px] font-semibold text-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-[#9AA29D]" />
      موقوف
    </span>
  );
}

function Avatar({ shape }: { shape: "circle" | "rounded" }) {
  return (
    <span
      className={cn(
        "h-[42px] w-[42px] flex-none bg-gradient-to-br from-[#eceae3] to-[#e3e0d8]",
        shape === "circle" ? "rounded-full" : "rounded-[11px]"
      )}
    />
  );
}

/* ===== أحدث المستخدمين (مزيج من البيانات الموجودة) ===== */

type RecentRow = {
  id: string;
  name: string;
  email: string;
  role: RoleKey;
  joined: string;
  active: boolean;
};

const recentUsers: RecentRow[] = [
  { id: sampleHeroes[0].id, name: sampleHeroes[0].name, email: "mohammed@email.com", role: "hero", joined: "يناير 2026", active: true },
  { id: producers[0].id, name: producers[0].name, email: "sabya@email.com", role: "producer", joined: "فبراير 2026", active: true },
  { id: companies[0].id, name: companies[0].name, email: "hr@tihama.sa", role: "company", joined: "مارس 2026", active: true },
  { id: sampleHeroes[5].id, name: sampleHeroes[5].name, email: "sara@email.com", role: "hero", joined: "مايو 2026", active: false },
];

/* ===== الصفحة ===== */

export default function AdminDashboardPage() {
  // طلبات التوثيق — قابلة للقبول/الرفض (تتحدّث محلياً)
  const [pending, setPending] = useState(pendingVerifications);
  const [toast, setToast] = useState("");

  function resolve(id: string, accepted: boolean) {
    const row = pending.find((p) => p.id === id);
    setPending((list) => list.filter((p) => p.id !== id));
    setToast(`${accepted ? "تم قبول" : "تم رفض"} طلب ${row?.name ?? ""}`);
    setTimeout(() => setToast(""), 2500);
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-5">
      {/* العنوان */}
      <div>
        <h1 className="text-[18px] font-extrabold text-charcoal">لوحة المعلومات</h1>
        <p className="mt-0.5 text-[13px] text-muted">
          نظرة عامة على المنصة وطلبات التوثيق المعلّقة وأحدث المستخدمين
        </p>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="إجمالي الأبطال" value={counts.heroes} accent="#0F5C4A" dot="bg-jazan" />
        <StatCard label="الأسر المنتجة" value={counts.producers} accent="#E8932E" dot="bg-amber" />
        <StatCard label="الشركات" value={counts.companies} accent="#2D7FF9" dot="bg-info" />
        <StatCard label="طلبات التوثيق المعلّقة" value={pending.length} accent="#F59E0B" dot="bg-warn" />
      </div>

      {/* تنبيه الإجراء */}
      {toast ? (
        <div className="rounded-xl bg-success/12 px-4 py-2.5 text-[13px] font-semibold text-success-ink">
          ✓ {toast}
        </div>
      ) : null}

      {/* جدول طلبات التوثيق المعلّقة */}
      <section className="overflow-hidden rounded-[18px] border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-[15px] font-bold text-charcoal">
              طلبات التوثيق المعلّقة
            </h2>
            <p className="mt-0.5 text-[13px] text-muted">
              راجِع العناصر الجديدة واعتمدها أو ارفضها قبل نشرها
            </p>
          </div>
          <span className="mono inline-flex items-center gap-1.5 rounded-[10px] bg-jazan px-3 py-2 text-[13px] font-semibold text-white">
            <span>قيد المراجعة</span>
            <span>{pending.length}</span>
          </span>
        </div>

        {pending.length === 0 ? (
          <div className="px-6 py-12 text-center text-[14px] text-muted">
            ✓ لا توجد طلبات معلّقة — تمت مراجعة الكل.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              {/* رأس الجدول */}
              <div className="grid grid-cols-[2fr_1.1fr_1fr_230px] gap-3.5 border-b border-line bg-cream px-5 py-3 text-[12px] font-bold text-muted sm:px-6">
                <span>الاسم / النوع</span>
                <span>الدور</span>
                <span>التاريخ</span>
                <span className="text-start">الإجراءات</span>
              </div>

              {/* الصفوف */}
              {pending.map((row, i) => (
                <div
                  key={row.id}
                  className={cn(
                    "grid grid-cols-[2fr_1.1fr_1fr_230px] items-center gap-3.5 px-5 py-3 transition-colors duration-[150ms] hover:bg-cream sm:px-6",
                    i < pending.length - 1 && "border-b border-[#F0EDE6]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Avatar shape={roleConfig[row.role].shape} />
                    <div className="min-w-0">
                      <div className="truncate text-[15px] font-bold text-charcoal">
                        {row.name}
                      </div>
                      <div className="truncate text-[12px] text-muted">{row.city}</div>
                    </div>
                  </div>
                  <RolePill role={row.role} />
                  <div className="flex flex-col gap-1.5">
                    <span className="mono text-[13px] text-muted">{row.date}</span>
                    <PendingPill />
                  </div>
                  <div className="flex justify-start gap-2">
                    <Link
                      href={`/admin/verifications/${row.id}`}
                      className="inline-flex items-center gap-1.5 rounded-[9px] border-[1.5px] border-line bg-white px-3 py-2 text-[13px] font-semibold text-charcoal no-underline transition-colors duration-[150ms] hover:bg-cream"
                    >
                      <span className="text-muted">
                        <EyeIcon />
                      </span>
                      <span className="hidden sm:inline">معاينة</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => resolve(row.id, false)}
                      className="rounded-[9px] border-[1.5px] border-[#F3D6D6] bg-white px-3.5 py-2 text-[13px] font-semibold text-[#DC2626] transition-colors duration-[150ms] hover:bg-[#FBEAEA]"
                    >
                      رفض
                    </button>
                    <button
                      type="button"
                      onClick={() => resolve(row.id, true)}
                      className="rounded-[9px] bg-success px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-[150ms] hover:bg-success-ink"
                    >
                      قبول
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* جدول أحدث المستخدمين */}
      <section className="overflow-hidden rounded-[18px] border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-[15px] font-bold text-charcoal">أحدث المستخدمين</h2>
            <p className="mt-0.5 text-[13px] text-muted">
              آخر الأعضاء المنضمّين إلى المنصة
            </p>
          </div>
          <a
            href="/admin/users"
            className="text-[13px] font-semibold text-jazan no-underline hover:underline"
          >
            عرض الكل
          </a>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-[2fr_1fr_130px_120px_70px] gap-3.5 border-b border-line bg-cream px-5 py-3 text-[12px] font-bold text-muted sm:px-6">
              <span>العضو</span>
              <span>الدور</span>
              <span>الانضمام</span>
              <span>الحالة</span>
              <span className="text-start">إجراء</span>
            </div>

            {recentUsers.map((u, i) => (
              <div
                key={u.id}
                className={cn(
                  "grid grid-cols-[2fr_1fr_130px_120px_70px] items-center gap-3.5 px-5 py-3 transition-colors duration-[150ms] hover:bg-cream sm:px-6",
                  i < recentUsers.length - 1 && "border-b border-[#F0EDE6]"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "h-[38px] w-[38px] flex-none bg-gradient-to-br from-[#eceae3] to-[#e3e0d8]",
                      roleConfig[u.role].shape === "circle"
                        ? "rounded-full"
                        : "rounded-[11px]"
                    )}
                  />
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-bold text-charcoal">
                      {u.name}
                    </div>
                    <div className="mono truncate text-[11px] text-muted">
                      {u.email}
                    </div>
                  </div>
                </div>
                <RolePill role={u.role} />
                <span className="mono text-[13px] text-muted">{u.joined}</span>
                {u.active ? <ActivePill /> : <SuspendedPill />}
                <Link
                  href="/admin/users"
                  aria-label="إدارة المستخدم"
                  className="flex h-[34px] w-[34px] items-center justify-center justify-self-start rounded-[8px] border border-line bg-white text-muted no-underline transition-colors duration-[150ms] hover:bg-cream"
                >
                  <DotsIcon />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
