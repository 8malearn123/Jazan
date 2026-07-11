"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { MenuIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LangToggle } from "@/components/layout/LangToggle";
import { useAuth, roleLabels } from "@/components/auth/AuthProvider";
import { useLocale } from "@/lib/i18n";
import { homeForRole } from "@/lib/demo";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, ready } = useAuth();
  const { d } = useLocale();

  const navLinks = [
    { label: d.header.browse, href: "/browse" },
    { label: d.header.producers, href: "/producers" },
    { label: d.header.companies, href: "/companies" },
    { label: d.header.how, href: "/#how-it-works" },
  ];

  const dashboardHref = user ? homeForRole(user.role) : "/dashboard";
  const dashboardLabel =
    user?.role === "admin" ? d.header.adminPanel : d.header.dashboard;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8 sm:py-4 lg:px-11">
        <Logo size="md" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="jh-link text-[15px] font-medium text-charcoal no-underline"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3.5 lg:flex">
          <ThemeToggle />
          {ready && user ? (
            <>
              <span className="max-w-[180px] truncate text-[14px] text-muted">
                {d.header.hello}{" "}
                <span className="font-semibold text-charcoal">{user.name}</span>
                <span className="ms-1.5 rounded-full bg-jazan/10 px-2 py-0.5 text-[11px] font-semibold text-jazan">
                  {roleLabels[user.role]}
                </span>
              </span>
              <Button href={dashboardHref} size="sm">
                {dashboardLabel}
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[15px] font-medium text-charcoal no-underline"
              >
                {d.header.login}
              </Link>
              <Button href="/register" size="sm">
                {d.header.join}
              </Button>
            </>
          )}
          <LangToggle />
        </div>

        {/* Mobile: toggles + menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <LangToggle />
          <button
            type="button"
            aria-label="القائمة"
            onClick={() => setOpen((v) => !v)}
            className="cursor-pointer p-1.5"
          >
            <MenuIcon width={26} height={26} className="text-charcoal" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open ? (
        <div className="border-t border-line bg-cream px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-charcoal no-underline hover:bg-black/[.03]"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              {ready && user ? (
                <Button href={dashboardHref} size="sm">
                  {dashboardLabel}
                </Button>
              ) : (
                <>
                  <Button href="/login" variant="ghost" size="sm">
                    {d.header.login}
                  </Button>
                  <Button href="/register" size="sm">
                    {d.header.join}
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
