"use client";

import { useState } from "react";
import Link from "next/link";

type Applicant = { id: string; name: string; title: string; date: string };
type Job = {
  id: string;
  title: string;
  city: string;
  type: string;
  tags: string[];
  open: boolean;
  applicants: Applicant[];
};

const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-surface px-3.5 py-2.5 text-[14px] text-charcoal outline-none transition-colors placeholder:text-[#9aa29d] focus:border-jazan focus:shadow-[0_0_0_4px_rgba(15,92,74,.08)]";

const jobTypes = ["دوام كامل", "دوام جزئي", "عن بُعد", "عقد مستقل"];

const initialJobs: Job[] = [
  {
    id: "j1",
    title: "مطوّر واجهات أمامية",
    city: "جيزان",
    type: "دوام كامل",
    tags: ["React", "TypeScript"],
    open: true,
    applicants: [
      { id: "h1", name: "محمد عسيري", title: "مطوّر واجهات", date: "اليوم" },
      { id: "h6", name: "سارة مدخلي", title: "مطوّرة واجهات", date: "أمس" },
    ],
  },
  {
    id: "j2",
    title: "مصمّم UI/UX",
    city: "عن بُعد",
    type: "عن بُعد",
    tags: ["Figma"],
    open: true,
    applicants: [{ id: "h2", name: "نورة حكمي", title: "مصمّمة هوية", date: "قبل 3 أيام" }],
  },
];

export default function JobsManagementPage() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", city: "", type: jobTypes[0], tags: "" });
  const [toast, setToast] = useState("");

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function addJob(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.city.trim()) return;
    const job: Job = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      city: form.city.trim(),
      type: form.type,
      tags: form.tags.split(/[,،]/).map((t) => t.trim()).filter(Boolean),
      open: true,
      applicants: [],
    };
    setJobs((list) => [job, ...list]);
    setForm({ title: "", city: "", type: jobTypes[0], tags: "" });
    flash("تم نشر الوظيفة");
  }

  function toggleOpen(id: string) {
    setJobs((list) => list.map((j) => (j.id === id ? { ...j, open: !j.open } : j)));
  }
  function removeJob(id: string) {
    setJobs((list) => list.filter((j) => j.id !== id));
    flash("تم حذف الوظيفة");
  }

  return (
    <div className="mx-auto w-full max-w-[1000px] space-y-5 pb-10">
      <div>
        <h1 className="text-[18px] font-extrabold text-charcoal">إدارة الوظائف</h1>
        <p className="mt-0.5 text-[13px] text-muted">انشر فرصك الوظيفية وتابع المتقدّمين عليها.</p>
      </div>

      {toast ? (
        <div className="rounded-xl bg-success/12 px-4 py-2.5 text-[13px] font-semibold text-success-ink">
          ✓ {toast}
        </div>
      ) : null}

      {/* نموذج إضافة وظيفة */}
      <form onSubmit={addJob} className="rounded-[16px] border border-line bg-surface p-5">
        <h2 className="text-[15px] font-bold text-charcoal">نشر وظيفة جديدة</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">المسمى الوظيفي</label>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="مطوّر واجهات أمامية"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">المدينة</label>
            <input
              className={inputClass}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="جيزان"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">نوع الدوام</label>
            <select
              className={inputClass}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {jobTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">المهارات المطلوبة</label>
            <input
              className={inputClass}
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="React، TypeScript (افصل بفاصلة)"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 cursor-pointer rounded-xl bg-jazan px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-jazan-dark"
        >
          نشر الوظيفة
        </button>
      </form>

      {/* قائمة الوظائف */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-charcoal">وظائفي المنشورة</h2>
          <span className="text-[13px] text-muted">
            <span className="mono font-semibold text-charcoal">{jobs.length}</span> وظيفة
          </span>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-[16px] border border-dashed border-line bg-surface py-12 text-center text-[14px] text-muted">
            لا توجد وظائف بعد — انشر أول وظيفة من الأعلى.
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="overflow-hidden rounded-[16px] border border-line bg-surface">
              <div className="flex flex-wrap items-start justify-between gap-3 p-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-[16px] font-bold text-charcoal">{job.title}</h3>
                    {job.open ? (
                      <span className="rounded-full bg-success/12 px-2.5 py-1 text-[11px] font-semibold text-success-ink">منشورة</span>
                    ) : (
                      <span className="rounded-full bg-muted/14 px-2.5 py-1 text-[11px] font-semibold text-muted">مغلقة</span>
                    )}
                  </div>
                  <div className="mt-1.5 text-[13px] text-muted">
                    {job.type} · {job.city}
                  </div>
                  {job.tags.length ? (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {job.tags.map((t) => (
                        <span key={t} className="rounded-[7px] bg-tag px-2.5 py-1 text-[11px] text-ink">{t}</span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                    className="cursor-pointer rounded-lg border border-line bg-surface px-3 py-1.5 text-[12px] font-semibold text-charcoal transition-colors hover:bg-cream"
                  >
                    المتقدّمون (<span className="mono">{job.applicants.length}</span>)
                  </button>
                  <button
                    onClick={() => toggleOpen(job.id)}
                    className="cursor-pointer rounded-lg border border-line bg-surface px-3 py-1.5 text-[12px] font-semibold text-charcoal transition-colors hover:bg-cream"
                  >
                    {job.open ? "إغلاق" : "إعادة فتح"}
                  </button>
                  <button
                    onClick={() => removeJob(job.id)}
                    className="cursor-pointer rounded-lg border border-danger-line bg-surface px-3 py-1.5 text-[12px] font-semibold text-danger transition-colors hover:bg-danger-soft"
                  >
                    حذف
                  </button>
                </div>
              </div>

              {/* المتقدّمون */}
              {expanded === job.id ? (
                <div className="border-t border-line bg-cream/40 p-5">
                  <div className="text-[13px] font-bold text-charcoal">المتقدّمون على هذه الوظيفة</div>
                  {job.applicants.length === 0 ? (
                    <p className="mt-2 text-[13px] text-muted">لا يوجد متقدّمون بعد.</p>
                  ) : (
                    <div className="mt-3 flex flex-col gap-2">
                      {job.applicants.map((a, i) => (
                        <div key={i} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-2.5">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-jazan/10 text-[13px] font-bold text-jazan">
                              {a.name.charAt(0)}
                            </span>
                            <div>
                              <div className="text-[14px] font-bold text-charcoal">{a.name}</div>
                              <div className="text-[12px] text-muted">{a.title} · تقدّم {a.date}</div>
                            </div>
                          </div>
                          <Link
                            href={`/heroes/${a.id}`}
                            className="cursor-pointer rounded-lg border border-line bg-surface px-3 py-1.5 text-[12px] font-semibold text-charcoal no-underline transition-colors hover:bg-cream"
                          >
                            عرض الملف
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
