"use client";

// صور الحساب (البروفايل + الغلاف) — يغيّرها صاحب الحساب من ملفه الشخصي
// وتظهر في لوحته وصفحته العامة. تُحفظ محلياً مضغوطة في الوضع التجريبي.

import { useEffect, useState } from "react";
import { demoUserForPublicProfile } from "./social";

export type ProfilePhotos = {
  avatar?: string;
  cover?: string;
};

const PHOTOS_PREFIX = "jazanheroes.photos.";
const PHOTOS_EVENT = "jazanheroes:photos";

export function loadPhotos(userId: string): ProfilePhotos {
  try {
    const raw = localStorage.getItem(PHOTOS_PREFIX + userId);
    return raw ? (JSON.parse(raw) as ProfilePhotos) : {};
  } catch {
    return {};
  }
}

export function savePhotos(userId: string, photos: ProfilePhotos): boolean {
  try {
    localStorage.setItem(PHOTOS_PREFIX + userId, JSON.stringify(photos));
    window.dispatchEvent(new Event(PHOTOS_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function onPhotosChange(listener: () => void): () => void {
  window.addEventListener(PHOTOS_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(PHOTOS_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

/** صور حساب المستخدم الحالي — تتحدث لحظياً */
export function usePhotos(userId: string | undefined): ProfilePhotos {
  const [photos, setPhotos] = useState<ProfilePhotos>({});
  useEffect(() => {
    if (!userId) return;
    const update = () => setPhotos(loadPhotos(userId));
    update();
    return onPhotosChange(update);
  }, [userId]);
  return photos;
}

/** صور الملف العام — عبر ربط الملفات التجريبية بحسابات الديمو */
export function usePublicPhotos(profileId: string): ProfilePhotos {
  const [photos, setPhotos] = useState<ProfilePhotos>({});
  useEffect(() => {
    const demoUser = demoUserForPublicProfile(profileId);
    if (!demoUser) return;
    const update = () => setPhotos(loadPhotos(demoUser));
    update();
    return onPhotosChange(update);
  }, [profileId]);
  return photos;
}

/**
 * تحويل ملف صورة إلى Data URL مضغوط حتى لا يتجاوز سعة التخزين المحلي.
 * @param maxDim أقصى بُعد بالبكسل (400 للبروفايل، 1400 للغلاف)
 */
export function imageFileToDataUrl(file: File, maxDim: number): Promise<string> {
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
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}
