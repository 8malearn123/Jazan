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

          <div className="mt-7 grid grid-cols-2 items-center gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {sponsors.map((s) => {
              const logo = s.logo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={s.logo}
                  alt={s.name}
                  className="h-full w-full object-contain p-2"
                  title={s.name}
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center px-2 text-center text-[13px] font-bold text-muted">
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
                  className="h-[74px] w-full overflow-hidden rounded-[12px] border border-line bg-cream/50 transition-colors hover:border-jazan"
                >
                  {logo}
                </a>
              ) : (
                <div
                  key={s.id}
                  className="h-[74px] w-full overflow-hidden rounded-[12px] border border-line bg-cream/50"
                >
                  {logo}
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <Button href="/sponsor" variant="ghost">
              {d.sponsors.become}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
