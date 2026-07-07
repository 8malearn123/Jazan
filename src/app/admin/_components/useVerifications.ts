"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pendingVerifications } from "@/lib/data";
import type { PendingVerification } from "@/lib/types";

// حالة موحّدة لطلبات التوثيق في لوحة المشرف.
// القرارات تُحفظ في localStorage (الوضع التجريبي) لتبقى متسقة
// بين لوحة المعلومات وصفحة التوثيق وصفحة المعاينة.

const STORAGE_KEY = "jazanheroes.admin.verifications";

type Decision = "approved" | "rejected";
type Decisions = Record<string, Decision>;

function loadDecisions(): Decisions {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Decisions) : {};
  } catch {
    return {};
  }
}

export function useVerifications() {
  const [decisions, setDecisions] = useState<Decisions>({});
  const [toast, setToast] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setDecisions(loadDecisions());
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const resolve = useCallback((id: string, accepted: boolean) => {
    const row = pendingVerifications.find((p) => p.id === id);
    setDecisions((prev) => {
      const next: Decisions = { ...prev, [id]: accepted ? "approved" : "rejected" };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    setToast(`${accepted ? "تم قبول" : "تم رفض"} طلب ${row?.name ?? ""}`);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2500);
  }, []);

  const pending: PendingVerification[] = pendingVerifications.filter(
    (p) => !decisions[p.id]
  );

  return { pending, resolve, toast, decisions };
}
