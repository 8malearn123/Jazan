"use client";

import { useEffect, useState } from "react";
import { XIcon, ImagesIcon } from "@/components/icons";
import { AdminPageHead } from "../_components/AdminTable";
import {
  createSponsor,
  deleteSponsor,
  fetchSponsors,
  updateSponsor,
  type SponsorItem,
} from "@/lib/sponsors";

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
      // PNG يحافظ على شفافية الشعارات
      if (file.type === "image/png") resolve(canvas.toDataURL("image/png"));
      else resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}

const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-surface px-3.5 py-2.5 text-[14px] text-charcoal outline-none transition-colors placeholder:text-[#9aa29d] focus:border-jazan";

export default function AdminSponsorsPage() {
  const [list, setList] = useState<SponsorItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState<string | null>(null);

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editLogo, setEditLogo] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSponsors().then((items) => {
      if (cancelled) return;
      setList(items);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function pickLogo(e: React.ChangeEvent<HTMLInputElement>, set: (v: string) => void) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      set(await imageFileToDataUrl(file, 600));
      setError("");
    } catch {
      setError("تعذّرت قراءة الصورة — جرّب ملفاً آخر (PNG أو JPG).");
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    setError("");
    const created = await createSponsor({
      name: trimmed,
      logo: logo ?? undefined,
      website: website.trim() || undefined,
    });
    setBusy(false);
    if (!created) {
      setError(
        "تعذّرت الإضافة — تأكد من تنفيذ ملف supabase/sponsors.sql، ومن أن حسابك مشرف."
      );
      return;
    }
    setList((prev) => [...prev, created]);
    setName("");
    setWebsite("");
    setLogo(null);
  }

  function startEdit(s: SponsorItem) {
    setEditId(s.id);
    setEditName(s.name);
    setEditWebsite(s.website ?? "");
    setEditLogo(s.logo ?? null);
  }

  async function saveEdit() {
    if (!editId) return;
    const next = {
      name: editName.trim() || "راعٍ",
      logo: editLogo ?? undefined,
      website: editWebsite.trim() || undefined,
    };
    const ok = await updateSponsor(editId, next);
    if (!ok) {
      setError("تعذّر الحفظ — أعد المحاولة.");
      return;
    }
    setList((prev) => prev.map((s) => (s.id === editId ? { ...s, ...next } : s)));
    setEditId(null);
  }

  async function remove(id: string) {
    const ok = await deleteSponsor(id);
    if (!ok) {
      setError("تعذّر الحذف — أعد المحاولة.");
      return;
    }
    setList((prev) => prev.filter((s) => s.id !== id));
    if (editId === id) setEditId(null);
  }

  return (
    <div className="mx-auto w-full max-w-[900px] space-y-5">
      <AdminPageHead
        title="الرعاة"
        subtitle="أضف رعاة المنصة وشعاراتهم — يظهرون في قسم الرعاة بالصفحة الرئيسية"
      />

      <form onSubmit={handleAdd} className="rounded-[16px] border border-line bg-surface p-5">
        <h2 className="text-[14px] font-bold text-charcoal">إضافة راعٍ جديد</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم الراعي"
            className={inputClass}
          />
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            dir="ltr"
            placeholder="https://example.com (اختياري)"
            className={`text-start ${inputClass}`}
          />
          <button
            type="submit"
            disabled={!name.trim() || busy}
            className="cursor-pointer rounded-xl bg-jazan px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-jazan-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "…" : "+ إضافة"}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-[1.5px] border-line bg-surface px-4 py-2 text-[13px] font-semibold text-charcoal transition-colors hover:border-jazan hover:text-jazan">
            <ImagesIcon width={16} height={16} />
            {logo ? "تغيير الشعار" : "إضافة شعار"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => pickLogo(e, (v) => setLogo(v))}
            />
          </label>
          {logo ? (
            <span className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo}
                alt="معاينة الشعار"
                className="h-14 w-24 rounded-[10px] border border-line bg-cream object-contain p-1"
              />
              <button
                type="button"
                onClick={() => setLogo(null)}
                aria-label="إزالة الشعار"
                className="absolute -end-2 -top-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-danger text-white shadow"
              >
                <XIcon width={11} height={11} />
              </button>
            </span>
          ) : (
            <span className="text-[12px] text-muted">
              يُفضَّل شعار PNG بخلفية شفافة — يظهر في الصفحة الرئيسية.
            </span>
          )}
        </div>

        {error ? (
          <p className="mt-3 rounded-lg bg-warn/12 px-3 py-2 text-[13px] font-medium text-warn-ink">
            {error}
          </p>
        ) : null}
      </form>

      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-charcoal">
          الرعاة <span className="mono font-medium text-muted">({list.length})</span>
        </h2>
      </div>

      {loaded && list.length === 0 ? (
        <div className="rounded-[16px] border border-dashed border-line bg-surface py-14 text-center">
          <p className="text-[15px] font-semibold text-charcoal">لا يوجد رعاة بعد</p>
          <p className="mt-1 text-[13px] text-muted">أضف أول راعٍ من النموذج بالأعلى.</p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <div
            key={s.id}
            className="group overflow-hidden rounded-[16px] border border-line bg-surface transition-[border-color] hover:border-jazan/50"
          >
            <div className="relative flex h-[120px] items-center justify-center bg-cream p-4">
              {(editId === s.id ? editLogo : s.logo) ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={(editId === s.id ? editLogo : s.logo) as string}
                  alt={s.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-[13px] font-semibold text-muted">{s.name}</span>
              )}
              <button
                type="button"
                onClick={() => remove(s.id)}
                aria-label={`حذف ${s.name}`}
                title="حذف"
                className="absolute end-2 top-2 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-surface/95 text-danger opacity-0 shadow transition-opacity group-hover:opacity-100"
              >
                <XIcon width={15} height={15} />
              </button>
            </div>

            {editId === s.id ? (
              <div className="flex flex-col gap-2 p-3.5">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={inputClass}
                  placeholder="اسم الراعي"
                />
                <input
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  dir="ltr"
                  className={`text-start ${inputClass}`}
                  placeholder="https://example.com"
                />
                <label className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border-[1.5px] border-line bg-surface px-3 py-2 text-[12px] font-semibold text-charcoal transition-colors hover:border-jazan hover:text-jazan">
                  <ImagesIcon width={14} height={14} />
                  {editLogo ? "تغيير الشعار" : "إضافة شعار"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => pickLogo(e, (v) => setEditLogo(v))}
                  />
                </label>
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
                <h3 className="text-[14px] font-bold text-charcoal">{s.name}</h3>
                {s.website ? (
                  <p className="mono mt-0.5 truncate text-[11px] text-muted" dir="ltr">
                    {s.website}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => startEdit(s)}
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
