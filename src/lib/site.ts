export const site = {
  name: "أبطال جازان",
  tagline: "منصة جازان المجتمعية للمواهب",
  description:
    "منصة محلية تربط المستقلين والباحثين عن عمل، والأسر المنتجة والصُنّاع، بالشركات والجهات — تواصل مباشر بضغطة زر.",
  url: "https://jazan.vercel.app",
  whatsapp: "966500000000",
  year: 2026,
} as const;

export const navLinks = [
  { label: "تصفّح الأبطال", href: "/browse" },
  { label: "للشركات", href: "/companies" },
  { label: "كيف تعمل", href: "/#how-it-works" },
] as const;

export function whatsappLink(phone: string, message?: string): string {
  const num = phone.replace(/[^0-9]/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${num}${text}`;
}
