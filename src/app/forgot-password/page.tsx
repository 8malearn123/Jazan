"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon } from "@/components/icons";
import { useLocale } from "@/lib/i18n";

const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-surface px-4 py-3 text-[15px] text-charcoal outline-none transition-colors placeholder:text-[#9aa29d] focus:border-jazan focus:shadow-[0_0_0_4px_rgba(15,92,74,.08)]";

export default function ForgotPasswordPage() {
  const { d } = useLocale();
  const [sent, setSent] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="md" />
        </div>

        <div className="rounded-[22px] border border-line bg-surface p-7 shadow-[0_8px_28px_rgba(28,42,38,.06)] sm:p-9">
          {sent ? (
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <h1 className="mt-4 text-[22px] font-extrabold text-charcoal">{d.auth.forgotSentTitle}</h1>
              <p className="mt-2 text-[15px] leading-8 text-muted">
                {d.auth.forgotSentDesc}
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-[24px] font-extrabold tracking-[-.4px] text-charcoal">
                {d.auth.forgotTitle}
              </h1>
              <p className="mt-2 text-[15px] leading-7 text-muted">
                {d.auth.forgotDesc}
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="mt-6 flex flex-col gap-4"
              >
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-charcoal">
                    {d.auth.email}
                  </label>
                  <input required type="email" className={inputClass} placeholder="you@example.com" />
                </div>
                <Button type="submit" variant="primary" className="w-full">
                  {d.auth.forgotBtn}
                </Button>
              </form>
            </>
          )}

          <Link
            href="/login"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-muted no-underline transition-colors hover:text-jazan"
          >
            <ArrowLeftIcon width={16} height={16} />
            {d.auth.backToLogin}
          </Link>
        </div>
      </div>
    </main>
  );
}
