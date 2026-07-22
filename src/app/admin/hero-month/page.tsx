"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { EyeIcon } from "@/components/icons";
import { AdminPageHead } from "../_components/AdminTable";
import {
  currentMonthLabel,
  defaultHeroOfMonth,
  loadHeroOfMonth,
  saveHeroOfMonth,
  type HeroOfMonth,
} from "@/lib/heroMonth";

const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-surface px-3.5 py-2.5 text-[14px] text-charcoal outline-none transition-colors placeholder:text-[#9aa29d] focus:border-jazan";

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
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}

export default function AdminHeroMonthPage() {
  const [content, setContent] = useState<HeroOfMonth>(defaultHeroOfMonth);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setContent(loadHeroOfMonth());
  }, []);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");
    try {
      const dataUrl = await imageFileToDataUrl(file, 1000);
      setContent((prev) => ({ ...prev, image: dataUrl }));
    } catch {
      setError("تعذّر قراءة الصورة — جرّب ملفاً آخر بصيغة JPG أو PNG.");
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const ok = saveHeroOfMonth({
      name: content.name.trim() || defaultHeroOfMonth.name,
      title: content.title.trim() || defaultHeroOfMonth.title,
      month: content.month.trim(),
      image: content.image,
    });
    if (!ok) {
      setError("تعذّر الحفظ — قد تكون الصورة كبيرة جداً على مساحة التخزين. جرّب صورة أصغر.");
      return;
    }
    setError("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="mx-auto w-full max-w-[820px] space-y-5">
      <AdminPageHead
        title="بطل الشهر"
        subtitle="اختر بطل الشهر وحدّث صورته وبياناته — يظهر مباشرة في واجهة الصفحة الرئيسية"
      />

      <form onSubmit={handleSave} className="rounded-[16px] border border-line bg-surface p-5">
        <div className="grid gap-5 sm:grid-cols-[220px_1fr]">
          <div>
            <div className="text-[13px] font-semibold text-charcoal">صورة البطل</div>
            <div className="relative mt-2 h-[220px] w-full overflow-hidden rounded-[14px] border border-line bg-[#0f5c4a]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={content.image || "/hero-of-month.svg"}
                alt="معاينة صورة بطل الشهر"
                className="h-full w-full object-cover"
              />
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <div className="mt-2.5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer rounded-[10px] bg-jazan px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-jazan-dark"
              >
                تغيير الصورة
              </button>
              {content.image ? (
                <button
                  type="button"
                  onClick={() => setContent((prev) => ({ ...prev, image: "" }))}
                  className="cursor-pointer rounded-[10px] border border-line bg-surface px-3.5 py-2 text-[13px] font-semibold text-charcoal transition-colors hover:border-jazan"
                >
                  استعادة الصورة الافتراضية
                </button>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="hm-name" className="mb-1.5 block text-[13px] font-semibold text-charcoal">
                اسم البطل <span className="font-normal text-muted">— صاحب أعلى تفاعل ونجاح هذا الشهر</span>
              </label>
              <input
                id="hm-name"
                value={content.name}
                onChange={(e) => setContent((prev) => ({ ...prev, name: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="hm-title" className="mb-1.5 block text-[13px] font-semibold text-charcoal">
                الوصف <span className="font-normal text-muted">— التخصص أو سبب الاختيار</span>
              </label>
              <input
                id="hm-title"
                value={content.title}
                onChange={(e) => setContent((prev) => ({ ...prev, title: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="hm-month" className="mb-1.5 block text-[13px] font-semibold text-charcoal">
                الشهر <span className="font-normal text-muted">— اتركه فارغاً ليتحدّث تلقائياً كل شهر ({currentMonthLabel()})</span>
              </label>
              <input
                id="hm-month"
                value={content.month}
                onChange={(e) => setContent((prev) => ({ ...prev, month: e.target.value }))}
                className={inputClass}
                placeholder={currentMonthLabel()}
              />
            </div>
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-lg bg-warn/12 px-3 py-2 text-[13px] font-medium text-warn-ink">{error}</p>
        ) : null}

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
        ملاحظة: كل بداية شهر اختر البطل الأكثر نجاحاً وتفاعلاً في المنصة، وارفع صورته وحدّث اسمه ووصفه.
        إن تُرك حقل الشهر فارغاً فسيعرض الموقع اسم الشهر الحالي تلقائياً.
      </p>
    </div>
  );
}
