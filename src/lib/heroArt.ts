"use client";

import { useEffect, useState } from "react";
import { createClient } from "./supabase/client";

/**
 * رسمة الهيرو الافتراضية — الصورة التي تظهر في بطاقة الهيرو
 * عندما لا تكون هناك صورة بطل شهر مرفوعة. القيمة الفارغة تعني
 * استخدام الرسمة المدمجة /hero-of-month.svg.
 */

const STORAGE_KEY = "jazanheroes.heroArt";
const CHANGE_EVENT = "jazanheroes:heroArt";
const REMOTE_TABLE = "site_content";
const REMOTE_KEY = "hero_art";

export function loadHeroArt(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return "";
    const parsed = JSON.parse(raw) as { image?: string };
    return typeof parsed.image === "string" ? parsed.image : "";
  } catch {
    return "";
  }
}

export function saveHeroArt(image: string): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ image }));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

export async function fetchHeroArtRemote(): Promise<string | null> {
  const supabase = createClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from(REMOTE_TABLE)
      .select("value")
      .eq("key", REMOTE_KEY)
      .maybeSingle();
    if (error || !data?.value) return null;
    const image = (data.value as { image?: string }).image;
    return typeof image === "string" ? image : null;
  } catch {
    return null;
  }
}

/**
 * Publishes locally (always) and to Supabase when configured.
 * remote: true = published globally, false = Supabase write failed,
 * null = Supabase not configured (demo mode).
 */
export async function publishHeroArt(
  image: string
): Promise<{ local: boolean; remote: boolean | null }> {
  const local = saveHeroArt(image);
  const supabase = createClient();
  if (!supabase) return { local, remote: null };
  try {
    const { error } = await supabase
      .from(REMOTE_TABLE)
      .upsert(
        { key: REMOTE_KEY, value: { image }, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
    return { local, remote: !error };
  } catch {
    return { local, remote: false };
  }
}

export function onHeroArtChange(listener: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

/**
 * `ready` تصبح true بعد حسم الصورة النهائية (المحلية ثم البعيدة)، حتى لا
 * تُعرض الرسمة المدمجة لحظةً ثم تُستبدل بصورة المدير — وميض مزعج للزائر.
 */
export function useHeroArt(): { image: string; ready: boolean } {
  const [value, setValue] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // ١) النسخة المخزّنة محلياً تظهر فوراً — بلا انتظار الشبكة إطلاقاً
    const cached = loadHeroArt();
    if (cached) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setValue(cached);
      setReady(true);
    }

    const update = () => setValue(loadHeroArt());
    const unsubscribe = onHeroArtChange(update);

    // ٢) التحديث من قاعدة البيانات يجري في الخلفية ولا يُبدَّل إلا عند الاختلاف
    let cancelled = false;
    fetchHeroArtRemote()
      .then((remote) => {
        if (cancelled || remote === null) return;
        if (remote !== cached) {
          setValue(remote);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ image: remote }));
          } catch {
            // keep in-memory value only
          }
        }
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return { image: value, ready };
}
