"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { MenuIcon } from "@/components/icons";
import { navLinks } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

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
          <Link
            href="/login"
            className="text-[15px] font-medium text-charcoal no-underline"
          >
            تسجيل الدخول
          </Link>
          <Button href="/register" size="sm">
            انضم كبطل
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="القائمة"
          onClick={() => setOpen((v) => !v)}
          className="cursor-pointer p-1.5 lg:hidden"
        >
          <MenuIcon width={26} height={26} className="text-charcoal" />
        </button>
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
              <Button href="/login" variant="ghost" size="sm">
                تسجيل الدخول
              </Button>
              <Button href="/register" size="sm">
                انضم كبطل
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
