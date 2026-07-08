import type { Job } from "@/lib/types";
import { WhatsappIcon, BriefcaseIcon, ClockIcon } from "@/components/icons";
import { whatsappLink, site } from "@/lib/site";

/** لون شارة نوع الفرصة */
function typeBadgeClass(type?: string) {
  switch (type) {
    case "عن بُعد":
      return "bg-info/12 text-info-ink";
    case "عقد مستقل":
    case "دوام جزئي":
      return "bg-amber/15 text-amber-dark";
    default:
      return "bg-jazan/10 text-jazan";
  }
}

/** بطاقة فرصة ضمن صفحة الشركة — مطابقة لـ company.html (قائمة الفرص) */
export function CompanyJobCard({
  job,
  companyName,
  companyWhatsapp,
}: {
  job: Job;
  companyName: string;
  companyWhatsapp?: string;
}) {
  const { title, city, type, tags, postedAt, salary } = job;
  const waHref = whatsappLink(
    companyWhatsapp ?? site.whatsapp,
    `مرحباً ${companyName}، أرغب بالتقديم على وظيفة ${title}`
  );

  return (
    <div className="rounded-[18px] border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(28,42,38,.04)] transition-[transform,box-shadow,border-color] duration-[250ms] hover:-translate-y-0.5 hover:border-jazan hover:shadow-[0_12px_30px_rgba(28,42,38,.1)]">
      <div className="flex items-start gap-4">
        <span className="flex h-[50px] w-[50px] flex-none items-center justify-center rounded-[13px] bg-jazan/10 text-jazan">
          <BriefcaseIcon className="h-6 w-6" />
        </span>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-[17px] font-bold text-charcoal sm:text-[18px]">
              {title}
            </h3>
            {type ? (
              <span
                className={`rounded-[7px] px-2.5 py-[3px] text-xs font-semibold ${typeBadgeClass(type)}`}
              >
                {type}
              </span>
            ) : null}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
            <span>{city}</span>
            {salary ? (
              <span className="mono font-semibold text-jazan">{salary}</span>
            ) : null}
            {postedAt ? (
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon className="h-[15px] w-[15px]" />
                <span className="mono">{postedAt}</span>
              </span>
            ) : null}
          </div>

          {tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[7px] bg-tag px-2.5 py-1 text-[12px] text-ink"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* الإجراءات */}
      <div className="mt-4 flex flex-wrap gap-2.5">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[11px] bg-jazan px-5 py-2.5 text-sm font-semibold text-white no-underline shadow-[0_6px_16px_rgba(15,92,74,.22)] transition-[transform,background] duration-150 hover:-translate-y-px hover:bg-jazan-dark"
        >
          تقديم
        </a>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-[11px] bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white no-underline transition-[filter] hover:brightness-95"
        >
          <WhatsappIcon className="h-[17px] w-[17px]" />
          استفسار عبر واتساب
        </a>
      </div>
    </div>
  );
}
