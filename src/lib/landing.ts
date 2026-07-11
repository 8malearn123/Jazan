"use client";

// محتوى الصفحة الرئيسية (Landing) — يحرّره المدير من لوحة الإدارة
// ويظهر مباشرة في الواجهة الرئيسية (النص العربي).

import { useEffect, useState } from "react";

export type LandingContent = {
  tagline: string;
  title1: string;
  title2: string;
  desc: string;
};

/** النص الافتراضي — نفس نصوص الواجهة الحالية */
export const defaultLanding: LandingContent = {
  tagline: "منصة جازان المجتمعية للمواهب",
  title1: "مواهب جازان",
  title2: "تلتقي بالفرص الحقيقية",
  desc: "منصة محلية تربط المستقلين والباحثين عن عمل، والأسر المنتجة والصُنّاع، بالشركات والجهات — تواصل مباشر بضغطة زر.",
};

const STORAGE_KEY = "jazanheroes.landing";
const CHANGE_EVENT = "jazanheroes:landing";

export function loadLanding(): LandingContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultLanding, ...(JSON.parse(raw) as Partial<LandingContent>) } : defaultLanding;
  } catch {
    return defaultLanding;
  }
}

export function saveLanding(content: LandingContent): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // ignore
  }
}

/** المحتوى الحي — يتحدث فور حفظ المدير */
export function useLanding(): LandingContent {
  const [content, setContent] = useState<LandingContent>(defaultLanding);

  useEffect(() => {
    const update = () => setContent(loadLanding());
    update();
    window.addEventListener(CHANGE_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(CHANGE_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return content;
}
