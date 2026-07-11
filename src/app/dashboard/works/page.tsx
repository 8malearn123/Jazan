"use client";

import { useEffect, useState } from "react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { XIcon } from "@/components/icons";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/cn";

// أعمالي — إدارة معرض الأعمال: إضافة، تعديل، حذف (تُحفظ محلياً في الوضع التجريبي)

type Work = { id: string; title: string; desc: string };

const seedWorks: Work[] = [
  { id: "w1", title: "واجهة متجر إلكتروني", desc: "تصميم وتطوير واجهة متجر متكاملة." },
  { id: "w2", title: "تصميم هوية بصرية", desc: "هوية كاملة لعلامة محلية ناشئة." },
  { id: "w3", title: "لوحة تحكم", desc: "لوحة إدارة ببيانات مباشرة ورسوم بيانية." },
];

function storageKey(userId: string) {
  return `jazanheroes.works.${userId}`;
}

const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-surface px-3.5 py-2.5 text-[14px] text-charcoal outline-none transition-colors placeholder:text-[#9aa29d] focus:border-jazan";

export default function WorksPage() {
  const { user } = useAuth();
  const [works, setWorks] = useState<Work[]>([]);
  const [loaded, setLoaded] = useState(false);

  // نموذج الإضافة
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // التعديل
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  useEffect(() => {
    if (!user) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(storageKey(user.id));
      setWorks(raw ? (JSON.parse(raw) as Work[]) : seedWorks);
    } catch {
      setWorks(seedWorks);
    }
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [user]);

  function persist(next: Work[]) {
    setWorks(next);
    if (user) {
      try {
        localStorage.setItem(storageKey(user.id), JSON.stringify(next));
      } catch {
        // ignore
      }
    }
  }

  function addWork(e: React.FormEvent) {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    persist([{ id: `w${Date.now()}`, title, desc: newDesc.trim() }, ...works]);
    setNewTitle("");
    setNewDesc("");
  }

  function startEdit(w: Work) {
    setEditId(w.id);
    setEditTitle(w.title);
    setEditDesc(w.desc);
  }

  function saveEdit() {
    if (!editId) return;
    persist(
      works.map((w) =>
        w.id === editId ? { ...w, title: editTitle.trim() || w.title, desc: editDesc.trim() } : w
      )
    );
    setEditId(null);
  }

  function removeWork(id: string) {
    persist(works.filter((w) => w.id !== id));
    if (editId === id) setEditId(null);
  }

  return (
    <div className="mx-auto w-full max-w-[900px] pb-10">
      <h1 className="text-[18px] font-extrabold text-charcoal">أعمالي</h1>
      <p className="mt-0.5 text-[13px] text-muted">
        أضف أعمالك ونماذجك وعدّلها — تظهر في ملفك العام أمام الزوار.
      </p>

      {/* نموذج الإضافة */}
      <form onSubmit={addWork} className="mt-5 rounded-[16px] border border-line bg-surface p-5">
        <h2 className="text-[14px] font-bold text-charcoal">إضافة عمل جديد</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1.4fr_auto]">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="عنوان العمل (مثال: تصميم شعار)"
            className={inputClass}
          />
          <input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="وصف مختصر (اختياري)"
            className={inputClass}
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="cursor-pointer rounded-xl bg-jazan px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-jazan-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            + إضافة
          </button>
        </div>
      </form>

      {/* الشبكة */}
      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-charcoal">
          الأعمال <span className="mono font-medium text-muted">({works.length})</span>
        </h2>
      </div>

      {loaded && works.length === 0 ? (
        <div className="mt-3 rounded-[16px] border border-dashed border-line bg-surface py-14 text-center">
          <p className="text-[15px] font-semibold text-charcoal">لا توجد أعمال بعد</p>
          <p className="mt-1 text-[13px] text-muted">أضف أول عمل من النموذج بالأعلى.</p>
        </div>
      ) : null}

      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {works.map((w) => (
          <div
            key={w.id}
            className="group overflow-hidden rounded-[16px] border border-line bg-surface transition-[border-color] hover:border-jazan/50"
          >
            <div className="relative">
              <ImagePlaceholder shape="rect" label={w.title} className="h-[130px] w-full" />
              <button
                type="button"
                onClick={() => removeWork(w.id)}
                aria-label={`حذف ${w.title}`}
                title="حذف"
                className="absolute end-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-surface/95 text-danger opacity-0 shadow transition-opacity group-hover:opacity-100"
              >
                <XIcon width={15} height={15} />
              </button>
            </div>

            {editId === w.id ? (
              <div className="flex flex-col gap-2 p-3.5">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={inputClass}
                  placeholder="عنوان العمل"
                />
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={2}
                  className={cn(inputClass, "resize-none")}
                  placeholder="وصف مختصر"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="flex-1 cursor-pointer rounded-[10px] bg-jazan px-3 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-jazan-dark"
                  >
                    حفظ
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditId(null)}
                    className="cursor-pointer rounded-[10px] border border-line px-3 py-2 text-[13px] font-semibold text-muted transition-colors hover:bg-cream"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5">
                <h3 className="text-[14px] font-bold text-charcoal">{w.title}</h3>
                {w.desc ? (
                  <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted">{w.desc}</p>
                ) : null}
                <button
                  type="button"
                  onClick={() => startEdit(w)}
                  className="mt-3 w-full cursor-pointer rounded-[10px] border-[1.5px] border-jazan/40 px-3 py-2 text-[13px] font-semibold text-jazan transition-colors hover:bg-jazan hover:text-white"
                >
                  تعديل
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
