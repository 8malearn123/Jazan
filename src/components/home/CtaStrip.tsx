"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n";

export function CtaStrip() {
  const { d } = useLocale();

  return (
    <section className="pb-16">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 rounded-[22px] border border-line bg-surface p-8 shadow-[0_8px_28px_rgba(28,42,38,.06)] sm:flex-row sm:items-center sm:p-11">
          <div>
            <h2 className="text-[26px] font-extrabold tracking-[-.4px] text-charcoal sm:text-[30px]">
              {d.cta.title}
            </h2>
            <p className="mt-2.5 text-[17px] text-muted">
              {d.cta.desc}
            </p>
          </div>
          <Button href="/register" variant="amber" size="lg" className="w-full whitespace-nowrap sm:w-auto">
            {d.cta.join}
          </Button>
        </div>
      </Container>
    </section>
  );
}
