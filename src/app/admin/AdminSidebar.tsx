"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { counts } from "@/lib/stats";
import { GridIcon, UsersIcon, BuildingIcon, StoreIcon, StarFilledIcon } from "@/components/icons";
import {
  loadReviewModeration,
  onReviewModerationChange,
  pendingReviews,
} from "@/lib/reviews";

/** عدد التقييمات المعلّقة — يتحدّث مباشرة عند اعتماد/رفض المشرف */
function usePendingReviewsCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => setCount(pendingReviews(loadReviewModeration()).length);
    update();
    return onReviewModerationChange(update);
  }, []);
  return count;
}

/** أيقونة درع (التوثيق) */
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/** أيقونة بلاغ / تنبيه */
function FlagIcon({ className }: { className?: string }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

/** أيقونة إعدادات */
function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

type NavItem = {
  href: string;
  label: string;
  icon: (p: { className?: string }) => React.ReactNode;
  badge?: number;
};

const navItems: NavItem[] = [
  { href: "/admin", label: "لوحة المعلومات", icon: GridIcon },
  { href: "/admin/verifications", label: "التوثيق والطلبات", icon: ShieldIcon, badge: counts.pending },
  { href: "/admin/users", label: "المستخدمون", icon: UsersIcon },
  { href: "/admin/companies", label: "الشركات", icon: BuildingIcon },
  { href: "/admin/producers", label: "الأسر المنتجة", icon: StoreIcon },
  { href: "/admin/reviews", label: "التقييمات", icon: StarFilledIcon },
  { href: "/admin/reports", label: "البلاغات", icon: FlagIcon, badge: counts.openReports },
  { href: "/admin/settings", label: "الإعدادات", icon: SettingsIcon },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const pendingReviewsCount = usePendingReviewsCount();
  return (
    <nav className="flex flex-col gap-[3px]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const badge =
          item.href === "/admin/reviews" ? pendingReviewsCount : item.badge;
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-[11px] px-[13px] py-[11px] text-sm no-underline transition-colors duration-[200ms]",
              active
                ? "bg-white/[.08] font-semibold text-white"
                : "font-medium text-white/70 hover:bg-[#23332E]"
            )}
          >
            <Icon className={cn("h-[18px] w-[18px] shrink-0", active && "text-amber")} />
            <span className="truncate">{item.label}</span>
            {badge ? (
              <span className="mono ms-auto rounded-full bg-amber px-2 py-px text-[11px] font-bold text-white">
                {badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarHeader() {
  return (
    <div className="flex items-center gap-[10px] px-2 pb-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-jazan">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.1}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-amber"
        >
          <path d="M12 2l2.4 6.6L21 9.3l-5 4.3 1.6 6.9L12 16.9 6.4 20.5 8 13.6l-5-4.3 6.6-.7z" />
        </svg>
      </span>
      <div>
        <div className="text-[15px] font-extrabold text-white">أبطال جازان</div>
        <div className="text-[11px] text-white/50">لوحة التشغيل</div>
      </div>
    </div>
  );
}

/** الشريط الجانبي لسطح المكتب */
export function AdminSidebar() {
  return (
    <aside className="hidden w-[250px] flex-none flex-col bg-[#1c2a26] px-4 py-[22px] lg:flex">
      <SidebarHeader />
      <div className="my-[14px] h-px bg-white/[.08]" />
      <NavLinks />
    </aside>
  );
}

/** درج التنقّل للجوال */
export function AdminMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="فتح القائمة"
        className="flex h-10 w-10 items-center justify-center rounded-[11px] border border-line bg-surface text-charcoal lg:hidden"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="إغلاق القائمة"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="absolute inset-y-0 end-0 flex w-[260px] flex-col bg-[#1c2a26] px-4 py-[22px] shadow-2xl">
            <div className="flex items-center justify-between">
              <SidebarHeader />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="إغلاق"
                className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-white/[.06] text-white/70"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="my-[14px] h-px bg-white/[.08]" />
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}
