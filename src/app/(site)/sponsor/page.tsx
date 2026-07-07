import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhatsappIcon, UsersIcon, StarIcon, CheckIcon } from "@/components/icons";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "كن راعياً",
  description: "ادعم مواهب جازان وكن راعياً لمنصة أبطال جازان.",
};

const benefits = [
  {
    Icon: UsersIcon,
    title: "وصول لمجتمع محلي",
    desc: "علامتك التجارية أمام مئات المواهب والأسر والشركات في منطقة جازان.",
  },
  {
    Icon: StarIcon,
    title: "ظهور مميّز",
    desc: "شعارك في قسم الرعاة على الصفحة الرئيسية وصفحات المنصة.",
  },
  {
    Icon: CheckIcon,
    title: "أثر مجتمعي",
    desc: "مساهمتك تُمكّن مواهب المنطقة وتدعم الاقتصاد المحلي.",
  },
];

const tiers = [
  {
    name: "فضي",
    features: ["شعار في قسم الرعاة", "إشارة في وسائل التواصل"],
    highlight: false,
  },
  {
    name: "ذهبي",
    features: ["كل مزايا الفضي", "ظهور مميّز في الصفحة الرئيسية", "تقرير وصول شهري"],
    highlight: true,
  },
  {
    name: "بلاتيني",
    features: ["كل مزايا الذهبي", "حملة تعريفية مخصّصة", "شراكة محتوى حصرية"],
    highlight: false,
  },
];

export default function SponsorPage() {
  const wa = whatsappLink(site.whatsapp, "السلام عليكم، أرغب في رعاية منصة أبطال جازان");

  return (
    <>
      {/* Hero */}
      <section className="bg-jazan py-16">
        <Container className="text-center">
          <div className="text-[13px] font-bold tracking-wide text-amber">برنامج الرعاية</div>
          <h1 className="mx-auto mt-3 max-w-2xl text-[30px] font-extrabold leading-[1.15] tracking-[-.6px] text-white sm:text-[42px]">
            كن جزءاً من تمكين مواهب جازان
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-8 text-white/75 sm:text-[18px]">
            انضم لرعاة مبادرة أبطال جازان وادعم المستقلين والأسر المنتجة والشركات المحلية.
          </p>
          <div className="mt-7 flex justify-center">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-[13px] bg-whatsapp px-7 py-3.5 text-[16px] font-bold text-white shadow-[0_8px_20px_rgba(37,211,102,.32)] transition hover:brightness-95"
            >
              <WhatsappIcon width={20} height={20} />
              تواصل لرعاية المنصة
            </a>
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-14 sm:py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[24px] font-extrabold tracking-[-.5px] text-charcoal sm:text-[30px]">
              لماذا ترعى أبطال جازان؟
            </h2>
          </div>
          <div className="mt-9 grid gap-4 sm:gap-5 md:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-[18px] border border-line bg-white p-7 shadow-[0_1px_2px_rgba(28,42,38,.04)]"
              >
                <span className="flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-jazan/10 text-jazan">
                  <b.Icon width={26} height={26} />
                </span>
                <h3 className="mt-[18px] text-xl font-bold text-charcoal">{b.title}</h3>
                <p className="mt-2 text-[15px] leading-7 text-muted">{b.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Tiers */}
      <section className="pb-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[24px] font-extrabold tracking-[-.5px] text-charcoal sm:text-[30px]">
              باقات الرعاية
            </h2>
            <p className="mt-2 text-[15px] text-muted">اختر الباقة الأنسب لجهتك — وتواصل معنا للتفاصيل.</p>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`flex flex-col rounded-[20px] border bg-white p-7 ${
                  t.highlight
                    ? "border-jazan shadow-[0_14px_34px_rgba(15,92,74,.14)]"
                    : "border-line shadow-[0_1px_2px_rgba(28,42,38,.04)]"
                }`}
              >
                {t.highlight ? (
                  <span className="mb-3 inline-flex w-fit rounded-full bg-amber/15 px-3 py-1 text-xs font-bold text-amber-dark">
                    الأكثر اختياراً
                  </span>
                ) : null}
                <h3 className="text-[22px] font-extrabold text-charcoal">{t.name}</h3>
                <ul className="mt-5 flex flex-1 flex-col gap-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[15px] text-ink">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                        <CheckIcon width={13} height={13} strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <Button
                    href={wa}
                    variant={t.highlight ? "primary" : "ghost"}
                    className="w-full"
                  >
                    اختر {t.name}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
