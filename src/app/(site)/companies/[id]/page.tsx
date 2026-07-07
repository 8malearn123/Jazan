import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import {
  BuildingIcon,
  CheckIcon,
  ArrowLeftIcon,
  WhatsappIcon,
} from "@/components/icons";
import { companies, getCompany } from "@/lib/data";
import { whatsappLink, site } from "@/lib/site";
import type { Job } from "@/lib/types";
import { CompanyJobCard } from "./CompanyJobCard";

export function generateStaticParams() {
  return companies.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const company = getCompany(id);
  if (!company) return { title: "شركة غير موجودة · أبطال جازان" };
  return {
    title: `${company.name} · أبطال جازان`,
    description:
      company.about ??
      `${company.name} — ${company.field}${company.city ? ` · ${company.city}` : ""}. تصفّح الفرص المتاحة وتقدّم مباشرة.`,
  };
}

/** دبوس الموقع */
function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/** أيقونة حقيبة عمل */
function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

/** يبني فرصاً تجريبية لشركة معيّنة */
function sampleJobsFor(companyId: string, companyName: string): Job[] {
  return [
    {
      id: `${companyId}-job1`,
      title: "مطوّر واجهات أمامية",
      companyName,
      companyId,
      city: "جيزان",
      type: "دوام كامل",
      tags: ["React", "TypeScript", "RTL"],
      postedAt: "منذ يومين",
    },
    {
      id: `${companyId}-job2`,
      title: "مصمّم UI/UX",
      companyName,
      companyId,
      city: "عن بُعد",
      type: "عن بُعد",
      tags: ["Figma", "بحوث مستخدم"],
      postedAt: "منذ 4 أيام",
    },
    {
      id: `${companyId}-job3`,
      title: "كاتب محتوى تقني",
      companyName,
      companyId,
      city: "جزئي",
      type: "عقد مستقل",
      tags: ["كتابة", "تدقيق"],
      postedAt: "منذ أسبوع",
    },
    {
      id: `${companyId}-job4`,
      title: "مهندس بيانات",
      companyName,
      companyId,
      city: "جيزان",
      type: "دوام كامل",
      tags: ["SQL", "Python"],
      postedAt: "منذ أسبوعين",
    },
  ];
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = getCompany(id);
  if (!company) notFound();

  const openJobs = (company.jobs ?? sampleJobsFor(company.id, company.name)).slice(
    0,
    Math.max(company.openings, 1)
  );

  const waHref = whatsappLink(
    company.whatsapp ?? site.whatsapp,
    `مرحباً ${company.name}، تواصلت معكم عبر منصة أبطال جازان`
  );

  const stats: { label: string; value: string; Icon: (p: { className?: string }) => React.ReactNode }[] = [
    { label: "فرص مفتوحة", value: String(company.openings), Icon: BriefcaseIcon },
    { label: "المجال", value: company.field, Icon: BuildingIcon },
    { label: "الموقع", value: company.city ?? "جازان", Icon: MapPinIcon },
    { label: "التوثيق", value: company.verified ? "موثّقة" : "غير موثّقة", Icon: CheckIcon },
  ];

  return (
    <Container className="py-8 sm:py-10 lg:py-12">
      {/* العودة للتصفّح */}
      <Link
        href="/companies"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted no-underline transition-colors hover:text-jazan"
      >
        <ArrowLeftIcon className="h-[18px] w-[18px]" />
        تصفّح الشركات
      </Link>

      {/* بطاقة الهوية المؤسسية */}
      <div className="mt-5 overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_1px_2px_rgba(28,42,38,.04)]">
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
                label="شعار"
                className="-mt-10 h-[88px] w-[88px] flex-none border-[3px] border-white bg-white shadow-[0_6px_18px_rgba(28,42,38,.12)] sm:-mt-12 sm:h-[100px] sm:w-[100px]"
              />
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-[22px] font-extrabold tracking-[-.4px] text-charcoal sm:text-[26px]">
                    {company.name}
                  </h1>
                  {company.verified ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-info/12 px-3 py-[5px] text-xs font-bold text-info-ink">
                      <CheckIcon className="h-[13px] w-[13px]" strokeWidth={2.6} />
                      موثّقة
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
              تواصل مع الشركة
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
          <section className="rounded-[18px] border border-line bg-white p-6">
            <h2 className="text-[17px] font-bold text-charcoal">عن الشركة</h2>
            <p className="mt-3 text-[15px] leading-[1.9] text-ink">
              {company.about ??
                "جهة محلية في منطقة جازان تبحث عن مواهب المنطقة لبناء فريق قوي ومواكبة النمو."}
            </p>
          </section>

          {/* الفرص المتاحة */}
          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-charcoal">
              الفرص المتاحة{" "}
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
          <div className="rounded-[18px] border border-line bg-white p-5 shadow-[0_1px_2px_rgba(28,42,38,.04)]">
            <h3 className="text-base font-bold text-charcoal">بيئة العمل</h3>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <ImagePlaceholder key={i} shape="rounded" radius={12} className="aspect-square w-full" />
              ))}
            </div>
          </div>

          {/* التواصل */}
          <div className="rounded-[18px] border border-line bg-white p-5 shadow-[0_1px_2px_rgba(28,42,38,.04)]">
            <h3 className="text-base font-bold text-charcoal">تواصل معنا</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              مهتم بالانضمام إلى {company.name}؟ تواصل مباشرة عبر واتساب أو تقدّم
              على إحدى الفرص.
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-whatsapp px-4 py-3 text-[15px] font-semibold text-white no-underline shadow-[0_6px_16px_rgba(37,211,102,.28)] transition-[filter] hover:brightness-95"
              >
                <WhatsappIcon className="h-[18px] w-[18px]" />
                واتساب
              </a>
              <Link
                href="/companies"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-[1.5px] border-line bg-white px-4 py-3 text-[15px] font-semibold text-charcoal no-underline transition-colors hover:border-jazan"
              >
                <BriefcaseIcon className="h-[18px] w-[18px] text-muted" />
                تصفّح شركات أخرى
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}
