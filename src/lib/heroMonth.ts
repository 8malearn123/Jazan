"use client";

import { useEffect, useState } from "react";

export type HeroOfMonth = {
  name: string;
  title: string;
  month: string;
  image: string;
};

export const defaultHeroOfMonth: HeroOfMonth = {
  name: "أحمد عقيلي",
  title: "مطوّر واجهات — الأكثر تفاعلاً في المنصة",
  month: "",
  image: "",
};

const STORAGE_KEY = "jazanheroes.heroMonth";
const CHANGE_EVENT = "jazanheroes:heroMonth";

export function currentMonthLabel(): string {
  try {
    return new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
      month: "long",
      year: "numeric",
    }).format(new Date());
  } catch {
    return "";
  }
}

export function loadHeroOfMonth(): HeroOfMonth {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultHeroOfMonth;
    return { ...defaultHeroOfMonth, ...(JSON.parse(raw) as Partial<HeroOfMonth>) };
  } catch {
    return defaultHeroOfMonth;
  }
}

export function saveHeroOfMonth(value: HeroOfMonth): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function onHeroOfMonthChange(listener: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function useHeroOfMonth(): HeroOfMonth {
  const [value, setValue] = useState<HeroOfMonth>(defaultHeroOfMonth);
  useEffect(() => {
    const update = () => setValue(loadHeroOfMonth());
    update();
    return onHeroOfMonthChange(update);
  }, []);
  return value;
}
