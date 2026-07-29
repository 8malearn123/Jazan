"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * شعار «فرصة» الرسمي — كلمة فرصة بالخط العربي مع الأسهم الخضراء.
 * النسخة الحمراء للخلفيات الفاتحة، والبيضاء للوضع الداكن والخلفيات الملوّنة
 * (التبديل عبر صنفي logo-light/logo-dark في globals.css).
 */
export function Logo({
  size = "md",
  variant = "auto",
  className,
}: {
  size?: "sm" | "md" | "lg";
  variant?: "auto" | "white";
  className?: string;
}) {
  const h = { sm: "h-[38px]", md: "h-[48px]", lg: "h-[62px]" }[size];

  if (variant === "white") {
    return (
      <Link href="/" className={cn("inline-flex items-center no-underline", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/forsa-logo-white.svg" alt="فرصة — FORSA" className={cn(h, "w-auto")} />
      </Link>
    );
  }

  return (
    <Link href="/" className={cn("inline-flex items-center no-underline", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/forsa-logo.svg" alt="فرصة — FORSA" className={cn(h, "logo-light w-auto")} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/forsa-logo-white.svg"
        alt=""
        aria-hidden
        className={cn(h, "logo-dark w-auto")}
      />
    </Link>
  );
}
