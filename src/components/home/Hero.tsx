import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Button } from "@/components/ui/Button";
import { SearchIcon, CheckIcon } from "@/components/icons";
import { site } from "@/lib/site";
import { heroStats } from "@/lib/stats";

export function Hero() {
  return (
    <section className="py-10 sm:py-14 lg:py-16">
      <Container className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-12">
        {/* Text side */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-xs font-semibold text-jazan sm:text-[13px]">
            <span className="h-[7px] w-[7px] rounded-full bg-success" />
            {site.tagline}
          </div>

          <h1 className="mt-5 text-[30px] font-extrabold leading-[1.15] tracking-[-.6px] text-charcoal text-balance sm:mt-6 sm:text-[40px] sm:leading-[1.12] lg:text-[46px] lg:tracking-[-1px] xl:text-[54px]">
            مواهب جازان
            <br />
            تلتقي بالفرص الحقيقية
          </h1>

          <p className="mt-4 max-w-[480px] text-base leading-7 text-muted sm:mt-5 sm:text-[17px] sm:leading-8 lg:text-[18px]">
            منصة محلية تربط المستقلين والباحثين عن عمل، والأسر المنتجة والصُنّاع،
            بالشركات والجهات — تواصل مباشر بضغطة زر.
          </p>

          {/* Search */}
          <form
            action="/browse"
            className="mt-6 flex max-w-[520px] items-center gap-2 rounded-2xl border-[1.5px] border-line bg-white p-[6px] ps-3.5 shadow-[0_6px_22px_rgba(28,42,38,.06)] sm:mt-7 sm:gap-3 sm:p-[7px] sm:ps-4"
          >
            <SearchIcon width={20} height={20} className="shrink-0 text-muted" />
            <input
              name="q"
              placeholder="ابحث عن مطوّر، مصمّم، أسرة منتجة…"
              className="min-w-0 flex-1 bg-transparent text-sm text-charcoal outline-none placeholder:text-[#9aa29d] sm:text-base"
            />
            <Button type="submit" size="sm">
              بحث
            </Button>
          </form>

          {/* Stats */}
          <div className="mt-6 flex items-center gap-4 sm:mt-7 sm:gap-6">
            {heroStats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-4 sm:gap-6">
                {i > 0 ? <span className="h-[30px] w-px bg-line sm:h-[34px]" /> : null}
                <div>
                  <div className="mono text-xl font-semibold text-jazan sm:text-2xl">
                    {s.value}
                  </div>
                  <div className="text-xs text-muted sm:text-[13px]">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual side */}
        <div className="relative">
          <ImagePlaceholder
            label="صورة الهيرو — مواهب جازان"
            radius={24}
            className="h-[230px] w-full sm:h-[340px] lg:h-[420px]"
          />

          <div className="jh-float absolute -bottom-4 -start-2 flex items-center gap-3 rounded-2xl border border-line bg-white p-3 px-4 shadow-[0_12px_30px_rgba(28,42,38,.12)] sm:-start-3 sm:p-3.5 sm:px-[18px]">
            <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-success/15 sm:h-10 sm:w-10">
              <CheckIcon width={20} height={20} className="text-success" strokeWidth={2.2} />
            </span>
            <div>
              <div className="text-[13px] font-bold text-charcoal sm:text-sm">
                تم التواصل بنجاح
              </div>
              <div className="text-[11px] text-muted sm:text-xs">عبر واتساب · قبل دقيقة</div>
            </div>
          </div>

          <div className="jh-float-slow absolute -top-4 -end-2 rounded-2xl border border-line bg-white px-3.5 py-2.5 shadow-[0_10px_26px_rgba(28,42,38,.10)] sm:-end-3 sm:px-4 sm:py-3">
            <div className="text-[11px] text-muted sm:text-xs">تخصصات متاحة</div>
            <div className="text-sm font-bold text-jazan sm:text-[15px]">
              برمجة · تصميم · حِرف
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
