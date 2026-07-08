import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function CtaStrip() {
  return (
    <section className="pb-16">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 rounded-[22px] border border-line bg-surface p-8 shadow-[0_8px_28px_rgba(28,42,38,.06)] sm:flex-row sm:items-center sm:p-11">
          <div>
            <h2 className="text-[26px] font-extrabold tracking-[-.4px] text-charcoal sm:text-[30px]">
              جاهز تكون من أبطال جازان؟
            </h2>
            <p className="mt-2.5 text-[17px] text-muted">
              سجّل مجاناً وابنِ صفحتك خلال دقائق.
            </p>
          </div>
          <Button href="/register" variant="amber" size="lg" className="w-full whitespace-nowrap sm:w-auto">
            انضم كبطل الآن
          </Button>
        </div>
      </Container>
    </section>
  );
}
