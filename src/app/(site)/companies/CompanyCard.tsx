"use client";

import Link from "next/link";
import type { Company } from "@/lib/types";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { BuildingIcon, CheckIcon, MapPinIcon } from "@/components/icons";
import { useLocale } from "@/lib/i18n";

/** شارة "موثّقة" بلون أزرق */
function VerifiedBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-info/12 px-3 py-[5px] text-xs font-bold text-info-ink">
      <CheckIcon className="h-[13px] w-[13px]" strokeWidth={2.6} />
      {label}
    </span>
  );
}

/** بطاقة شركة / جهة في شبكة التصفّح */
export function CompanyCard({ company }: { company: Company }) {
  const { d } = useLocale();
  const { id, name, field, city, openings, verified } = company;

  return (
    <article className="flex flex-col rounded-[18px] border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(28,42,38,.04)] transition-[transform,box-shadow,border-color] duration-[250ms] hover:-translate-y-1 hover:border-jazan hover:shadow-[0_14px_34px_rgba(28,42,38,.12)]">
      {/* الشعار + التحقّق */}
      <div className="flex items-start justify-between">
        <ImagePlaceholder
          shape="rounded"
          radius={16}
          label="شعار"
          className="h-[60px] w-[60px] border border-line"
        />
        {verified ? <VerifiedBadge label={d.cards.verified} /> : null}
      </div>

      {/* الاسم */}
      <h3 className="mt-3.5 text-[17px] font-bold text-charcoal">{name}</h3>

      {/* المجال · المدينة */}
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <BuildingIcon className="h-4 w-4" />
          {field}
        </span>
        {city ? (
          <span className="inline-flex items-center gap-1.5">
            <MapPinIcon className="h-4 w-4" />
            {city}
          </span>
        ) : null}
      </div>

      {/* الفرص المفتوحة */}
      <div className="mt-3.5 inline-flex w-max items-center gap-1.5 rounded-lg bg-jazan/10 px-3 py-1.5 text-[13px] font-semibold text-jazan">
        <span className="mono">{openings}</span> {d.cards.openings}
      </div>

      {/* الإجراء */}
      <Link
        href={`/companies/${id}`}
        className="mt-4 rounded-[11px] border-[1.5px] border-jazan bg-surface px-3 py-2.5 text-center text-[13px] font-semibold text-jazan no-underline transition-colors hover:bg-jazan hover:text-white"
      >
        {d.cards.viewCompany}
      </Link>
    </article>
  );
}
