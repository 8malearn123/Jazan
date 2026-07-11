"use client";

import { useEffect, useState } from "react";
import { BellIcon, CheckIcon, BriefcaseIcon, StarFilledIcon } from "@/components/icons";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

// جرس الإشعارات — يظهر للبطل والأسرة المنتجة والشركة في لوحة التحكم.
// حالة القراءة تُحفظ في localStorage لكل مستخدم.

const STORAGE_PREFIX = "jazanheroes.notifs.read.";

const typeStyle: Record<string, { Icon: typeof CheckIcon; wrap: string }> = {
  approved: { Icon: CheckIcon, wrap: "bg-success/15 text-success-ink" },
  selected: { Icon: BriefcaseIcon, wrap: "bg-info/12 text-info-ink" },
  review: { Icon: StarFilledIcon, wrap: "bg-amber/15 text-amber-dark" },
};

export function NotificationBell() {
  const { user } = useAuth();
  const { d, isAr } = useLocale();
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);

  const role = user?.role;
  const storageKey = user ? STORAGE_PREFIX + user.id : null;

  useEffect(() => {
    if (!storageKey) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setReadIds(JSON.parse(raw) as string[]);
    } catch {
      // ignore
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [storageKey]);

  // المشرف لا يملك إشعارات ديمو
  if (!user || role === "admin") return null;

  const notifs = d.notifs[role as "hero" | "producer" | "company"] ?? [];
  const unread = notifs.filter((n) => !readIds.includes(n.id)).length;

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && storageKey) {
      // فتح القائمة يحدّد الكل كمقروء
      const all = notifs.map((n) => n.id);
      setReadIds(all);
      try {
        localStorage.setItem(storageKey, JSON.stringify(all));
      } catch {
        // ignore
      }
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label={d.notifs.aria}
        title={d.notifs.title}
        className={cn(
          "relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[11px] border-[1.5px] transition-colors",
          open
            ? "border-jazan bg-jazan text-white"
            : "border-line bg-surface text-charcoal hover:border-jazan hover:text-jazan"
        )}
      >
        <BellIcon width={18} height={18} />
        {unread > 0 ? (
          <span className="mono absolute -end-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          {/* طبقة إغلاق عند النقر خارج القائمة */}
          <button
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            dir={isAr ? "rtl" : "ltr"}
            className="absolute end-0 top-11 z-50 w-[320px] max-w-[86vw] overflow-hidden rounded-[16px] border border-line bg-surface shadow-[0_18px_50px_rgba(0,0,0,.22)]"
          >
            <div className="border-b border-line px-4 py-3 text-[14px] font-extrabold text-charcoal">
              {d.notifs.title}
            </div>
            {notifs.length === 0 ? (
              <p className="px-4 py-6 text-center text-[13px] text-muted">{d.notifs.empty}</p>
            ) : (
              <ul className="max-h-[340px] overflow-y-auto">
                {notifs.map((n) => {
                  const s = typeStyle[n.type] ?? typeStyle.approved;
                  return (
                    <li
                      key={n.id}
                      className="flex gap-3 border-b border-line-soft px-4 py-3 last:border-0"
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full",
                          s.wrap
                        )}
                      >
                        <s.Icon width={16} height={16} />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[13px] font-bold text-charcoal">{n.title}</div>
                        <p className="mt-0.5 text-[12px] leading-relaxed text-muted">{n.desc}</p>
                        <div className="mt-1 text-[11px] text-muted/70">{n.time}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
