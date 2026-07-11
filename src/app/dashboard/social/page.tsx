"use client";

import { useEffect, useState } from "react";
import {
  XSocialIcon,
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
  TiktokIcon,
  GlobeIcon,
  EyeIcon,
} from "@/components/icons";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  socialPlatforms,
  loadSocialLinks,
  saveSocialLinks,
  type SocialLinks,
} from "@/lib/social";
import Link from "next/link";

// شبكات التواصل — روابط حسابات المستخدم، تظهر في صفحته العامة

const platformIcons: Record<string, typeof GlobeIcon> = {
  x: XSocialIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  linkedin: LinkedinIcon,
  tiktok: TiktokIcon,
  website: GlobeIcon,
};

/** الصفحة العامة المقابلة لحساب الديمو */
const publicPageForDemo: Record<string, string> = {
  "demo-hero": "/heroes/h1",
  "demo-producer": "/producers/pr1",
  "demo-company": "/companies/c1",
};

const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-surface px-3.5 py-2.5 text-[14px] text-charcoal outline-none transition-colors placeholder:text-[#9aa29d] focus:border-jazan";

export default function SocialPage() {
  const { user } = useAuth();
  const [links, setLinks] = useState<SocialLinks>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setLinks(loadSocialLinks(user.id));
  }, [user]);

  function setLink(key: string, value: string) {
    setLinks((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    // احفظ الروابط غير الفارغة فقط
    const clean: SocialLinks = {};
    for (const [k, v] of Object.entries(links)) {
      if (v.trim()) clean[k] = v.trim();
    }
    saveSocialLinks(user.id, clean);
    setLinks(clean);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const publicPage = user ? publicPageForDemo[user.id] : undefined;
  const activeCount = Object.values(links).filter((v) => v.trim()).length;

  return (
    <div className="mx-auto w-full max-w-[720px] pb-10">
      <h1 className="text-[18px] font-extrabold text-charcoal">شبكات التواصل</h1>
      <p className="mt-0.5 text-[13px] text-muted">
        أضف روابط حساباتك — تظهر كأيقونات في صفحتك العامة أمام الزوار.
      </p>

      <form onSubmit={handleSave} className="mt-5 rounded-[16px] border border-line bg-surface p-5">
        <div className="flex flex-col gap-4">
          {socialPlatforms.map((p) => {
            const Icon = platformIcons[p.key] ?? GlobeIcon;
            return (
              <div key={p.key} className="grid items-center gap-2 sm:grid-cols-[170px_1fr]">
                <label
                  htmlFor={`social-${p.key}`}
                  className="flex items-center gap-2.5 text-[13px] font-semibold text-charcoal"
                >
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-jazan/10 text-jazan">
                    <Icon width={17} height={17} />
                  </span>
                  {p.label}
                </label>
                <input
                  id={`social-${p.key}`}
                  type="url"
                  dir="ltr"
                  value={links[p.key] ?? ""}
                  onChange={(e) => setLink(p.key, e.target.value)}
                  placeholder={p.placeholder}
                  className={`mono text-start ${inputClass}`}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="cursor-pointer rounded-xl bg-jazan px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-jazan-dark"
          >
            حفظ الروابط
          </button>
          {saved ? (
            <span className="text-[13px] font-semibold text-success-ink">
              ✓ تم الحفظ — ستظهر في صفحتك العامة
            </span>
          ) : null}
          {publicPage && activeCount > 0 ? (
            <Link
              href={publicPage}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-jazan no-underline hover:underline"
            >
              <EyeIcon width={15} height={15} />
              عرض صفحتي العامة
            </Link>
          ) : null}
        </div>
      </form>

      <p className="mt-3 text-[12px] leading-relaxed text-muted">
        ملاحظة: اترك الحقل فارغاً لإخفاء المنصة من صفحتك. تأكد أن الرابط يبدأ بـ{" "}
        <span className="mono" dir="ltr">https://</span>
      </p>
    </div>
  );
}
