import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description: "إجابات لأكثر الأسئلة شيوعاً حول منصة أبطال جازان.",
};

const faqs = [
  {
    q: "ما هي منصة أبطال جازان؟",
    a: "منصة مجتمعية محلية تربط مواهب منطقة جازان — المستقلين والباحثين عن عمل، والأسر المنتجة والصُنّاع — بالشركات والجهات والعملاء، عبر تواصل مباشر بضغطة زر.",
  },
  {
    q: "هل التسجيل في المنصة مجاني؟",
    a: "نعم، التسجيل وإنشاء ملفك التعريفي مجاني تماماً سواء كنت بطلاً أو أسرة منتجة أو شركة.",
  },
  {
    q: "كيف أُسجّل كبطل أو مستقل؟",
    a: "اضغط على «انضم كبطل»، اختر دورك (مستقل / أسرة منتجة / شركة)، ثم أكمل بياناتك وابنِ صفحتك الاحترافية في دقائق.",
  },
  {
    q: "كيف أتواصل مع بطل أو أسرة منتجة؟",
    a: "كل ملف يحتوي زر «تواصل عبر واتساب» يفتح محادثة مباشرة مع صاحب الملف — التواصل والاتفاق يتم بينكما مباشرة.",
  },
  {
    q: "كيف توثّق المنصة الشركات والجهات؟",
    a: "تمرّ الشركات بمراجعة من فريق المنصة قبل ظهور شارة «موثّقة»، لضمان مصداقية الفرص المنشورة.",
  },
  {
    q: "أنا صاحب أسرة منتجة، كيف أعرض منتجاتي؟",
    a: "سجّل كـ«أسرة منتجة»، ثم أضف منتجاتك بالصور والأسعار من لوحة التحكم، وسيتمكّن العملاء من طلبها عبر واتساب.",
  },
  {
    q: "كيف أنشر وظيفة كشركة؟",
    a: "سجّل حساب شركة، ثم انشر فرصك الوظيفية من لوحة التحكم وتابع المتقدمين وتواصل معهم مباشرة.",
  },
  {
    q: "هل تتدخّل المنصة في الدفع أو التعاملات المالية؟",
    a: "لا، دور المنصة هو الربط والتعريف فقط. كل التعاملات المالية تتم مباشرة بين الطرفين خارج المنصة.",
  },
];

export default function FaqPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="text-[13px] font-bold tracking-wide text-amber">مركز المساعدة</div>
        <h1 className="mt-2.5 text-[28px] font-extrabold tracking-[-.5px] text-charcoal sm:text-[36px]">
          الأسئلة الشائعة
        </h1>
        <p className="mt-3 text-[16px] leading-8 text-muted">
          إجابات سريعة لأكثر ما يسأل عنه أبطالنا وشركاؤنا.
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3">
        {faqs.map((f, i) => (
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
        <h2 className="text-[20px] font-extrabold text-charcoal">لم تجد إجابتك؟</h2>
        <p className="mt-2 text-[15px] text-muted">فريقنا سعيد بمساعدتك في أي وقت.</p>
        <div className="mt-5">
          <Button href="/contact" variant="primary">
            تواصل معنا
          </Button>
        </div>
      </div>
    </Container>
  );
}
