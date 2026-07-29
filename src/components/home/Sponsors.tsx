"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useSponsors } from "@/lib/sponsors";
import { useLocale } from "@/lib/i18n";

export function Sponsors() {
  const { d } = useLocale();
  const sponsors = useSponsors();
  if (sponsors.length === 0) return null;

  return (
    <section className="pb-16">
      <Container>
        <div className="rounded-[22px] border border-line bg-surface px-6 py-9 shadow-[0_1px_2px_rgba(28,42,38,.04)] sm:px-10">
          <div className="text-center">
            <div className="text-[13px] font-bold tracking-wide text-amber">{d.sponsors.kicker}</div>
            <h2 className="mt-2 text-[24px] font-extrabold tracking-[-.4px] text-charcoal sm:text-[26px]">
              {d.sponsors.title}
            </h2>
            <p className="mt-1.5 text-[15px] text-muted">
              {d.sponsors.desc}
            </p>
          </div>

          {/* توسيط مرن: يبقى متّزناً مع راعٍ واحد أو عشرة */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {sponsors.map((s) => {
              // الإطار يتشكّل حسب نسبة الشعار: ارتفاع ثابت وعرض تلقائي،
              // فلا تبقى شرائح فارغة مع الشعارات المربّعة ولا يُقصّ العريض
              const tile = [
                "flex h-[96px] items-center justify-center overflow-hidden rounded-[14px]",
                "border border-line bg-cream transition-[border-color,box-shadow,transform]",
                s.logo ? "w-auto min-w-[96px] max-w-[240px]" : "w-[170px]",
              ].join(" ");
              const inner = s.logo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={s.logo}
                  alt={s.name}
                  title={s.name}
                  className="h-full w-auto max-w-[240px] object-contain"
                />
              ) : (
                <span className="line-clamp-2 px-3 text-center text-[14px] font-bold leading-snug text-charcoal">
                  {s.name}
                </span>
              );
              return s.website ? (
                <a
                  key={s.id}
                  href={s.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className={`${tile} hover:-translate-y-0.5 hover:border-jazan/50 hover:shadow-[0_10px_26px_rgba(28,42,38,.08)]`}
                >
                  {inner}
                </a>
              ) : (
                <div key={s.id} className={tile}>
                  {inner}
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <Button href="/contact?topic=sponsor" variant="ghost">
              {d.sponsors.become}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
