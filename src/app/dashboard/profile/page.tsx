"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ImagesIcon, XIcon } from "@/components/icons";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  loadPhotos,
  savePhotos,
  imageFileToDataUrl,
  type ProfilePhotos,
} from "@/lib/photos";
import {
  fetchOwnProfile,
  saveOwnProfile,
  savePhotoRemote,
  fetchHeroDetails,
  saveHeroDetails,
  type HeroCert,
  type HeroService,
  type HeroTimelineEntry,
} from "@/lib/members";
import type { UserRole } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-surface px-3.5 py-2.5 text-[14px] text-charcoal outline-none transition-colors placeholder:text-[#9aa29d] focus:border-jazan focus:shadow-[0_0_0_4px_rgba(15,92,74,.08)]";

const MAX_FILE_BYTES = 2 * 1024 * 1024;
const ACCEPT = ".pdf,.png,.jpg,.jpeg";

type Attachment = { name: string; size: number };

type ProfileDraft = {
  name: string;
  title: string;
  city: string;
  whatsapp: string;
  bio: string;
  skills: string[];
};

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

  const [photos, setPhotos] = useState<ProfilePhotos>({});
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    if (!user) return;
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setPhotos(loadPhotos(user.id));
  }, [user]);

  async function pickPhoto(
    e: React.ChangeEvent<HTMLInputElement>,
    kind: "avatar" | "cover"
  ) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) return;
    try {
      const dataUrl = await imageFileToDataUrl(file, kind === "avatar" ? 400 : 1400);
      const next = { ...photos, [kind]: dataUrl };
      if (savePhotos(user.id, next)) {
        setPhotos(next);
        setPhotoError("");
      } else {
        setPhotoError("مساحة التخزين امتلأت — جرّب صورة أصغر.");
      }
      savePhotoRemote(user.id, kind, dataUrl);
    } catch {
      setPhotoError("تعذّرت قراءة الصورة — جرّب ملفاً آخر (JPG أو PNG).");
    }
  }

  function removePhoto(kind: "avatar" | "cover") {
    if (!user) return;
    const next = { ...photos };
    delete next[kind];
    savePhotos(user.id, next);
    setPhotos(next);
    savePhotoRemote(user.id, kind, null);
  }

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState("both");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const [availabilityText, setAvailabilityText] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [services, setServices] = useState<HeroService[]>([]);
  const [timeline, setTimeline] = useState<HeroTimelineEntry[]>([]);
  const [certs, setCerts] = useState<HeroCert[]>([]);

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
      } else {
        setName(user.name);
        setSkills(seedSkills[user.role]);
      }
    } catch {
      setName(user.name);
      setSkills(seedSkills[user.role]);
    }
    /* eslint-enable react-hooks/set-state-in-effect */

    // بيانات قاعدة البيانات (إن وُجدت) تتقدّم على المسودة المحلية
    let cancelled = false;
    fetchOwnProfile(user.id).then((remote) => {
      if (!remote || cancelled) return;
      if (remote.name) setName(remote.name);
      if (remote.title) setTitle(remote.title);
      if (remote.city) setCity(remote.city);
      if (remote.whatsapp) setWhatsapp(remote.whatsapp);
      if (remote.bio) setBio(remote.bio);
      if (remote.status) setStatus(remote.status);
      if (remote.skills && remote.skills.length) setSkills(remote.skills);
    });
    if (user.role === "hero") {
      fetchHeroDetails(user.id).then((dts) => {
        if (!dts || cancelled) return;
        setAvailabilityText(dts.availabilityText ?? "");
        setCvUrl(dts.cvUrl ?? "");
        setServices(dts.services ?? []);
        setTimeline(dts.timeline ?? []);
        setCerts(dts.certs ?? []);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user || saving) return;
    setSaving(true);
    setSaveError("");
    const draft: ProfileDraft = { name, title, city, whatsapp, bio, skills };
    try {
      localStorage.setItem(storageKey(user.id), JSON.stringify(draft));
    } catch {
      // ignore
    }
    const remote = await saveOwnProfile(user.id, user.role, {
      name,
      city,
      whatsapp,
      bio,
      title,
      status,
      skills,
    });
    let detailsOk: boolean | null = true;
    if (user.role === "hero") {
      detailsOk = await saveHeroDetails(user.id, {
        availabilityText: availabilityText.trim() || undefined,
        cvUrl: cvUrl.trim() || undefined,
        services: services.filter((s) => s.name.trim()),
        timeline: timeline.filter((t) => t.role.trim()),
        certs: certs.filter((c) => c.name.trim()),
      });
    }
    setSaving(false);
    if (remote === false || detailsOk === false) {
      setSaveError(
        "حُفظ محلياً لكن تعذّر الحفظ في قاعدة البيانات — أعد المحاولة أو تأكد من اتصالك."
      );
      return;
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

      <section className="mt-5 overflow-hidden rounded-[16px] border border-line bg-surface">
        <div className="relative">
          {photos.cover ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={photos.cover} alt="صورة الغلاف" className="h-[120px] w-full object-cover" />
          ) : (
            <ImagePlaceholder shape="rect" label="صورة الغلاف" className="h-[120px] w-full" />
          )}
          <div className="absolute end-3 top-3 flex items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-surface/95 px-3 py-1.5 text-[12px] font-semibold text-charcoal shadow transition-colors hover:border-jazan hover:text-jazan">
              <ImagesIcon width={14} height={14} />
              {photos.cover ? "تغيير الغلاف" : "إضافة غلاف"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => pickPhoto(e, "cover")} />
            </label>
            {photos.cover ? (
              <button
                type="button"
                onClick={() => removePhoto("cover")}
                aria-label="حذف الغلاف"
                title="حذف الغلاف"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border border-danger-line bg-surface/95 text-danger shadow transition-colors hover:bg-danger-soft"
              >
                <XIcon width={13} height={13} />
              </button>
            ) : null}
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-4 px-5 pb-5">
          <span className="relative inline-block">
            {photos.avatar ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={photos.avatar}
                alt="الصورة الشخصية"
                className="-mt-9 h-[72px] w-[72px] rounded-full border-[3px] border-surface object-cover shadow"
              />
            ) : (
              <ImagePlaceholder shape="circle" className="-mt-9 h-[72px] w-[72px] border-[3px] border-surface" />
            )}
            {photos.avatar ? (
              <button
                type="button"
                onClick={() => removePhoto("avatar")}
                aria-label="حذف الصورة الشخصية"
                title="حذف الصورة الشخصية"
                className="absolute -end-1 -top-8 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-danger text-white shadow"
              >
                <XIcon width={10} height={10} />
              </button>
            ) : null}
          </span>
          <label className="mb-1 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-[13px] font-semibold text-charcoal transition-colors hover:border-jazan hover:text-jazan">
            <ImagesIcon width={14} height={14} />
            {photos.avatar ? "تغيير الصورة" : "إضافة صورة"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => pickPhoto(e, "avatar")} />
          </label>
          <span className="mb-1.5 text-[12px] text-muted">تُحفظ فوراً وتظهر في صفحتك العامة.</span>
        </div>
        {photoError ? (
          <p className="border-t border-line px-5 py-2.5 text-[12px] font-semibold text-danger">{photoError}</p>
        ) : null}
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
          {!isCompany && !isProducer ? (
            <>
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">
                  حالة التوفر <span className="font-normal text-muted">— تظهر شارةً في ملفك العام</span>
                </label>
                <select
                  className={`${inputClass} cursor-pointer`}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="freelance">متاح للعمل الحر</option>
                  <option value="job">أبحث عن وظيفة</option>
                  <option value="both">متاح للاثنين — عمل حر ووظيفة</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">
                  أوقات التوفر <span className="font-normal text-muted">(اختياري)</span>
                </label>
                <input
                  className={inputClass}
                  value={availabilityText}
                  onChange={(e) => setAvailabilityText(e.target.value)}
                  placeholder="مثال: السبت–الخميس · ٤–١٠ مساءً"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">
                  رابط السيرة الذاتية <span className="font-normal text-muted">(اختياري — يظهر زراً في صفحتك)</span>
                </label>
                <input
                  className={inputClass}
                  dir="ltr"
                  value={cvUrl}
                  onChange={(e) => setCvUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="sm:col-span-2 rounded-[14px] border border-line bg-cream/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-charcoal">
                    الخدمات والأسعار <span className="font-normal text-muted">— تظهر قسماً في صفحتك العامة</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setServices((s) => [...s, { name: "", desc: "", price: "" }])}
                    className="cursor-pointer rounded-[10px] border-[1.5px] border-jazan/40 px-3 py-1.5 text-[12px] font-semibold text-jazan transition-colors hover:bg-jazan hover:text-white"
                  >
                    + خدمة
                  </button>
                </div>
                {services.map((s, i) => (
                  <div key={i} className="mt-3 grid gap-2 sm:grid-cols-[1fr_1.6fr_.5fr_auto]">
                    <input
                      className={inputClass}
                      value={s.name}
                      onChange={(e) =>
                        setServices((list) => list.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                      }
                      placeholder="اسم الخدمة"
                    />
                    <input
                      className={inputClass}
                      value={s.desc}
                      onChange={(e) =>
                        setServices((list) => list.map((x, j) => (j === i ? { ...x, desc: e.target.value } : x)))
                      }
                      placeholder="وصف مختصر"
                    />
                    <input
                      className={inputClass}
                      value={s.price}
                      onChange={(e) =>
                        setServices((list) => list.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)))
                      }
                      placeholder="السعر"
                    />
                    <button
                      type="button"
                      onClick={() => setServices((list) => list.filter((_, j) => j !== i))}
                      aria-label="حذف الخدمة"
                      className="cursor-pointer rounded-[10px] border border-danger-line px-3 text-[13px] font-semibold text-danger transition-colors hover:bg-danger-soft"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="sm:col-span-2 rounded-[14px] border border-line bg-cream/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-charcoal">
                    الخبرات <span className="font-normal text-muted">— خط زمني في صفحتك العامة</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setTimeline((t) => [...t, { years: "", role: "", desc: "" }])}
                    className="cursor-pointer rounded-[10px] border-[1.5px] border-jazan/40 px-3 py-1.5 text-[12px] font-semibold text-jazan transition-colors hover:bg-jazan hover:text-white"
                  >
                    + خبرة
                  </button>
                </div>
                {timeline.map((t, i) => (
                  <div key={i} className="mt-3 grid gap-2 sm:grid-cols-[.6fr_1fr_1.4fr_auto]">
                    <input
                      className={inputClass}
                      value={t.years}
                      onChange={(e) =>
                        setTimeline((list) => list.map((x, j) => (j === i ? { ...x, years: e.target.value } : x)))
                      }
                      placeholder="2022 — 2024"
                    />
                    <input
                      className={inputClass}
                      value={t.role}
                      onChange={(e) =>
                        setTimeline((list) => list.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))
                      }
                      placeholder="المسمى / الدور"
                    />
                    <input
                      className={inputClass}
                      value={t.desc}
                      onChange={(e) =>
                        setTimeline((list) => list.map((x, j) => (j === i ? { ...x, desc: e.target.value } : x)))
                      }
                      placeholder="وصف مختصر"
                    />
                    <button
                      type="button"
                      onClick={() => setTimeline((list) => list.filter((_, j) => j !== i))}
                      aria-label="حذف الخبرة"
                      className="cursor-pointer rounded-[10px] border border-danger-line px-3 text-[13px] font-semibold text-danger transition-colors hover:bg-danger-soft"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="sm:col-span-2 rounded-[14px] border border-line bg-cream/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-charcoal">
                    الشهادات والاعتمادات <span className="font-normal text-muted">(اختياري)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setCerts((c) => [...c, { name: "", year: "" }])}
                    className="cursor-pointer rounded-[10px] border-[1.5px] border-jazan/40 px-3 py-1.5 text-[12px] font-semibold text-jazan transition-colors hover:bg-jazan hover:text-white"
                  >
                    + شهادة
                  </button>
                </div>
                {certs.map((c, i) => (
                  <div key={i} className="mt-3 grid gap-2 sm:grid-cols-[1.6fr_.5fr_auto]">
                    <input
                      className={inputClass}
                      value={c.name}
                      onChange={(e) =>
                        setCerts((list) => list.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                      }
                      placeholder="اسم الشهادة أو الاعتماد"
                    />
                    <input
                      className={inputClass}
                      value={c.year}
                      onChange={(e) =>
                        setCerts((list) => list.map((x, j) => (j === i ? { ...x, year: e.target.value } : x)))
                      }
                      placeholder="السنة"
                    />
                    <button
                      type="button"
                      onClick={() => setCerts((list) => list.filter((_, j) => j !== i))}
                      aria-label="حذف الشهادة"
                      className="cursor-pointer rounded-[10px] border border-danger-line px-3 text-[13px] font-semibold text-danger transition-colors hover:bg-danger-soft"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : null}
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

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="cursor-pointer rounded-xl bg-jazan px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-jazan-dark disabled:opacity-60"
          >
            {saving ? "جارٍ الحفظ…" : "حفظ التغييرات"}
          </button>
          {saved ? (
            <span className="text-[13px] font-semibold text-success-ink">
              ✓ تم الحفظ — يظهر في ملفك العام لجميع الزوار
            </span>
          ) : null}
          {saveError ? (
            <span className="rounded-lg bg-warn/12 px-3 py-2 text-[13px] font-medium text-warn-ink">
              {saveError}
            </span>
          ) : null}
        </div>
      </form>
    </div>
  );
}
