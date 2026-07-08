import Link from "next/link";
import type { Job } from "@/lib/types";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

/** لون شارة نوع الفرصة حسب النوع */
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

/** صف وظيفة في قائمة "أحدث الوظائف" — مطابق لإطار التصفّح في browse.html */
export function JobRow({ job }: { job: Job }) {
  const { title, companyName, companyId, city, type, tags, salary } = job;
  const tagsLabel = tags?.length ? tags.join(" · ") : null;

  return (
    <div className="flex flex-col gap-4 rounded-[18px] border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(28,42,38,.04)] transition-[transform,box-shadow,border-color] duration-[250ms] hover:-translate-y-0.5 hover:border-jazan hover:shadow-[0_12px_30px_rgba(28,42,38,.1)] sm:flex-row sm:items-center sm:gap-[18px] sm:py-5 sm:ps-6">
      <ImagePlaceholder
        shape="rounded"
        radius={14}
        className="hidden h-[54px] w-[54px] flex-none border border-line sm:flex"
      />

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="text-[17px] font-bold text-charcoal">{title}</h3>
          {type ? (
            <span
              className={`rounded-[7px] px-2.5 py-[3px] text-xs font-semibold ${typeBadgeClass(type)}`}
            >
              {type}
            </span>
          ) : null}
        </div>
        <div className="mt-[7px] flex flex-wrap items-center gap-x-3.5 gap-y-1 text-sm text-muted">
          <span className="font-semibold text-ink">{companyName}</span>
          <span aria-hidden>·</span>
          <span>{city}</span>
          {salary ? (
            <>
              <span aria-hidden>·</span>
              <span className="mono font-semibold text-jazan">{salary}</span>
            </>
          ) : null}
          {tagsLabel ? (
            <>
              <span aria-hidden>·</span>
              <span>{tagsLabel}</span>
            </>
          ) : null}
        </div>
      </div>

      <Link
        href={companyId ? `/companies/${companyId}` : "/companies"}
        className="shrink-0 rounded-[11px] bg-jazan px-5 py-2.5 text-center text-sm font-semibold text-white no-underline shadow-[0_6px_16px_rgba(15,92,74,.22)] transition-[transform,background] duration-150 hover:-translate-y-px hover:bg-jazan-dark"
      >
        تقدّم
      </Link>
    </div>
  );
}
