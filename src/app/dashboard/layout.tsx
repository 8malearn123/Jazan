"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { GridIcon, UsersIcon, MenuIcon, BriefcaseIcon, ImagesIcon, HeadsetIcon, ShareIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import { usePhotos } from "@/lib/photos";
import { DownloadPdfButton } from "@/components/dashboard/DownloadPdfButton";
import { useAuth, roleLabels } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/cn";
import type { UserRole } from "@/lib/types";

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

type NavItem = {
  href: string;
  label: string;
  Icon: ({ className }: { className?: string }) => React.ReactNode;
  badge?: string;
};

function navForRole(role: UserRole): NavItem[] {
  const items: NavItem[] = [
    { href: "/dashboard", label: "لوحة التحكم", Icon: GridIcon },
    { href: "/dashboard/profile", label: "ملفي الشخصي", Icon: UsersIcon },
    { href: "/dashboard/works", label: "أعمالي", Icon: ImagesIcon },
    { href: "/dashboard/support", label: "الدعم الفني", Icon: HeadsetIcon },
    { href: "/dashboard/social", label: "شبكات التواصل", Icon: ShareIcon },
  ];
  if (role === "company") {
    items.push({ href: "/dashboard/jobs", label: "إدارة الوظائف", Icon: BriefcaseIcon });
  }
  items.push({ href: "/dashboard/settings", label: "الإعدادات", Icon: SettingsIcon });
  return items;
}

function NavLinks({
  items,
  onNavigate,
}: {
  items: NavItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-[11px] px-3.5 py-2.5 text-sm no-underline transition-colors",
              active
                ? "bg-jazan/10 font-semibold text-jazan"
                : "font-medium text-ink hover:bg-tag"
            )}
          >
            <item.Icon className={active ? "text-jazan" : "text-muted"} />
            <span className="flex-1">{item.label}</span>
            {item.badge ? (
              <span className="mono rounded-full bg-jazan px-2 py-0.5 text-[11px] font-bold text-white">
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  const photos = usePhotos(user?.id);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-line border-t-jazan" />
      </div>
    );
  }

  const items = navForRole(user.role);
  const initial = user.name.trim().charAt(0) || "؟";

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface px-4 py-3 lg:hidden">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <NotificationBell />
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="rounded-[10px] border-[1.5px] border-line px-3 py-2 text-[13px] font-semibold text-charcoal transition-colors hover:bg-black/[.03]"
          >
            خروج
          </button>
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="فتح القائمة"
            className="rounded-[10px] border-[1.5px] border-line p-2 text-charcoal"
          >
            <MenuIcon width={20} height={20} />
          </button>
        </div>
      </header>

      {drawerOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="إغلاق القائمة"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <aside className="absolute inset-y-0 end-0 flex w-[280px] max-w-[82%] flex-col bg-surface p-4 shadow-xl">
            <div className="flex items-center justify-between pb-4">
              <Logo size="sm" />
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="إغلاق"
                className="rounded-lg p-1 text-muted hover:bg-black/[.04]"
              >
                <CloseIcon />
              </button>
            </div>
            <UserCard name={user.name} roleLabel={roleLabels[user.role]} initial={initial} avatar={photos.avatar} />
            <div className="mt-4">
              <NavLinks items={items} onNavigate={() => setDrawerOpen(false)} />
            </div>
            <div className="mt-auto flex flex-col gap-2">
              <DownloadPdfButton />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-[11px] px-3.5 py-2.5 text-sm text-muted transition-colors hover:bg-tag"
              >
                <LogoutIcon />
                تسجيل الخروج
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-[1280px] gap-0 lg:gap-6 lg:p-6">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-[248px] flex-none flex-col rounded-2xl border border-line bg-surface p-4 lg:flex">
          <div className="px-2 pb-4">
            <Logo size="sm" />
          </div>
          <UserCard name={user.name} roleLabel={roleLabels[user.role]} initial={initial} avatar={photos.avatar} />
          <div className="mt-4">
            <NavLinks items={items} />
          </div>
          <div className="mt-auto flex flex-col gap-2">
            <DownloadPdfButton />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-[11px] px-3.5 py-2.5 text-sm text-muted transition-colors hover:bg-tag"
            >
              <LogoutIcon />
              تسجيل الخروج
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 lg:px-0 lg:py-0">
          <div className="mb-5 hidden items-center justify-between rounded-2xl border border-line bg-surface px-5 py-3.5 lg:flex">
            <Logo size="sm" />
            <div className="flex items-center gap-4">
              <NotificationBell />
              <ThemeToggle />
              <div className="text-end">
                <div className="text-sm font-bold text-charcoal">{user.name}</div>
                <div className="text-[12px] text-muted">{roleLabels[user.role]}</div>
              </div>
              {photos.avatar ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={photos.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-jazan/10 text-[15px] font-bold text-jazan">
                  {initial}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-[11px] border-[1.5px] border-line px-3.5 py-2 text-[13px] font-semibold text-charcoal transition-colors hover:bg-black/[.03]"
              >
                <LogoutIcon className="text-muted" />
                تسجيل الخروج
              </button>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}

function UserCard({
  name,
  roleLabel,
  initial,
  avatar,
}: {
  name: string;
  roleLabel: string;
  initial: string;
  avatar?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[13px] border border-line bg-cream p-2.5">
      {avatar ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={avatar} alt={name} className="h-10 w-10 flex-none rounded-full object-cover" />
      ) : (
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-jazan/10 text-[15px] font-bold text-jazan">
          {initial}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-bold text-charcoal">{name}</div>
        <div className="truncate text-[12px] text-muted">{roleLabel}</div>
      </div>
    </div>
  );
}
