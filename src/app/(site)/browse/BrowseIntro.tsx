"use client";

import { counts } from "@/lib/stats";
import { useLocale } from "@/lib/i18n";

/** عنوان صفحة تصفّح الأبطال (قابل للترجمة) */
export function BrowseIntro() {
  const { d } = useLocale();

  return (
    <header className="mt-6">
      <h1 className="text-[26px] font-extrabold tracking-[-.5px] text-charcoal sm:text-3xl">
        {d.browse.title}
      </h1>
      <p className="mt-2 text-[15px] text-muted sm:text-base">
        {d.browse.subtitlePrefix}
        <span className="mono font-semibold text-charcoal">{counts.heroes}</span>
        {d.browse.subtitleSuffix}
      </p>
    </header>
  );
}
