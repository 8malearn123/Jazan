import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";
import { HeroProfileView } from "@/components/hero/HeroProfileView";
import { pendingVerifications, getPendingVerification } from "@/lib/data";
import type { Hero, AvailabilityStatus } from "@/lib/types";
import { VerificationActions } from "./Actions";

export function generateStaticParams() {
  return pendingVerifications.map((p) => ({ id: p.id }));
}

type Role = "hero" | "producer" | "company";

const roleTitle: Record<Role, string> = {
  hero: "مستقل / مزوّد خدمة",
  producer: "أسرة منتجة / صانع",
  company: "شركة / جهة",
};
const roleStatus: Record<Role, AvailabilityStatus> = {
  hero: "freelance",
  producer: "producer",
  company: "both",
};
const roleSkills: Record<Role, string[]> = {
  hero: ["React", "TypeScript", "تصميم واجهات"],
  producer: ["معصوب", "مراصيع", "حلى جازاني"],
  company: ["تطوير برمجيات", "تسويق رقمي"],
};

export default async function VerificationPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const req = getPendingVerification(id);
  if (!req) notFound();

  // نبني ملف بطل من بيانات الطلب لعرضه تماماً كصفحة العرض العامة
  const previewHero: Hero = {
    id: req.id,
    name: req.name,
    title: roleTitle[req.role],
    city: req.city,
    status: roleStatus[req.role],
    skills: roleSkills[req.role],
    verified: false,
  };

  const bio = `${req.name} من ${req.city}، تقدّم بطلب توثيق حسابه على منصة أبطال جازان. هذه معاينة لملفه كما سيظهر للزوّار بعد الاعتماد.`;

  return (
    <div className="mx-auto w-full max-w-4xl pb-10">
      {/* رجوع */}
      <Link
        href="/admin/verifications"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted no-underline transition-colors hover:text-jazan"
      >
        <ArrowLeftIcon className="h-[18px] w-[18px]" />
        رجوع لطلبات التوثيق
      </Link>

      {/* شريط قرار التوثيق */}
      <div className="mt-4 flex flex-col gap-3 rounded-[16px] border border-amber/40 bg-amber/[.07] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-[14px] font-bold text-charcoal">
            معاينة طلب توثيق — <span className="text-warn-ink">قيد المراجعة</span>
          </div>
          <div className="mt-0.5 text-[12px] text-muted">
            راجِع الملف كما سيظهر للعامة، ثم اعتمده أو ارفضه.
          </div>
        </div>
        <VerificationActions name={req.name} />
      </div>

      {/* الملف — مطابق لصفحة عرض البطل */}
      <div className="mt-4">
        <HeroProfileView hero={previewHero} bio={bio} />
      </div>
    </div>
  );
}
