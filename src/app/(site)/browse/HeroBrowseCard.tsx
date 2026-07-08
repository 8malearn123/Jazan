import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { WhatsappIcon, StarFilledIcon } from "@/components/icons";
import { whatsappLink, site } from "@/lib/site";
import { cn } from "@/lib/cn";
import type { Hero, AvailabilityStatus } from "@/lib/types";

/** شارة التوفّر المُصغّرة المعروضة فوق الغلاف */
const overlayPill: Record<
  AvailabilityStatus,
  { label: string; dot: string; text: string }
> = {
  freelance: { label: "عمل حر", dot: "bg-success", text: "text-success-ink" },
  job: { label: "يبحث عن وظيفة", dot: "bg-info", text: "text-info-ink" },
  both: { label: "للاثنين", dot: "bg-amber", text: "text-warn-ink" },
  producer: { label: "أسرة منتجة", dot: "bg-amber", text: "text-warn-ink" },
};

/** بطاقة بطل في شبكة التصفّح — مطابقة لـ browse.html (FRAME 1) */
export function HeroBrowseCard({ hero }: { hero: Hero }) {
  const pill = overlayPill[hero.status];
  const shownSkills = hero.skills.slice(0, 2);
  const extraCount = hero.skills.length - shownSkills.length;

  return (
    <div className="flex flex-col overflow-hidden rounded-[18px] border border-line bg-surface shadow-[0_1px_2px_rgba(28,42,38,.04)] transition-[transform,box-shadow,border-color] duration-[250ms] hover:-translate-y-1 hover:border-jazan hover:shadow-[0_14px_34px_rgba(28,42,38,.12)]">
      {/* الغلاف + شارة التوفّر */}
      <div className="relative">
        <ImagePlaceholder shape="rect" className="h-[84px] w-full" />
        <span
          className={cn(
            "absolute top-2.5 start-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold shadow-[0_2px_6px_rgba(28,42,38,.1)]",
            pill.text
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", pill.dot)} />
          {pill.label}
        </span>
      </div>

      {/* الجسم */}
      <div className="flex flex-1 flex-col p-4">
        <ImagePlaceholder
          shape="circle"
          className="-mt-11 h-14 w-14 border-[3px] border-surface shadow-[0_4px_12px_rgba(28,42,38,.1)]"
        />
        <div className="mt-[11px] flex items-center justify-between gap-2">
          <h3 className="text-base font-bold text-charcoal">{hero.name}</h3>
          {hero.rating ? (
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-charcoal">
              <StarFilledIcon className="h-3.5 w-3.5 text-amber" />
              <span className="mono">{hero.rating.toFixed(1)}</span>
            </span>
          ) : null}
        </div>
        <div className="mt-0.5 text-[13px] text-muted">
          {hero.title} · {hero.city}
        </div>

        {/* المهارات */}
        <div className="mt-[11px] flex flex-wrap gap-1.5">
          {shownSkills.map((skill) => (
            <span
              key={skill}
              className="rounded-[7px] bg-tag px-2.5 py-1 text-[11px] text-ink"
            >
              {skill}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="rounded-[7px] bg-tag px-2.5 py-1 text-[11px] text-muted">
              +{extraCount}
            </span>
          )}
        </div>

        {/* الأزرار */}
        <div className="mt-auto flex gap-2 pt-3.5">
          <Link
            href={`/heroes/${hero.id}`}
            className="flex-1 rounded-[10px] border-[1.5px] border-jazan bg-surface px-3 py-[9px] text-center text-[13px] font-semibold text-jazan no-underline transition-colors hover:bg-jazan hover:text-white"
          >
            عرض الملف
          </Link>
          <a
            href={whatsappLink(hero.whatsapp ?? site.whatsapp, `مرحباً ${hero.name}، شفت ملفك في أبطال جازان`)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`تواصل مع ${hero.name} عبر واتساب`}
            className="inline-flex items-center justify-center rounded-[10px] bg-whatsapp px-3 py-[9px] text-white transition-[filter] hover:brightness-95"
          >
            <WhatsappIcon className="h-[17px] w-[17px]" />
          </a>
        </div>
      </div>
    </div>
  );
}
