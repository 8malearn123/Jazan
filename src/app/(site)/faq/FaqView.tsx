"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n";

export function FaqView() {
  const { d } = useLocale();
  const t = d.faqPage;

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-[13px] font-bold tracking-wide text-amber">{t.kicker}</div>
        <h1 className="mt-2.5 text-[28px] font-extrabold tracking-[-.5px] text-charcoal sm:text-[36px]">
          {t.title}
        </h1>
        <p className="mt-3 text-[16px] leading-8 text-muted">{t.desc}</p>
      </div>

      <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3">
        {t.items.map((f, i) => (
          <details
            key={i}
            className="group rounded-[16px] border border-line bg-surface px-5 py-4 shadow-[0_1px_2px_rgba(28,42,38,.04)] open:border-jazan/40"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[16px] font-bold text-charcoal">
              {f.q}
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-jazan/8 text-jazan transition-transform group-open:rotate-45">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </summary>
            <p className="mt-3 text-[15px] leading-8 text-ink">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-2xl rounded-[20px] border border-line bg-surface p-8 text-center shadow-[0_1px_2px_rgba(28,42,38,.04)]">
        <h2 className="text-[20px] font-extrabold text-charcoal">{t.moreTitle}</h2>
        <p className="mt-2 text-[15px] text-muted">{t.moreDesc}</p>
        <div className="mt-5">
          <Button href="/contact" variant="primary">
            {t.contact}
          </Button>
        </div>
      </div>
    </Container>
  );
}
