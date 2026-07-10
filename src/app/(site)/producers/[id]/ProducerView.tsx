"use client";

import { Button } from "@/components/ui/Button";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import {
  CheckIcon,
  StoreIcon,
  WhatsappIcon,
  MapPinIcon,
  StarFilledIcon,
} from "@/components/icons";
import { whatsappLink, site } from "@/lib/site";
import { useLocale } from "@/lib/i18n";
import type { Producer } from "@/lib/types";

/** محتوى صفحة الأسرة المنتجة — مكوّن عميل ليدعم تبديل اللغة */
export function ProducerView({ producer }: { producer: Producer }) {
  const { d } = useLocale();
  const { name, category, city, bio, verified, rating, reviewsCount } = producer;
  const phone = producer.whatsapp ?? site.whatsapp;
  const products = producer.products ?? [];
  const t = d.producerDetail;

  return (
    <div className="mt-5 overflow-hidden rounded-[18px] border border-line bg-surface shadow-[0_1px_2px_rgba(28,42,38,.04)]">
      {/* الغلاف */}
      <div className="relative">
        <ImagePlaceholder
          shape="rect"
          label={t.coverLabel}
          className="h-[200px] w-full sm:h-[230px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/5" />
        <div className="absolute inset-x-5 bottom-5 flex items-end gap-4 sm:inset-x-8">
          <ImagePlaceholder
            shape="rounded"
            radius={18}
            label={t.logoLabel}
            className="h-[76px] w-[76px] flex-none border-4 border-surface shadow-[0_8px_22px_rgba(0,0,0,.25)] sm:h-[92px] sm:w-[92px]"
          />
          <div className="pb-1">
            <div className="flex items-center gap-2">
              <h1 className="text-[24px] font-extrabold tracking-[-.4px] text-white sm:text-[30px]">
                {name}
              </h1>
              {verified ? (
                <span
                  title={t.verified}
                  className="inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-success text-success-ink"
                >
                  <CheckIcon className="h-3 w-3" strokeWidth={3} />
                </span>
              ) : null}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/90 px-3 py-1 text-[13px] font-semibold text-white">
                <StoreIcon className="h-3.5 w-3.5" />
                {d.prodCat[category] ?? category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-white/90">
                <MapPinIcon className="h-4 w-4" />
                {city}
              </span>
              {rating ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[13px] font-semibold text-white">
                  <StarFilledIcon className="h-3.5 w-3.5 text-amber" />
                  <span className="mono">{rating.toFixed(1)}</span>
                  {reviewsCount ? (
                    <span className="text-white/70">
                      ({reviewsCount} {t.reviewsSuffix})
                    </span>
                  ) : null}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-8">
        {/* شريط معلومات المتجر */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: t.category, value: d.prodCat[category] ?? category, Icon: StoreIcon },
            { label: t.city, value: city, Icon: MapPinIcon },
            { label: t.products, value: String(products.length), Icon: StoreIcon },
            { label: t.verification, value: verified ? t.verified : t.notVerified, Icon: CheckIcon },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 rounded-[14px] border border-line bg-cream/50 p-3.5">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-amber/15 text-amber-dark">
                <s.Icon className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0">
                <div className="truncate text-[14px] font-bold text-charcoal">{s.value}</div>
                <div className="text-[12px] text-muted">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* المقدّمة + الطلب */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-[560px] text-[15px] leading-8 text-ink sm:text-base">
            {bio}
          </p>
          <a
            href={whatsappLink(phone, `مرحباً، أرغب بالطلب من ${name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-6 py-3 text-[15px] font-semibold text-white no-underline shadow-[0_6px_16px_rgba(37,211,102,.28)] transition-[filter] hover:brightness-95"
          >
            <WhatsappIcon className="h-[19px] w-[19px]" />
            {t.orderWa}
          </a>
        </div>

        {/* قائمة المنتجات */}
        <h2 className="mt-[34px] mb-[18px] text-xl font-bold text-charcoal">
          {t.productList}{" "}
          <span className="font-medium text-muted">
            (<span className="mono">{products.length}</span>)
          </span>
        </h2>
        {products.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-line bg-cream/40 py-14 text-center">
            <p className="text-[15px] font-semibold text-charcoal">{t.emptyTitle}</p>
            <p className="mt-1 text-[13px] text-muted">
              {t.emptyPrefix}
              {name}
              {t.emptySuffix}
            </p>
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="flex flex-col overflow-hidden rounded-[18px] border border-line bg-surface shadow-[0_1px_2px_rgba(28,42,38,.04)] transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(28,42,38,.12)]"
            >
              <ImagePlaceholder
                shape="rect"
                label={t.productImg}
                className="h-[150px] w-full sm:h-[160px]"
              />
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-[15px] font-bold text-charcoal sm:text-base">
                  {product.name}
                </h3>
                <span className="mono mt-2 text-[17px] font-semibold text-jazan sm:text-lg">
                  {product.price}{" "}
                  <span className="text-[13px] text-muted">{t.sar}</span>
                </span>
                <a
                  href={whatsappLink(
                    phone,
                    `مرحباً، أرغب بطلب: ${product.name} من ${name}`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-3 py-2.5 text-[13px] font-semibold text-white no-underline transition-[filter] hover:brightness-95"
                >
                  <WhatsappIcon className="h-[16px] w-[16px]" />
                  {t.order}
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* قسم التواصل */}
        <div className="mt-10 flex flex-col items-center gap-5 rounded-[18px] border border-line bg-cream px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-start">
          <div>
            <h2 className="text-lg font-bold text-charcoal">
              {t.readyPrefix}
              {name}
              {t.readySuffix}
            </h2>
            <p className="mt-1.5 text-sm text-muted">{t.readyDesc}</p>
          </div>
          <a
            href={whatsappLink(phone, `مرحباً، أرغب بالطلب من ${name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-none"
          >
            <Button variant="whatsapp" size="lg" className="pointer-events-none">
              <WhatsappIcon className="h-5 w-5" />
              {t.contactWa}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
