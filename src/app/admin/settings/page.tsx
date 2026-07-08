"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { AdminPageHead } from "../_components/AdminTable";

const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-surface px-3.5 py-2.5 text-[14px] text-charcoal outline-none transition-colors placeholder:text-[#9aa29d] focus:border-jazan focus:shadow-[0_0_0_4px_rgba(15,92,74,.08)]";

const initialToggles = [
  { key: "register", label: "السماح بالتسجيل الجديد", on: true },
  { key: "review", label: "مراجعة الشركات قبل النشر", on: true },
  { key: "sponsors", label: "إظهار قسم الرعاة في الرئيسية", on: true },
  { key: "maintenance", label: "وضع الصيانة", on: false },
];

export default function AdminSettingsPage() {
  const [toggles, setToggles] = useState(initialToggles);
  const [saved, setSaved] = useState(false);

  function flip(key: string) {
    setToggles((list) => list.map((t) => (t.key === key ? { ...t, on: !t.on } : t)));
  }

  return (
    <div className="mx-auto w-full max-w-[820px] space-y-5">
      <AdminPageHead title="الإعدادات" subtitle="إعدادات المنصة العامة" />

      {/* معلومات المنصة */}
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
            <input className={inputClass} defaultValue="info@jazanheroes.sa" dir="ltr" />
          </div>
        </div>
      </section>

      {/* خيارات التشغيل */}
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

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
          }}
          className="cursor-pointer rounded-xl bg-jazan px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-jazan-dark"
        >
          حفظ التغييرات
        </button>
        {saved ? <span className="text-[13px] font-semibold text-success-ink">✓ تم الحفظ</span> : null}
      </div>
    </div>
  );
}
