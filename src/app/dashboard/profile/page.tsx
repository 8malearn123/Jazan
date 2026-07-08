"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { useAuth } from "@/components/auth/AuthProvider";
import type { UserRole } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-surface px-3.5 py-2.5 text-[14px] text-charcoal outline-none transition-colors placeholder:text-[#9aa29d] focus:border-jazan focus:shadow-[0_0_0_4px_rgba(15,92,74,.08)]";

/** الحد الأقصى لحجم المرفق: 2 ميجابايت */
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const ACCEPT = ".pdf,.png,.jpg,.jpeg";

type Attachment = { name: string; size: number };

/** بيانات الملف القابلة للتعديل — تُحفظ محلياً في الوضع التجريبي */
type ProfileDraft = {
  name: string;
  title: string;
  city: string;
  whatsapp: string;
  bio: string;
  skills: string[];
};

/** وسوم مبدئية مناسبة لكل دور */
const seedSkills: Record<UserRole, string[]> = {
  hero: ["React", "TypeScript"],
  producer: ["طعام منزلي", "حلويات شعبية"],
  company: ["تطوير برمجيات", "تسويق"],
  admin: [],
};

function storageKey(userId: string) {
  return `jazanheroes.profile.${userId}`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const role = user?.role ?? "hero";
  const isProducer = role === "producer";
  const isCompany = role === "company";

  const [saved, setSaved] = useState(false);

  // الحقول — تُملأ من الجلسة ثم من المسودة المحفوظة (إن وُجدت)
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    if (!user) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(storageKey(user.id));
      if (raw) {
        const draft = JSON.parse(raw) as ProfileDraft;
        setName(draft.name ?? user.name);
        setTitle(draft.title ?? "");
        setCity(draft.city ?? "");
        setWhatsapp(draft.whatsapp ?? "");
        setBio(draft.bio ?? "");
        setSkills(draft.skills ?? seedSkills[user.role]);
        return;
      }
    } catch {
      // ignore
    }
    setName(user.name);
    setSkills(seedSkills[user.role]);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [user]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (user) {
      const draft: ProfileDraft = { name, title, city, whatsapp, bio, skills };
      try {
        localStorage.setItem(storageKey(user.id), JSON.stringify(draft));
      } catch {
        // ignore
      }
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function addSkill() {
    const v = skillInput.trim();
    if (v && !skills.includes(v)) setSkills((s) => [...s, v]);
    setSkillInput("");
  }
  function removeSkill(skill: string) {
    setSkills((s) => s.filter((x) => x !== skill));
  }
  function onSkillKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    } else if (e.key === "Backspace" && !skillInput && skills.length) {
      removeSkill(skills[skills.length - 1]);
    }
  }

  // المرفقات (خفيفة الحجم)
  const [files, setFiles] = useState<Attachment[]>([]);
  const [fileError, setFileError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError("");
    const list = Array.from(e.target.files ?? []);
    const accepted: Attachment[] = [];
    for (const f of list) {
      if (f.size > MAX_FILE_BYTES) {
        setFileError(`"${f.name}" يتجاوز الحد المسموح (2 ميجابايت).`);
        continue;
      }
      accepted.push({ name: f.name, size: f.size });
    }
    if (accepted.length) setFiles((prev) => [...prev, ...accepted].slice(0, 5));
    if (fileRef.current) fileRef.current.value = "";
  }
  function removeFile(name: string) {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  }

  const skillsLabel = isProducer
    ? "المنتجات / الخدمات"
    : isCompany
      ? "مجالات التوظيف"
      : "المهارات";

  return (
    <div className="mx-auto w-full max-w-[820px] pb-10">
      <h1 className="text-[18px] font-extrabold text-charcoal">ملفي الشخصي</h1>
      <p className="mt-0.5 text-[13px] text-muted">عدّل بياناتك العامة كما تظهر للزوار.</p>

      {/* الصور */}
      <section className="mt-5 overflow-hidden rounded-[16px] border border-line bg-surface">
        <ImagePlaceholder shape="rect" label="صورة الغلاف" className="h-[120px] w-full" />
        <div className="flex items-end gap-4 px-5 pb-5">
          <ImagePlaceholder shape="circle" className="-mt-9 h-[72px] w-[72px] border-[3px] border-surface" />
          <button className="mb-1 cursor-pointer rounded-lg border border-line bg-surface px-3 py-1.5 text-[13px] font-semibold text-charcoal transition-colors hover:bg-cream">
            تغيير الصورة
          </button>
        </div>
      </section>

      <form onSubmit={handleSave} className="mt-4 rounded-[16px] border border-line bg-surface p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">
              {isCompany ? "اسم الشركة" : "الاسم الكامل"}
            </label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">
              {isCompany ? "المجال" : isProducer ? "النشاط" : "المسمى / التخصص"}
            </label>
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isProducer ? "طعام منزلي" : "مطوّر واجهات أمامية"}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">المدينة</label>
            <input
              className={inputClass}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="صبيا"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">رقم واتساب</label>
            <input
              className={inputClass}
              dir="ltr"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="9665XXXXXXXX"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">نبذة تعريفية</label>
            <textarea
              rows={4}
              className={`${inputClass} resize-none`}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="عرّف بنفسك أو بنشاطك…"
            />
          </div>

          {/* المهارات كوسوم */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">{skillsLabel}</label>
            <div className="flex flex-wrap items-center gap-2 rounded-xl border-[1.5px] border-line bg-surface p-2 focus-within:border-jazan">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-full bg-tag px-3 py-1 text-[13px] text-ink"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    aria-label={`حذف ${skill}`}
                    className="cursor-pointer text-muted transition-colors hover:text-danger"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={onSkillKeyDown}
                onBlur={addSkill}
                placeholder={skills.length ? "أضف مهارة…" : "اكتب مهارة واضغط Enter"}
                className="min-w-[140px] flex-1 bg-transparent px-2 py-1 text-[14px] text-charcoal outline-none placeholder:text-[#9aa29d]"
              />
            </div>
            <p className="mt-1.5 text-[12px] text-muted">اكتب كل مهارة واضغط Enter لإضافتها كوسم منفصل.</p>
          </div>

          {/* المرفقات */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">
              المرفقات <span className="font-normal text-muted">(سيرة ذاتية / نماذج أعمال — حتى 2 ميجابايت)</span>
            </label>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-line bg-cream/40 px-4 py-3 text-[13px] font-semibold text-jazan transition-colors hover:border-jazan hover:bg-jazan/[.03]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="M17 8l-5-5-5 5M12 3v12" />
              </svg>
              إرفاق ملف
            </button>
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPT}
              multiple
              onChange={onFiles}
              className="hidden"
            />

            {fileError ? (
              <p className="mt-2 rounded-lg bg-warn/12 px-3 py-2 text-[12px] font-medium text-warn-ink">{fileError}</p>
            ) : null}

            {files.length ? (
              <ul className="mt-2 flex flex-col gap-2">
                {files.map((f) => (
                  <li
                    key={f.name}
                    className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface px-3 py-2"
                  >
                    <span className="min-w-0 flex-1 truncate text-[13px] text-charcoal">{f.name}</span>
                    <span className="mono shrink-0 text-[12px] text-muted">{formatSize(f.size)}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(f.name)}
                      aria-label="حذف الملف"
                      className="shrink-0 cursor-pointer text-muted transition-colors hover:text-danger"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="submit"
            className="cursor-pointer rounded-xl bg-jazan px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-jazan-dark"
          >
            حفظ التغييرات
          </button>
          {saved ? <span className="text-[13px] font-semibold text-success-ink">✓ تم الحفظ</span> : null}
        </div>
      </form>
    </div>
  );
}
