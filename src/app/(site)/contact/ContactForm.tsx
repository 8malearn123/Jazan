"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n";

const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-surface px-4 py-3 text-[15px] text-charcoal outline-none transition-colors placeholder:text-[#9aa29d] focus:border-jazan focus:shadow-[0_0_0_4px_rgba(15,92,74,.08)]";

export function ContactForm() {
  const { d } = useLocale();
  const t = d.contactPage;
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[20px] border border-line bg-surface p-10 text-center shadow-[0_1px_2px_rgba(28,42,38,.04)]">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="text-success">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <h3 className="mt-4 text-[20px] font-extrabold text-charcoal">{t.sentTitle}</h3>
        <p className="mt-2 text-[15px] text-muted">{t.sentDesc}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="rounded-[20px] border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(28,42,38,.04)] sm:p-8"
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-2 block text-[13px] font-semibold text-charcoal">{t.formName}</label>
          <input required className={inputClass} placeholder={t.formNamePh} />
        </div>
        <div>
          <label className="mb-2 block text-[13px] font-semibold text-charcoal">{t.formEmail}</label>
          <input required type="email" className={inputClass} placeholder="you@example.com" />
        </div>
        <div>
          <label className="mb-2 block text-[13px] font-semibold text-charcoal">{t.formMsg}</label>
          <textarea required rows={5} className={`${inputClass} resize-none`} placeholder={t.formMsgPh} />
        </div>
        <Button type="submit" variant="primary" className="w-full">
          {t.send}
        </Button>
      </div>
    </form>
  );
}
