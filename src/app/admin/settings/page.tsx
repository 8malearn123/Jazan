"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { WhatsappIcon, InstagramIcon, YoutubeIcon } from "@/components/icons";
import {
  defaultSiteSocial,
  loadSiteSocial,
  saveSiteSocial,
  type SiteSocialLinks,
} from "@/lib/siteSocial";
import { AdminPageHead } from "../_components/AdminTable";

const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-surface px-3.5 py-2.5 text-[14px] text-charcoal outline-none transition-colors placeholder:text-[#9aa29d] focus:border-jazan focus:shadow-[0_0_0_4px_rgba(166,63,43,.08)]";

const followFields: {
  key: keyof SiteSocialLinks;
  label: string;
  placeholder: string;
  Icon: typeof WhatsappIcon;
}[] = [
  { key: "whatsapp", label: "واتساب", placeholder: "https://wa.me/9665XXXXXXXX", Icon: WhatsappIcon },
  { key: "instagram", label: "انستقرام", placeholder: "https://instagram.com/username", Icon: InstagramIcon },
  { key: "youtube", label: "يوتيوب", placeholder: "https://youtube.com/@channel", Icon: YoutubeIcon },
];

const initialToggles = [
  { key: "register", label: "السماح بالتسجيل الجديد", on: true },
  { key: "review", label: "مراجعة الشركات قبل النشر", on: true },
  { key: "sponsors", label: "إظهار قسم الرعاة في الرئيسية", on: true },
  { key: "maintenance", label: "وضع الصيانة", on: false },
];

const PLATFORM_PREFIX = "jazanheroes.";
const SESSION_KEY = "jazanheroes.session";

export default function AdminSettingsPage() {
  const [toggles, setToggles] = useState(initialToggles);
  const [social, setSocial] = useState<SiteSocialLinks>(defaultSiteSocial);
  const [saved, setSaved] = useState(false);
  const [cleaned, setCleaned] = useState(0);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setSocial(loadSiteSocial());
  }, []);

  function flip(key: string) {
    setToggles((list) => list.map((t) => (t.key === key ? { ...t, on: !t.on } : t)));
  }

  function handleCleanup() {
    const confirmed = window.confirm(
      "سيتم مسح كل البيانات التجريبية المخزّنة على هذا المتصفح:\n" +
        "التسجيلات الجديدة، قرارات الاعتماد، التقييمات، رسائل الدعم، الصور، والسلال.\n\n" +
        "ستعود المنصة لحالتها الافتراضية وسيبقى دخولك كمدير. هل أنت متأكد؟"
    );
    if (!confirmed) return;
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(PLATFORM_PREFIX) && key !== SESSION_KEY) keys.push(key);
      }
      keys.forEach((key) => localStorage.removeItem(key));
      setCleaned(keys.length);
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      setCleaned(-1);
    }
  }

  function handleSave() {
    saveSiteSocial({
      whatsapp: social.whatsapp.trim(),
      instagram: social.instagram.trim(),
      youtube: social.youtube.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="mx-auto w-full max-w-[820px] space-y-5">
      <AdminPageHead title="الإعدادات" subtitle="إعدادات المنصة العامة" />

      <section className="rounded-[16px] border border-line bg-surface p-5">
        <h2 className="text-[15px] font-bold text-charcoal">معلومات المنصة</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">اسم المنصة</label>
            <input className={inputClass} defaultValue={site.name} />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">رقم واتساب الرسمي</label>
            <input className={inputClass} defaultValue={site.whatsapp} dir="ltr" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">البريد الإلكتروني للدعم</label>
            <input className={inputClass} defaultValue="info@forsa.sa" dir="ltr" />
          </div>
        </div>
      </section>

      <section className="rounded-[16px] border border-line bg-surface p-5">
        <h2 className="text-[15px] font-bold text-charcoal">تابعنا</h2>
        <p className="mt-0.5 text-[13px] text-muted">
          روابط حسابات المنصة الرسمية — تظهر في قسم «تابعنا» أسفل الصفحة الرئيسية.
        </p>
        <div className="mt-4 flex flex-col gap-4">
          {followFields.map(({ key, label, placeholder, Icon }) => (
            <div key={key} className="grid items-center gap-2 sm:grid-cols-[150px_1fr]">
              <label
                htmlFor={`follow-${key}`}
                className="flex items-center gap-2.5 text-[13px] font-semibold text-charcoal"
              >
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-jazan/10 text-jazan">
                  <Icon width={17} height={17} />
                </span>
                {label}
              </label>
              <input
                id={`follow-${key}`}
                type="url"
                dir="ltr"
                value={social[key]}
                onChange={(e) => setSocial((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                className={`mono text-start ${inputClass}`}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[16px] border border-line bg-surface p-5">
        <h2 className="text-[15px] font-bold text-charcoal">خيارات التشغيل</h2>
        <div className="mt-3 divide-y divide-line">
          {toggles.map((t) => (
            <div key={t.key} className="flex items-center justify-between py-3">
              <span className="text-[14px] text-ink">{t.label}</span>
              <button
                type="button"
                onClick={() => flip(t.key)}
                className={`flex h-6 w-11 cursor-pointer items-center rounded-full p-0.5 transition-colors ${
                  t.on ? "justify-end bg-jazan" : "justify-start bg-sand"
                }`}
              >
                <span className="h-5 w-5 rounded-full bg-surface shadow" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[16px] border border-warn/40 bg-warn/[.04] p-5">
        <h2 className="text-[15px] font-bold text-charcoal">تنظيف البيانات</h2>
        <p className="mt-0.5 text-[13px] leading-relaxed text-muted">
          مسح كل البيانات التجريبية المخزّنة على هذا المتصفح وإعادة المنصة لحالتها الافتراضية:
          التسجيلات الجديدة، قرارات اعتماد التقييمات والصور والعروض، رسائل الدعم الفني، صور الملفات،
          سلال المشتريات، وتعديلات الصفحة الرئيسية. يبقى تسجيل دخولك كمدير.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleCleanup}
            className="cursor-pointer rounded-xl bg-warn px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:brightness-95"
          >
            إعادة تعيين بيانات المنصة
          </button>
          {cleaned > 0 ? (
            <span className="text-[13px] font-semibold text-success-ink">
              ✓ تم مسح {cleaned} سجلاً — جارٍ تحديث الصفحة…
            </span>
          ) : null}
          {cleaned === -1 ? (
            <span className="text-[13px] font-semibold text-warn-ink">تعذّر التنظيف — أعد المحاولة.</span>
          ) : null}
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="cursor-pointer rounded-xl bg-jazan px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-jazan-dark"
        >
          حفظ التغييرات
        </button>
        {saved ? <span className="text-[13px] font-semibold text-success-ink">✓ تم الحفظ</span> : null}
      </div>
    </div>
  );
}
