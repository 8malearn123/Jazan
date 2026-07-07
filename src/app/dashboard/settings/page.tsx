"use client";

import { useState } from "react";
import { useAuth, roleLabels } from "@/components/auth/AuthProvider";

const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-white px-3.5 py-2.5 text-[14px] text-charcoal outline-none transition-colors placeholder:text-[#9aa29d] focus:border-jazan focus:shadow-[0_0_0_4px_rgba(15,92,74,.08)]";

export default function DashboardSettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[760px] space-y-4 pb-10">
      <div>
        <h1 className="text-[18px] font-extrabold text-charcoal">الإعدادات</h1>
        <p className="mt-0.5 text-[13px] text-muted">إدارة حسابك.</p>
      </div>

      {/* الحساب */}
      <section className="rounded-[16px] border border-line bg-white p-5">
        <h2 className="text-[15px] font-bold text-charcoal">معلومات الحساب</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">البريد الإلكتروني</label>
            <input className={inputClass} dir="ltr" defaultValue={user?.email ?? ""} />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">نوع الحساب</label>
            <input className={`${inputClass} bg-cream`} defaultValue={roleLabels[user?.role ?? "hero"]} disabled />
          </div>
        </div>
      </section>

      {/* كلمة المرور */}
      <section className="rounded-[16px] border border-line bg-white p-5">
        <h2 className="text-[15px] font-bold text-charcoal">تغيير كلمة المرور</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">كلمة المرور الحالية</label>
            <input type="password" className={inputClass} placeholder="••••••••" />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">كلمة المرور الجديدة</label>
            <input type="password" className={inputClass} placeholder="••••••••" />
          </div>
        </div>
      </section>

      {/* حفظ */}
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
