import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { UsersIcon, StoreIcon, BuildingIcon, ArrowLeftIcon } from "@/components/icons";

const cards = [
  {
    title: "مستقل / باحث عن عمل",
    desc: "ابنِ بروفايلك، اعرض مهاراتك وسيرتك الذاتية، وحدّد حالتك.",
    href: "/register?role=hero",
    Icon: UsersIcon,
    iconBg: "bg-jazan/10",
    iconColor: "text-jazan",
    accent: "text-jazan",
  },
  {
    title: "أسرة منتجة / صانع",
    desc: "اعرض منتجاتك بصرياً — طعام، حِرف، عطور — واستقبل الطلبات.",
    href: "/register?role=producer",
    Icon: StoreIcon,
    iconBg: "bg-amber/15",
    iconColor: "text-amber-dark",
    accent: "text-amber-dark",
  },
  {
    title: "شركة / جهة",
    desc: "انشر الفرص، تابع المتقدمين، ووظّف مواهب جازان المحلية.",
    href: "/register?role=company",
    Icon: BuildingIcon,
    iconBg: "bg-info/12",
    iconColor: "text-info",
    accent: "text-info",
  },
];

export function CategoryCards() {
  return (
    <section className="pb-10 sm:pb-14">
      <Container className="grid gap-4 sm:gap-5 md:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.title}
            href={c.href}
            className="jh-cat group rounded-[18px] border border-line bg-white p-7 no-underline shadow-[0_1px_2px_rgba(28,42,38,.04)] transition-[transform,box-shadow,border-color] duration-[250ms] hover:-translate-y-1 hover:border-jazan hover:shadow-[0_12px_30px_rgba(28,42,38,.10)]"
          >
            <span className={`flex h-[52px] w-[52px] items-center justify-center rounded-[14px] ${c.iconBg}`}>
              <c.Icon width={26} height={26} className={c.iconColor} />
            </span>
            <h3 className="mt-[18px] text-xl font-bold text-charcoal">{c.title}</h3>
            <p className="mt-2 text-[15px] leading-7 text-muted">{c.desc}</p>
            <span className={`mt-[18px] flex items-center gap-1.5 text-sm font-semibold ${c.accent}`}>
              ابدأ الآن
              <ArrowLeftIcon width={16} height={16} strokeWidth={2.2} />
            </span>
          </Link>
        ))}
      </Container>
    </section>
  );
}
