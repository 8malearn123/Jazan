"use client";

import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";
import { useLocale } from "@/lib/i18n";

export function TermsView() {
  const { d } = useLocale();
  const t = d.termsPage;

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-[13px] font-bold tracking-wide text-amber">{t.kicker}</div>
        <h1 className="mt-2.5 text-[28px] font-extrabold tracking-[-.5px] text-charcoal sm:text-[36px]">
          {t.title}
        </h1>
        <p className="mt-3 text-[15px] text-muted">{t.updated} {site.year}</p>

        <div className="mt-8 flex flex-col gap-7">
          {t.sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-[19px] font-bold text-charcoal">
                {i + 1}. {s.title}
              </h2>
              <p className="mt-2 text-[15px] leading-9 text-ink">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </Container>
  );
}
