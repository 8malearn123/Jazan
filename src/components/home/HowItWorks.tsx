import { Container } from "@/components/ui/Container";
import { UserPlusIcon, GridIcon, WhatsappIcon } from "@/components/icons";

const steps = [
  {
    n: "01",
    title: "أنشئ بروفايلك",
    desc: "سجّل، اختر دورك، وابنِ صفحتك الاحترافية في دقائق.",
    Icon: UserPlusIcon,
    iconWrap: "bg-white/10",
    iconColor: "text-white",
  },
  {
    n: "02",
    title: "اعرض أعمالك",
    desc: "أضف مهاراتك ومنتجاتك ومعرض أعمالك بشكل بصري جذّاب.",
    Icon: GridIcon,
    iconWrap: "bg-white/10",
    iconColor: "text-white",
  },
  {
    n: "03",
    title: "تواصل مباشرة",
    desc: "يصلك العميل أو صاحب العمل عبر واتساب بضغطة زر واحدة.",
    Icon: WhatsappIcon,
    iconWrap: "bg-whatsapp/20",
    iconColor: "text-whatsapp",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-jazan py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-[560px] text-center">
          <div className="text-[13px] font-bold tracking-wide text-amber">كيف تعمل المنصة</div>
          <h2 className="mt-2.5 text-[24px] font-extrabold tracking-[-.5px] text-white sm:text-[28px] lg:text-[34px]">
            ثلاث خطوات تفصلك عن الفرصة
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-[18px] border border-white/12 bg-white/[.06] p-7"
            >
              <div className="mono text-sm font-semibold text-amber">{s.n}</div>
              <span className={`mt-3.5 flex h-12 w-12 items-center justify-center rounded-[13px] ${s.iconWrap}`}>
                <s.Icon width={24} height={24} className={s.iconColor} />
              </span>
              <h3 className="mt-[18px] text-[19px] font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-7 text-white/70">{s.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
