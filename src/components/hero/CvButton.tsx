"use client";

import { DownloadIcon } from "@/components/icons";
import { site } from "@/lib/site";
import { useLocale } from "@/lib/i18n";
import type { Hero } from "@/lib/types";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function stars(rating: number): string {
  const full = Math.round(rating);
  return `<span style="color:#e8932e;letter-spacing:2px;">${"★".repeat(full)}</span><span style="color:#d9d5cc;letter-spacing:2px;">${"★".repeat(5 - full)}</span>`;
}

function buildCv(hero: Hero): string {
  const skills = hero.skills.map((s) => `<span class="tag">${esc(s)}</span>`).join(" ");
  const portfolio = (hero.portfolio ?? [])
    .map((p) => `<li>${esc(p.title)}</li>`)
    .join("");
  const reviews = (hero.reviews ?? [])
    .slice(0, 2)
    .map(
      (r) => `<div class="review">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span class="a">${esc(r.author)}</span>
          <span>${stars(r.rating)}</span>
        </div>
        <div style="margin-top:4px">${esc(r.comment)}</div>
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<title>السيرة الذاتية — ${esc(hero.name)} | ${esc(site.name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;800&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Alexandria',system-ui,sans-serif;color:#1c2a26;background:#fff;padding:32px 36px;font-size:13px;line-height:1.8}
  .head{display:flex;justify-content:space-between;align-items:center;background:#0f5c4a;color:#fff;border-radius:16px;padding:20px 24px}
  .head .brand{font-size:18px;font-weight:800}
  .head .brand span{color:#e8932e}
  .head .meta{font-size:11px;opacity:.85}
  h1{font-size:26px;font-weight:800;margin-top:24px}
  .sub{color:#4a5550;font-size:15px;margin-top:2px}
  .meta-row{color:#6b7770;font-size:12px;margin-top:8px}
  h2{font-size:15px;font-weight:800;margin:24px 0 10px;color:#0f5c4a;border-bottom:2px solid #e7e2d9;padding-bottom:6px}
  .tag{display:inline-block;background:#f3f0e9;border-radius:8px;padding:3px 12px;font-size:12px;margin:0 0 6px 6px;font-weight:600}
  ul{padding-inline-start:22px}
  li{margin-bottom:4px}
  .grid{display:flex;gap:12px}
  .cell{flex:1;border:1.5px solid #e7e2d9;border-radius:14px;padding:12px 16px;text-align:center}
  .cell .v{font-size:20px;font-weight:800;color:#0f5c4a}
  .cell .l{color:#6b7770;font-size:11px}
  .review{border:1.5px solid #e7e2d9;border-radius:12px;padding:12px 14px;margin-bottom:10px}
  .review .a{font-weight:800}
  .foot{margin-top:28px;padding-top:12px;border-top:1px solid #e7e2d9;color:#6b7770;font-size:11px;display:flex;justify-content:space-between}
  .print-btn{position:fixed;bottom:20px;inset-inline-start:20px;background:#0f5c4a;color:#fff;border:0;border-radius:12px;padding:12px 22px;font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 8px 22px rgba(15,92,74,.35)}
  @media print{body{padding:0} .print-btn{display:none} .head{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style>
</head>
<body>
  <div class="head">
    <div class="brand">★ <span>${esc(site.name)}</span></div>
    <div class="meta">السيرة الذاتية</div>
  </div>

  <h1>${esc(hero.name)}</h1>
  <div class="sub">${esc(hero.title)}</div>
  <div class="meta-row">📍 ${esc(hero.city)}، منطقة جازان${hero.verified ? " · ✓ ملف موثّق" : ""}</div>

  <div class="grid" style="margin-top:18px">
    ${hero.years != null ? `<div class="cell"><div class="v">+${hero.years}</div><div class="l">سنوات الخبرة</div></div>` : ""}
    <div class="cell"><div class="v">${hero.skills.length}</div><div class="l">المهارات</div></div>
    ${hero.rating != null ? `<div class="cell"><div class="v">${hero.rating.toFixed(1)}</div><div class="l">التقييم من 5</div></div>` : ""}
    ${hero.reviewsCount != null ? `<div class="cell"><div class="v">${hero.reviewsCount}</div><div class="l">تقييم موثّق</div></div>` : ""}
  </div>

  ${hero.bio ? `<h2>نبذة</h2><p>${esc(hero.bio)}</p>` : ""}

  <h2>المهارات</h2>
  <div>${skills}</div>

  ${portfolio ? `<h2>معرض الأعمال</h2><ul>${portfolio}</ul>` : ""}

  ${reviews ? `<h2>آراء العملاء</h2>${reviews}` : ""}

  <div class="foot">
    <span>الملف العام: ${esc(site.url ?? "jazan.vercel.app")}/heroes/${esc(hero.id)}</span>
    <span>${esc(site.name)} — منصة جازان المجتمعية للمواهب</span>
  </div>

  <button class="print-btn" onclick="window.print()">⬇ تحميل PDF</button>
</body>
</html>`;
}

export function CvButton({ hero }: { hero: Hero }) {
  const { d } = useLocale();

  function openCv() {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(buildCv(hero));
    w.document.close();
  }

  return (
    <button
      type="button"
      onClick={openCv}
      className="inline-flex w-full flex-none cursor-pointer items-center justify-center gap-2.5 rounded-xl border-[1.5px] border-jazan bg-surface px-6 py-3 text-[15px] font-bold text-jazan transition-[transform,background-color,color] hover:-translate-y-px hover:bg-jazan hover:text-white sm:w-auto"
    >
      <DownloadIcon className="h-[18px] w-[18px]" />
      {d.heroPage.cvBtn}
    </button>
  );
}
