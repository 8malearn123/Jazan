import Link from "next/link";
import type { Producer } from "@/lib/types";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { CheckIcon } from "@/components/icons";
import { whatsappLink, site } from "@/lib/site";

/** بطاقة أسرة منتجة / صانع — مطابقة لإطار التصفّح في التصميم */
export function ProducerCard({ producer }: { producer: Producer }) {
  const { id, name, category, city, bio, verified } = producer;

  return (
    <article className="group overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_1px_2px_rgba(28,42,38,.04)] transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(28,42,38,.12)]">
      {/* الغلاف */}
      <ImagePlaceholder shape="rect" className="h-[140px] w-full" />

      <div className="p-[18px]">
        {/* الشعار + فئة النشاط */}
        <div className="flex items-start justify-between">
          <ImagePlaceholder
            shape="rounded"
            radius={12}
            label="شعار"
            className="-mt-[46px] h-[50px] w-[50px] border-[3px] border-white"
          />
          <span className="rounded-lg bg-amber/15 px-2.5 py-1 text-xs font-semibold text-amber-dark">
            {category}
          </span>
        </div>

        {/* الاسم + التحقّق */}
        <div className="mt-3 flex items-center gap-2">
          <h3 className="text-[17px] font-bold text-charcoal">{name}</h3>
          {verified ? (
            <span
              title="موثّق"
              className="inline-flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full bg-success text-success-ink"
            >
              <CheckIcon className="h-3 w-3" strokeWidth={3} />
            </span>
          ) : null}
        </div>

        {/* الفئة · المدينة */}
        <div className="mt-[3px] text-[13px] text-muted">
          {bio ?? category} · {city}
        </div>

        {/* الإجراءات */}
        <div className="mt-4 flex gap-2">
          <Link
            href={`/producers/${id}`}
            className="flex-1 rounded-[11px] border-[1.5px] border-jazan bg-white px-3 py-2.5 text-center text-[13px] font-semibold text-jazan no-underline transition-colors hover:bg-jazan/5"
          >
            عرض المتجر
          </Link>
          <a
            href={whatsappLink(
              producer.whatsapp ?? site.whatsapp,
              `مرحباً، أرغب بالطلب من ${name}`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[11px] bg-whatsapp px-3.5 py-2.5 text-[13px] font-semibold text-white no-underline transition-[filter] hover:brightness-95"
          >
            اطلب
          </a>
        </div>
      </div>
    </article>
  );
}
