"use client";

import { useEffect, useState } from "react";
import { site } from "./site";

export type SiteSocialLinks = {
  whatsapp: string;
  instagram: string;
  youtube: string;
};

const STORAGE_KEY = "jazanheroes.site.social";
const CHANGE_EVENT = "jazanheroes:site-social";

export const defaultSiteSocial: SiteSocialLinks = {
  whatsapp: `https://wa.me/${site.whatsapp}`,
  instagram: "https://instagram.com/jazanheroes",
  youtube: "https://youtube.com/@jazanheroes",
};

export function loadSiteSocial(): SiteSocialLinks {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultSiteSocial, ...(JSON.parse(raw) as Partial<SiteSocialLinks>) } : defaultSiteSocial;
  } catch {
    return defaultSiteSocial;
  }
}

export function saveSiteSocial(links: SiteSocialLinks): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // ignore
  }
}

export function useSiteSocial(): SiteSocialLinks {
  const [links, setLinks] = useState<SiteSocialLinks>(defaultSiteSocial);

  useEffect(() => {
    const update = () => setLinks(loadSiteSocial());
    update();
    window.addEventListener(CHANGE_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(CHANGE_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return links;
}
