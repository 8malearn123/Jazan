"use client";

import { DownloadIcon } from "@/components/icons";
import { useAuth, roleLabels } from "@/components/auth/AuthProvider";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { approvedReviews, loadReviewModeration } from "@/lib/reviews";

// زر تحميل الملف الشخصي والإحصائيات كـ PDF.
// يولّد تقريراً HTML بهوية المنصة ويفتح نافذة الطباعة (حفظ كـ PDF).

type ProfileDraft = {
  name?: string;
  title?: string;
  city?: string;
  whatsapp?: string;
  bio?: string;
  skills?: string[];
};

// بيانات العرض التجريبية — نفس أرقام لوحة التحكم
const demoStats = [
  { value: "1,240", label: "مشاهدات الملف", delta: "+18%" },
  { value: "86", label: "نقرات واتساب", delta: "+9%" },
  { value: "32", label: "طلبات التواصل", delta: "" },
];

// التقييمات المعتمدة من إدارة المنصة فقط (أحدث 5) — نفس ما يظهر في لوحة التحكم
function reportReviews() {
  return approvedReviews(loadReviewModeration()).slice(0, 5);
}

const demoContacts = [
  { name: "تهامة للتقنية", interest: "مهتم بخدماتك", date: "اليوم" },
  { name: "أبو خالد", interest: "استفسار عن الأسعار", date: "أمس" },
  { name: "واحة جازان الرقمية", interest: "طلب عرض سعر", date: "5 يونيو" },
  { name: "متجر الساحل", interest: "مهتم بالتعاون", date: "1 يونيو" },
];

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function stars(rating: number): string {
  return `<span style="color:#e8932e;letter-spacing:2px;">${"★".repeat(rating)}</span><span style="color:#d9d5cc;letter-spacing:2px;">${"★".repeat(5 - rating)}</span>`;
}

function buildReport(name: string, roleLabel: string, draft: ProfileDraft | null): string {
  const reviews = reportReviews();
  const avg =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "—";
  const today = new Date().toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });

  const infoRows = [
    draft?.title ? `<tr><td class="k">المسمى / النشاط</td><td>${esc(draft.title)}</td></tr>` : "",
    draft?.city ? `<tr><td class="k">المدينة</td><td>${esc(draft.city)}</td></tr>` : "",
    draft?.whatsapp ? `<tr><td class="k">واتساب</td><td dir="ltr">${esc(draft.whatsapp)}</td></tr>` : "",
    draft?.bio ? `<tr><td class="k">نبذة</td><td>${esc(draft.bio)}</td></tr>` : "",
    draft?.skills?.length ? `<tr><td class="k">المهارات</td><td>${draft.skills.map((x) => `<span class="tag">${esc(x)}</span>`).join(" ")}</td></tr>` : "",
  ].join("");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<title>ملف ${esc(name)} — ${esc(site.name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;800&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Alexandria',system-ui,sans-serif;color:#1c2a26;background:#fff;padding:32px 36px;font-size:13px;line-height:1.7}
  .head{display:flex;justify-content:space-between;align-items:center;background:#0f5c4a;color:#fff;border-radius:16px;padding:20px 24px}
  .head .brand{font-size:20px;font-weight:800}
  .head .brand span{color:#e8932e}
  .head .meta{text-align:start;font-size:11px;opacity:.85}
  h1{font-size:22px;font-weight:800;margin-top:22px}
  .sub{color:#6b7770;margin-top:2px}
  .badge{display:inline-block;background:rgba(15,92,74,.1);color:#0f5c4a;border-radius:99px;padding:3px 12px;font-weight:600;font-size:12px;margin-top:6px}
  h2{font-size:15px;font-weight:800;margin:26px 0 10px;color:#0f5c4a;border-bottom:2px solid #e7e2d9;padding-bottom:6px}
  .stats{display:flex;gap:12px}
  .stat{flex:1;border:1.5px solid #e7e2d9;border-radius:14px;padding:14px 16px}
  .stat .v{font-size:22px;font-weight:800;color:#0f5c4a}
  .stat .d{color:#15784a;font-size:11px;font-weight:600}
  .stat .l{color:#6b7770;font-size:12px}
  table{width:100%;border-collapse:collapse}
  td,th{padding:8px 10px;border-bottom:1px solid #f0ede6;text-align:start;vertical-align:top}
  th{color:#6b7770;font-size:11px;font-weight:600;background:#faf8f4}
  td.k{color:#6b7770;width:140px;white-space:nowrap}
  .tag{display:inline-block;background:#f3f0e9;border-radius:7px;padding:2px 10px;font-size:11px;margin-inline-end:4px}
  .review{border:1.5px solid #e7e2d9;border-radius:12px;padding:12px 14px;margin-bottom:10px}
  .review .a{font-weight:800}
  .review .m{color:#6b7770;font-size:11px}
  .avg{font-weight:800;color:#b06a00}
  .foot{margin-top:30px;padding-top:12px;border-top:1px solid #e7e2d9;color:#6b7770;font-size:11px;display:flex;justify-content:space-between}
  @media print{body{padding:0} .head{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style>
</head>
<body>
  <div class="head">
    <div class="brand">★ <span>${esc(site.name)}</span></div>
    <div class="meta">تقرير الملف الشخصي والإحصائيات<br>${esc(today)}</div>
  </div>

  <h1>${esc(name)}</h1>
  <div class="sub">${esc(roleLabel)}</div>
  <span class="badge">✓ الملف معتمد · منشور</span>

  ${infoRows ? `<h2>البيانات الأساسية</h2><table>${infoRows}</table>` : ""}

  <h2>إحصائيات آخر 30 يوم</h2>
  <div class="stats">
    ${demoStats
      .map(
        (s) => `<div class="stat"><div class="v">${s.value}</div><div class="l">${s.label} ${s.delta ? `<span class="d">${s.delta}</span>` : ""}</div></div>`
      )
      .join("")}
  </div>

  <h2>التقييمات <span class="avg">— المتوسط ${avg} من ${reviews.length} تقييمات</span></h2>
  ${reviews
    .map(
      (r) => `<div class="review">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span><span class="a">${esc(r.author)}</span> <span class="m">(${esc(r.type)} · ${esc(r.date)})</span></span>
          <span>${stars(r.rating)}</span>
        </div>
        <div style="margin-top:4px">${esc(r.comment)}</div>
      </div>`
    )
    .join("")}

  <h2>آخر من تواصل معك</h2>
  <table>
    <tr><th>الاسم</th><th>الاهتمام</th><th>التاريخ</th></tr>
    ${demoContacts
      .map((c) => `<tr><td>${esc(c.name)}</td><td>${esc(c.interest)}</td><td>${esc(c.date)}</td></tr>`)
      .join("")}
  </table>

  <div class="foot">
    <span>أُنشئ هذا التقرير من منصة ${esc(site.name)} — ${esc(site.url)}</span>
    <span>${esc(today)}</span>
  </div>

  <script>
    window.onload = function () {
      setTimeout(function () { window.print(); }, 400);
    };
  </script>
</body>
</html>`;
}

export function DownloadPdfButton({ className }: { className?: string }) {
  const { user } = useAuth();

  if (!user || user.role === "admin") return null;

  function download() {
    if (!user) return;
    let draft: ProfileDraft | null = null;
    try {
      draft = JSON.parse(
        localStorage.getItem(`jazanheroes.profile.${user.id}`) ?? "null"
      ) as ProfileDraft | null;
    } catch {
      // ignore
    }
    const html = buildReport(draft?.name || user.name, roleLabels[user.role], draft);
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
  }

  return (
    <button
      type="button"
      onClick={download}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-[11px] border-[1.5px] border-jazan/40 px-3.5 py-2.5 text-sm font-semibold text-jazan transition-colors hover:bg-jazan hover:text-white",
        className
      )}
    >
      <DownloadIcon width={18} height={18} />
      تحميل ملفي PDF
    </button>
  );
}
