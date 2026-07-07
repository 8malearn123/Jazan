import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "سياسة الخصوصية لمنصة أبطال جازان.",
};

const sections = [
  {
    title: "مقدمة",
    body: "نحن في منصة أبطال جازان نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضّح هذه السياسة كيف نجمع معلوماتك ونستخدمها ونحميها عند استخدامك للمنصة.",
  },
  {
    title: "المعلومات التي نجمعها",
    body: "نجمع المعلومات التي تزوّدنا بها عند إنشاء حسابك مثل الاسم والبريد الإلكتروني ورقم التواصل والمدينة والمهارات أو المنتجات التي تعرضها، إضافة إلى بيانات الاستخدام الأساسية لتحسين تجربتك.",
  },
  {
    title: "كيف نستخدم معلوماتك",
    body: "نستخدم معلوماتك لإنشاء ملفك التعريفي وعرضه للزوار، وتمكين التواصل المباشر بينك وبين الأطراف الأخرى، وتحسين خدمات المنصة وأمانها.",
  },
  {
    title: "مشاركة المعلومات",
    body: "لا نبيع بياناتك الشخصية. تظهر معلومات ملفك العامة (كالاسم والتخصص والمدينة) للزوار بهدف الربط، بينما تبقى بياناتك الحساسة محمية ولا تُشارك مع جهات خارجية إلا بموافقتك أو حسب ما يقتضيه النظام.",
  },
  {
    title: "التواصل عبر واتساب",
    body: "يتم التواصل بين المستخدمين مباشرة عبر واتساب. المنصة لا تطّلع على محتوى محادثاتكم ولا تتحمّل مسؤولية الاتفاقات التي تتم خارجها.",
  },
  {
    title: "حقوقك",
    body: "يحق لك الوصول إلى بياناتك وتعديلها أو طلب حذف حسابك في أي وقت من خلال لوحة التحكم أو عبر التواصل معنا.",
  },
  {
    title: "التواصل معنا",
    body: "لأي استفسار يخص الخصوصية، يمكنك التواصل معنا عبر صفحة «تواصل معنا».",
  },
];

export default function PrivacyPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-[13px] font-bold tracking-wide text-amber">المستندات القانونية</div>
        <h1 className="mt-2.5 text-[28px] font-extrabold tracking-[-.5px] text-charcoal sm:text-[36px]">
          سياسة الخصوصية
        </h1>
        <p className="mt-3 text-[15px] text-muted">آخر تحديث: {site.year}</p>

        <div className="mt-8 flex flex-col gap-7">
          {sections.map((s, i) => (
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
