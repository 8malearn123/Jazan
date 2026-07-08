"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/components/auth/AuthProvider";
import { AdminSidebar, AdminMobileNav } from "./AdminSidebar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, ready, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [ready, user, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-line border-t-jazan" />
          <span className="text-sm text-muted">جارٍ التحميل…</span>
        </div>
      </div>
    );
  }

  // أثناء إعادة التوجيه (مستخدم غير مصرّح له)
  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <span className="text-sm text-muted">جارٍ إعادة التوجيه…</span>
      </div>
    );
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* الشريط العلوي */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-surface px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <AdminMobileNav />
            <div className="hidden sm:block">
              <Logo size="sm" />
            </div>
            <span className="rounded-[8px] bg-jazan/10 px-3 py-1 text-[12px] font-semibold text-jazan">
              لوحة المشرف
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden text-end leading-tight sm:block">
              <div className="text-[13px] font-semibold text-charcoal">
                {user.name}
              </div>
              <div className="text-[11px] text-muted">مدير عام</div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-surface px-3 py-2 text-[13px] font-semibold text-charcoal transition-colors duration-[150ms] hover:bg-black/[.03]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">{children}</main>
      </div>
    </div>
  );
}
