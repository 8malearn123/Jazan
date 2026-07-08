"use client";

import { counts } from "@/lib/stats";
import { useLocale } from "@/lib/i18n";

/** عنوان صفحة الشركات والوظائف (قابل للترجمة) */
export function CompaniesIntro() {
  const { d } = useLocale();

  return (
    <header className="mt-6">
      <h1 className="text-[26px] font-extrabold tracking-[-.5px] text-charcoal sm:text-3xl">
        {d.companiesPage.title}
      </h1>
      <p className="mt-2 text-[15px] text-muted sm:text-base">
        {d.companiesPage.subtitlePrefix}
        <span className="mono font-semibold text-charcoal">{counts.openings}</span>
        {d.companiesPage.subtitleMid}
        <span className="mono font-semibold text-charcoal">{counts.companies}</span>
        {d.companiesPage.subtitleSuffix}
      </p>
    </header>
  );
}
