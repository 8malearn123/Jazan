import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Button } from "@/components/ui/Button";
import { sponsors } from "@/lib/data";

export function Sponsors() {
  return (
    <section className="pb-16">
      <Container>
        <div className="rounded-[22px] border border-line bg-white px-6 py-9 shadow-[0_1px_2px_rgba(28,42,38,.04)] sm:px-10">
          <div className="text-center">
            <div className="text-[13px] font-bold tracking-wide text-amber">الرعاة</div>
            <h2 className="mt-2 text-[24px] font-extrabold tracking-[-.4px] text-charcoal sm:text-[26px]">
              بدعمٍ من رعاة مبادرة أبطال جازان
            </h2>
            <p className="mt-1.5 text-[15px] text-muted">
              جهات ساهمت في رعاية المنصة ودعمها تسويقياً لتمكين مواهب المنطقة.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 items-center gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {sponsors.map((s) => (
              <ImagePlaceholder
                key={s.id}
                label="شعار راعٍ"
                radius={12}
                className="h-[74px] w-full border border-line"
              />
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button href="/sponsor" variant="ghost">
              كن راعياً للمنصة
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
