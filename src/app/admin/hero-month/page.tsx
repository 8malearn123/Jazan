"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { EyeIcon } from "@/components/icons";
import { AdminPageHead } from "../_components/AdminTable";
import {
  currentMonthLabel,
  defaultHeroOfMonth,
  fetchHeroOfMonthRemote,
  loadHeroOfMonth,
  publishHeroOfMonth,
  type HeroOfMonth,
} from "@/lib/heroMonth";
import { fetchHeroArtRemote, loadHeroArt, publishHeroArt } from "@/lib/heroArt";

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
      // PNG يحافظ على الشفافية (مهم للأيقونات فوق خلفية البطاقة الخضراء)
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

export default function AdminHeroMonthPage() {
  const [content, setContent] = useState<HeroOfMonth>(defaultHeroOfMonth);
  const [savedMsg, setSavedMsg] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [art, setArt] = useState("");
  const [artMsg, setArtMsg] = useState("");
  const [artError, setArtError] = useState("");
  const [artSaving, setArtSaving] = useState(false);
  const artFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setContent(loadHeroOfMonth());
    setArt(loadHeroArt());
    let cancelled = false;
    fetchHeroOfMonthRemote().then((remote) => {
      if (remote && !cancelled) setContent(remote);
    });
    fetchHeroArtRemote().then((remote) => {
      if (remote !== null && !cancelled) setArt(remote);
    });
    return () => {
      cancelled = true;
    };
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

  async function handleArtFile(file: File | undefined) {
    if (!file) return;
    setArtError("");
    setArtMsg("");
    try {
      const dataUrl = await imageFileToDataUrl(file, 1000);
      setArt(dataUrl);
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
        "حُفظ محلياً، لكن تعذّر النشر لقاعدة البيانات — تأكد من تنفيذ ملف supabase/site_content.sql في مشروع Supabase."
      );
      return;
    }
    setTimeout(() => setArtMsg(""), 4000);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    setSavedMsg("");
    const { local, remote } = await publishHeroOfMonth({
      name: content.name.trim() || defaultHeroOfMonth.name,
      title: content.title.trim() || defaultHeroOfMonth.title,
      month: content.month.trim(),
      image: content.image,
    });
    setSaving(false);
    if (!local && remote !== true) {
      setError("تعذّر الحفظ — قد تكون الصورة كبيرة جداً. جرّب صورة أصغر.");
      return;
    }
    if (remote === true) {
      setSavedMsg("✓ تم النشر لجميع الزوار — من كل الأجهزة");
    } else if (remote === null) {
      setSavedMsg("✓ تم الحفظ على هذا المتصفح فقط — أضف مفاتيح Supabase ليظهر لجميع الزوار");
    } else {
      setError(
        "حُفظ محلياً، لكن تعذّر النشر لقاعدة البيانات — تأكد من تنفيذ ملف supabase/site_content.sql في مشروع Supabase."
      );
      return;
    }
    setTimeout(() => setSavedMsg(""), 4000);
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
            disabled={saving}
            className="cursor-pointer rounded-xl bg-jazan px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-jazan-dark disabled:opacity-60"
          >
            {saving ? "جارٍ النشر…" : "حفظ ونشر"}
          </button>
          {savedMsg ? (
            <span className="text-[13px] font-semibold text-success-ink">{savedMsg}</span>
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
        <div className="text-[15px] font-bold text-charcoal">رسمة الهيرو الافتراضية</div>
        <p className="mt-1 text-[13px] leading-relaxed text-muted">
          الصورة التي تظهر في بطاقة الهيرو بالصفحة الرئيسية عندما لا تكون هناك صورة بطل شهر
          مرفوعة. ارفع صورتك الخاصة (يُفضَّل PNG بخلفية شفافة) أو أبقِ الرسمة المدمجة.
        </p>
        <div className="mt-4 grid gap-5 sm:grid-cols-[220px_1fr]">
          <div className="relative h-[220px] w-full overflow-hidden rounded-[14px] border border-line bg-[#0f5c4a]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={art || "/hero-of-month.svg"}
              alt="معاينة رسمة الهيرو الافتراضية"
              className="h-full w-full object-cover"
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
        ملاحظة: كل بداية شهر اختر البطل الأكثر نجاحاً وتفاعلاً في المنصة، وارفع صورته وحدّث اسمه ووصفه.
        إن تُرك حقل الشهر فارغاً فسيعرض الموقع اسم الشهر الحالي تلقائياً.
      </p>
    </div>
  );
}
