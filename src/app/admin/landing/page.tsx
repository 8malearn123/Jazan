"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EyeIcon } from "@/components/icons";
import { AdminPageHead } from "../_components/AdminTable";
import {
  defaultLanding,
  loadLanding,
  saveLanding,
  type LandingContent,
} from "@/lib/landing";

const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-surface px-3.5 py-2.5 text-[14px] text-charcoal outline-none transition-colors placeholder:text-[#9aa29d] focus:border-jazan";

const fields: { key: keyof LandingContent; label: string; hint: string; rows?: number }[] = [
  { key: "tagline", label: "الشارة العلوية", hint: "السطر الصغير فوق العنوان" },
  { key: "title1", label: "العنوان — السطر الأول", hint: "مثال: مواهب جازان" },
  { key: "title2", label: "العنوان — السطر الثاني", hint: "مثال: تلتقي بالفرص الحقيقية" },
  { key: "desc", label: "الوصف التعريفي", hint: "الفقرة أسفل العنوان", rows: 3 },
];

export default function AdminLandingPage() {
  const [content, setContent] = useState<LandingContent>(defaultLanding);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setContent(loadLanding());
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    saveLanding({
      tagline: content.tagline.trim() || defaultLanding.tagline,
      title1: content.title1.trim() || defaultLanding.title1,
      title2: content.title2.trim() || defaultLanding.title2,
      desc: content.desc.trim() || defaultLanding.desc,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="mx-auto w-full max-w-[820px] space-y-5">
      <AdminPageHead
        title="الصفحة الرئيسية"
        subtitle="تحكم بنصوص الواجهة الرئيسية — التغييرات تظهر للزوار فور الحفظ"
      />

      <form onSubmit={handleSave} className="rounded-[16px] border border-line bg-surface p-5">
        <div className="flex flex-col gap-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label htmlFor={`landing-${f.key}`} className="mb-1.5 block text-[13px] font-semibold text-charcoal">
                {f.label} <span className="font-normal text-muted">— {f.hint}</span>
              </label>
              {f.rows ? (
                <textarea
                  id={`landing-${f.key}`}
                  rows={f.rows}
                  value={content[f.key]}
                  onChange={(e) => setContent((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
              ) : (
                <input
                  id={`landing-${f.key}`}
                  value={content[f.key]}
                  onChange={(e) => setContent((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  className={inputClass}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-[14px] border border-dashed border-line bg-cream/60 p-5">
          <div className="text-[11px] font-semibold text-muted">معاينة</div>
          <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1 text-[12px] font-semibold text-jazan">
            <span className="h-[6px] w-[6px] rounded-full bg-success" />
            {content.tagline}
          </span>
          <h3 className="mt-2.5 text-[22px] font-extrabold leading-[1.4] text-charcoal">
            {content.title1}
            <br />
            {content.title2}
          </h3>
          <p className="mt-2 max-w-[480px] text-[13px] leading-relaxed text-muted">{content.desc}</p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="cursor-pointer rounded-xl bg-jazan px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-jazan-dark"
          >
            حفظ ونشر
          </button>
          {saved ? (
            <span className="text-[13px] font-semibold text-success-ink">✓ تم النشر — ظاهر الآن للزوار</span>
          ) : null}
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-jazan no-underline hover:underline"
          >
            <EyeIcon width={15} height={15} />
            عرض الصفحة الرئيسية
          </Link>
        </div>
      </form>

      <p className="text-[12px] leading-relaxed text-muted">
        ملاحظة: التعديل يطبَّق على النسخة العربية للموقع. اترك الحقل فارغاً للرجوع للنص الافتراضي.
      </p>
    </div>
  );
}
