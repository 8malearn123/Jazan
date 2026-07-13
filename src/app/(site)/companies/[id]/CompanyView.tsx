"use client";

import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import {
  BuildingIcon,
  CheckIcon,
  WhatsappIcon,
  MapPinIcon,
  BriefcaseIcon,
} from "@/components/icons";
import { whatsappLink, site } from "@/lib/site";
import { SocialLinksRow } from "@/components/SocialLinksRow";
import { useLocale } from "@/lib/i18n";
import type { Company, Job } from "@/lib/types";
import { CompanyJobCard } from "./CompanyJobCard";

/** محتوى صفحة الشركة — مكوّن عميل ليدعم تبديل اللغة */
export function CompanyView({ company, openJobs }: { company: Company; openJobs: Job[] }) {
  const { d } = useLocale();
  const t = d.companyDetail;

  const waHref = whatsappLink(
    company.whatsapp ?? site.whatsapp,
    `مرحباً ${company.name}، تواصلت معكم عبر منصة أبطال جازان`
  );

  const stats = [
    { label: t.openJobs, value: String(company.openings), Icon: BriefcaseIcon },
    { label: t.field, value: company.field, Icon: BuildingIcon },
    { label: t.location, value: company.city ?? "جازان", Icon: MapPinIcon },
    { label: t.verification, value: company.verified ? t.verified : t.notVerified, Icon: CheckIcon },
  ];

  return (
    <>
      {/* بطاقة الهوية المؤسسية */}
      <div className="mt-5 overflow-hidden rounded-[20px] border border-line bg-surface shadow-[0_1px_2px_rgba(28,42,38,.04)]">
        {/* غلاف بلون العلامة */}
        <div className="relative h-[120px] bg-jazan sm:h-[140px]">
          <div className="absolute inset-0 opacity-[.15] [background:radial-gradient(circle_at_20%_30%,#fff_0,transparent_45%)]" />
        </div>

        <div className="px-5 pb-6 sm:px-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <ImagePlaceholder
                shape="rounded"
                radius={18}
                label={t.logoLabel}
                className="-mt-10 h-[88px] w-[88px] flex-none border-[3px] border-surface bg-surface shadow-[0_6px_18px_rgba(28,42,38,.12)] sm:-mt-12 sm:h-[100px] sm:w-[100px]"
              />
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-[22px] font-extrabold tracking-[-.4px] text-charcoal sm:text-[26px]">
                    {company.name}
                  </h1>
                  {company.verified ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-info/12 px-3 py-[5px] text-xs font-bold text-info-ink">
                      <CheckIcon className="h-[13px] w-[13px]" strokeWidth={2.6} />
                      {t.verified}
                    </span>
                  ) : null}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-[18px] gap-y-1.5 text-sm text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <BuildingIcon className="h-4 w-4" />
                    {company.field}
                  </span>
                  {company.city ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPinIcon className="h-4 w-4" />
                      {company.city}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-max items-center gap-2 rounded-xl bg-whatsapp px-5 py-3 text-[15px] font-semibold text-white no-underline shadow-[0_6px_16px_rgba(37,211,102,.28)] transition-[filter] hover:brightness-95"
            >
              <WhatsappIcon className="h-[18px] w-[18px]" />
              {t.contactCompany}
            </a>
          </div>

          {/* شريط الإحصائيات */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-[14px] border border-line bg-cream/50 p-3.5">
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-jazan/10 text-jazan">
                  <s.Icon className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-bold text-charcoal">{s.value}</div>
                  <div className="text-[12px] text-muted">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* عمود رئيسي: الوظائف هي البطل */}
        <div className="lg:col-span-2">
          {/* عن الشركة */}
          <section className="rounded-[18px] border border-line bg-surface p-6">
            <h2 className="text-[17px] font-bold text-charcoal">{t.about}</h2>
            <p className="mt-3 text-[15px] leading-[1.9] text-ink">
              {company.about ?? t.aboutFallback}
            </p>
          </section>

          {/* الفرص المتاحة */}
          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-charcoal">
              {t.jobs}{" "}
              <span className="font-medium text-muted">
                (<span className="mono">{openJobs.length}</span>)
              </span>
            </h2>
          </div>
          <div className="mt-4 flex flex-col gap-3.5">
            {openJobs.map((job) => (
              <CompanyJobCard
                key={job.id}
                job={job}
                companyName={company.name}
                companyWhatsapp={company.whatsapp}
              />
            ))}
          </div>
        </div>

        {/* عمود جانبي */}
        <aside className="flex flex-col gap-5">
          {/* بيئة العمل */}
          <div className="rounded-[18px] border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(28,42,38,.04)]">
            <h3 className="text-base font-bold text-charcoal">{t.environment}</h3>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <ImagePlaceholder key={i} shape="rounded" radius={12} className="aspect-square w-full" />
              ))}
            </div>
          </div>

          {/* التواصل */}
          <div className="rounded-[18px] border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(28,42,38,.04)]">
            <h3 className="text-base font-bold text-charcoal">{t.contactUs}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {t.contactPrefix}
              {company.name}
              {t.contactSuffix}
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-3 text-[15px] font-semibold text-white no-underline shadow-[0_6px_16px_rgba(37,211,102,.28)] transition-[filter] hover:brightness-95"
              >
                <WhatsappIcon className="h-[18px] w-[18px]" />
                {t.wa}
              </a>
              <Link
                href="/companies"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-[1.5px] border-line bg-surface px-4 py-3 text-[15px] font-semibold text-charcoal no-underline transition-colors hover:border-jazan"
              >
                <BriefcaseIcon className="h-[18px] w-[18px] text-muted" />
                {t.browseOthers}
              </Link>
            </div>
            <SocialLinksRow profileId={company.id} seed={company.socials} className="mt-4 justify-start" />
          </div>
        </aside>
      </div>
    </>
  );
}
