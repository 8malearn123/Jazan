"use client";

import { counts } from "@/lib/stats";
import { useLocale } from "@/lib/i18n";

/** عنوان صفحة الأسر المنتجة (قابل للترجمة) */
export function ProducersIntro() {
  const { d } = useLocale();

  return (
    <div className="mt-7">
      <h1 className="text-[28px] font-extrabold tracking-[-.5px] text-charcoal sm:text-[30px]">
        {d.producersPage.title}
      </h1>
      <p className="mt-2 text-[15px] text-muted sm:text-base">
        {d.producersPage.subtitlePrefix}
        <span className="mono font-semibold text-charcoal">{counts.producers}</span>
        {d.producersPage.subtitleSuffix}
      </p>
    </div>
  );
}
