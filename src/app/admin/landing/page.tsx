"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { EyeIcon } from "@/components/icons";
import { AdminPageHead } from "../_components/AdminTable";
import {
  defaultLanding,
  loadLanding,
  saveLanding,
  type LandingContent,
} from "@/lib/landing";
import { fetchHeroArtRemote, loadHeroArt, publishHeroArt } from "@/lib/heroArt";

function imageFileToDataUrl(file: File, maxDim: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      // WebP يدعم الشفافية بحجم أصغر بكثير من PNG — فتُجلب الصورة أسرع.
      // نتحقق من دعم المتصفح قبل اعتماده، وإلا نعود إلى PNG/JPEG.
      const webp = canvas.toDataURL("image/webp", 0.9);
      if (webp.startsWith("data:image/webp")) {
        resolve(webp);
        return;
      }
      if (file.type === "image/png") resolve(canvas.toDataURL("image/png"));
      else resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}

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

  const [art, setArt] = useState("");
  const [artMsg, setArtMsg] = useState("");
  const [artError, setArtError] = useState("");
  const [artSaving, setArtSaving] = useState(false);
  const artFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setContent(loadLanding());
    setArt(loadHeroArt());
    let cancelled = false;
    fetchHeroArtRemote().then((remote) => {
      if (remote !== null && !cancelled) setArt(remote);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleArtFile(file: File | undefined) {
    if (!file) return;
    setArtError("");
    setArtMsg("");
    try {
      setArt(await imageFileToDataUrl(file, 900));
    } catch {
      setArtError("تعذّر قراءة الصورة — جرّب ملفاً آخر بصيغة JPG أو PNG.");
    }
  }

  async function handleArtSave() {
    if (artSaving) return;
    setArtSaving(true);
    setArtError("");
    setArtMsg("");
    const { local, remote } = await publishHeroArt(art);
    setArtSaving(false);
    if (!local && remote !== true) {
      setArtError("تعذّر الحفظ — قد تكون الصورة كبيرة جداً. جرّب صورة أصغر.");
      return;
    }
    if (remote === true) {
      setArtMsg("✓ تم النشر لجميع الزوار — من كل الأجهزة");
    } else if (remote === null) {
      setArtMsg("✓ تم الحفظ على هذا المتصفح فقط — أضف مفاتيح Supabase ليظهر لجميع الزوار");
    } else {
      setArtError(
        "حُفظ محلياً، لكن تعذّر النشر لقاعدة البيانات — تأكد من تنفيذ ملف supabase/site_content.sql."
      );
      return;
    }
    setTimeout(() => setArtMsg(""), 4000);
  }

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

      <div className="rounded-[16px] border border-line bg-surface p-5">
        <div className="text-[15px] font-bold text-charcoal">رسمة الواجهة</div>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          الصورة الطافية بجانب العنوان في الصفحة الرئيسية. ارفع صورتك الخاصة
          (يُفضَّل PNG بخلفية شفافة) أو أبقِ الرسمة المدمجة.
        </p>
        <div className="mt-4 grid gap-5 sm:grid-cols-[220px_1fr]">
          <div className="flex h-[220px] w-full items-center justify-center overflow-hidden rounded-[14px] border border-line bg-cream">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={art || "/hero-art.svg"}
              alt="معاينة رسمة الواجهة"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="flex flex-col items-start justify-center gap-2.5">
            <input
              ref={artFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                handleArtFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => artFileRef.current?.click()}
                className="cursor-pointer rounded-[10px] bg-jazan px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-jazan-dark"
              >
                رفع صورة
              </button>
              {art ? (
                <button
                  type="button"
                  onClick={() => setArt("")}
                  className="cursor-pointer rounded-[10px] border border-line bg-surface px-3.5 py-2 text-[13px] font-semibold text-charcoal transition-colors hover:border-jazan"
                >
                  استعادة الرسمة المدمجة
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleArtSave}
                disabled={artSaving}
                className="cursor-pointer rounded-[10px] border border-jazan bg-jazan/[.06] px-3.5 py-2 text-[13px] font-semibold text-jazan transition-colors hover:bg-jazan hover:text-white disabled:opacity-60"
              >
                {artSaving ? "جارٍ النشر…" : "حفظ ونشر"}
              </button>
            </div>
            {artMsg ? (
              <span className="text-[13px] font-semibold text-success-ink">{artMsg}</span>
            ) : null}
            {artError ? (
              <p className="rounded-lg bg-warn/12 px-3 py-2 text-[13px] font-medium text-warn-ink">
                {artError}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <p className="text-[12px] leading-relaxed text-muted">
        ملاحظة: التعديل يطبَّق على النسخة العربية للموقع. اترك الحقل فارغاً للرجوع للنص الافتراضي.
      </p>
    </div>
  );
}
