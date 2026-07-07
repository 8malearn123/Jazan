import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import {
  CheckIcon,
  StoreIcon,
  WhatsappIcon,
  ArrowLeftIcon,
} from "@/components/icons";
import { producers, getProducer } from "@/lib/data";
import type { Product } from "@/lib/types";
import { whatsappLink, site } from "@/lib/site";

export function generateStaticParams() {
  return producers.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const producer = getProducer(id);
  if (!producer) return { title: "غير موجود — أبطال جازان" };
  return {
    title: `${producer.name} — أبطال جازان`,
    description: producer.bio ?? `${producer.category} · ${producer.city}`,
  };
}

/** أيقونة دبوس الموقع */
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

/** منتجات تجريبية للعرض — تُستبدل ببيانات حقيقية لاحقاً */
const sampleProducts: Product[] = [
  { id: "p1", name: "معصوب بالموز والعسل", price: 28, category: "طعام" },
  { id: "p2", name: "مرسة جمبري", price: 45, category: "طعام" },
  { id: "p3", name: "عريكة بالعسل البلدي", price: 35, category: "طعام" },
  { id: "p4", name: "مديد الحلبة", price: 22, category: "طعام" },
  { id: "p5", name: "رز كبسة دجاج", price: 40, category: "طعام" },
  { id: "p6", name: "حنيذ لحم بلدي", price: 75, category: "طعام" },
];

export default async function ProducerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const producer = getProducer(id);
  if (!producer) notFound();

  const { name, category, city, bio, verified } = producer;
  const phone = producer.whatsapp ?? site.whatsapp;
  const products = producer.products?.length ? producer.products : sampleProducts;

  return (
    <Container className="py-8 sm:py-10">
      {/* العودة للتصفّح */}
      <Link
        href="/producers"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted no-underline transition-colors hover:text-charcoal"
      >
        <ArrowLeftIcon className="h-[18px] w-[18px]" />
        تصفّح الأسر المنتجة
      </Link>

      <div className="mt-5 overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_1px_2px_rgba(28,42,38,.04)]">
        {/* الغلاف */}
        <div className="relative">
          <ImagePlaceholder
            shape="rect"
            label="صورة غلاف النشاط"
            className="h-[200px] w-full sm:h-[230px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-charcoal/5" />
          <div className="absolute inset-x-5 bottom-5 flex items-end gap-4 sm:inset-x-8">
            <ImagePlaceholder
              shape="rounded"
              radius={18}
              label="شعار"
              className="h-[76px] w-[76px] flex-none border-4 border-white shadow-[0_8px_22px_rgba(0,0,0,.25)] sm:h-[92px] sm:w-[92px]"
            />
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-[24px] font-extrabold tracking-[-.4px] text-white sm:text-[30px]">
                  {name}
                </h1>
                {verified ? (
                  <span
                    title="موثّق"
                    className="inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-success text-success-ink"
                  >
                    <CheckIcon className="h-3 w-3" strokeWidth={3} />
                  </span>
                ) : null}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/90 px-3 py-1 text-[13px] font-semibold text-white">
                  <StoreIcon className="h-3.5 w-3.5" />
                  {category}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-white/90">
                  <MapPinIcon className="h-4 w-4" />
                  {city}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8">
          {/* شريط معلومات المتجر */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "الفئة", value: category, Icon: StoreIcon },
              { label: "المدينة", value: city, Icon: MapPinIcon },
              { label: "المنتجات", value: String(products.length), Icon: StoreIcon },
              { label: "التوثيق", value: verified ? "موثّقة" : "غير موثّقة", Icon: CheckIcon },
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
              {bio ??
                "أكلات منزلية أصيلة محضّرة بحب من جازان. نستقبل الطلبات يومياً عبر واتساب."}
            </p>
            <a
              href={whatsappLink(phone, `مرحباً، أرغب بالطلب من ${name}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-whatsapp px-6 py-3 text-[15px] font-semibold text-white no-underline shadow-[0_6px_16px_rgba(37,211,102,.28)] transition-[filter] hover:brightness-95"
            >
              <WhatsappIcon className="h-[19px] w-[19px]" />
              اطلب عبر واتساب
            </a>
          </div>

          {/* قائمة المنتجات */}
          <h2 className="mt-[34px] mb-[18px] text-xl font-bold text-charcoal">
            قائمة المنتجات{" "}
            <span className="font-medium text-muted">
              (<span className="mono">{products.length}</span>)
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="flex flex-col overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_1px_2px_rgba(28,42,38,.04)] transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(28,42,38,.12)]"
              >
                <ImagePlaceholder
                  shape="rect"
                  label="صورة المنتج"
                  className="h-[150px] w-full sm:h-[160px]"
                />
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-[15px] font-bold text-charcoal sm:text-base">
                    {product.name}
                  </h3>
                  <span className="mono mt-2 text-[17px] font-semibold text-jazan sm:text-lg">
                    {product.price}{" "}
                    <span className="text-[13px] text-muted">ر.س</span>
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
                    اطلب
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* قسم التواصل */}
          <div className="mt-10 flex flex-col items-center gap-5 rounded-[18px] border border-line bg-cream px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-start">
            <div>
              <h2 className="text-lg font-bold text-charcoal">
                جاهز للطلب من {name}؟
              </h2>
              <p className="mt-1.5 text-sm text-muted">
                تواصل مباشرة عبر واتساب لإتمام طلبك أو الاستفسار عن المنتجات.
              </p>
            </div>
            <a
              href={whatsappLink(phone, `مرحباً، أرغب بالطلب من ${name}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-none"
            >
              <Button variant="whatsapp" size="lg" className="pointer-events-none">
                <WhatsappIcon className="h-5 w-5" />
                تواصل عبر واتساب
              </Button>
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
