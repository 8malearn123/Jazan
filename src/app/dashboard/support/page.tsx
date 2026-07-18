"use client";

import { useEffect, useState } from "react";
import { WhatsappIcon, MailIcon, CheckIcon, HeadsetIcon, XIcon } from "@/components/icons";
import { useAuth, roleLabels } from "@/components/auth/AuthProvider";
import {
  addTicket,
  loadTickets,
  onTicketsChange,
  type SupportTicket,
} from "@/lib/support";
import { cn } from "@/lib/cn";
import { site, whatsappLink } from "@/lib/site";

const statusMeta: Record<SupportTicket["status"], { label: string; cls: string }> = {
  new: { label: "قيد المراجعة", cls: "bg-warn/16 text-warn-ink" },
  answered: { label: "تم الرد", cls: "bg-success/12 text-success-ink" },
  rejected: { label: "مرفوض", cls: "bg-danger-soft text-danger" },
};

const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-surface px-3.5 py-2.5 text-[14px] text-charcoal outline-none transition-colors placeholder:text-[#9aa29d] focus:border-jazan";

const topics = [
  "استفسار عام",
  "مشكلة تقنية",
  "طلب توثيق الحساب",
  "بلاغ عن محتوى",
  "اقتراح تطوير",
  "أخرى",
];

export default function SupportPage() {
  const { user } = useAuth();
  const [topic, setTopic] = useState(topics[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const [myTickets, setMyTickets] = useState<SupportTicket[]>([]);
  useEffect(() => {
    if (!user) return;
    const update = () => setMyTickets(loadTickets().filter((t) => t.userId === user.id));
    update();
    return onTicketsChange(update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  function submitTicket() {
    if (!user || user.role === "admin") return;
    addTicket({
      userId: user.id,
      userName: user.name,
      role: user.role,
      roleLabel: roleLabels[user.role],
      topic,
      message: message.trim(),
    });
  }

  const waHref = whatsappLink(
    site.whatsapp,
    `السلام عليكم، أحتاج مساعدة من إدارة أبطال جازان — ${topic}`
  );

  return (
    <div className="mx-auto w-full max-w-[820px] pb-10">
      <h1 className="text-[18px] font-extrabold text-charcoal">الدعم الفني</h1>
      <p className="mt-0.5 text-[13px] text-muted">
        فريق إدارة المنصة جاهز لمساعدتك — أرسل رسالتك أو تواصل مباشرة.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3.5 rounded-[16px] border border-line bg-surface p-4 no-underline transition-colors hover:border-jazan"
        >
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[13px] bg-whatsapp/15 text-whatsapp">
            <WhatsappIcon width={22} height={22} />
          </span>
          <span>
            <span className="block text-[14px] font-bold text-charcoal">واتساب الإدارة</span>
            <span className="block text-[12px] text-muted">رد سريع خلال ساعات العمل</span>
          </span>
        </a>
        <a
          href="mailto:support@jazanheroes.sa"
          className="flex items-center gap-3.5 rounded-[16px] border border-line bg-surface p-4 no-underline transition-colors hover:border-jazan"
        >
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[13px] bg-jazan/10 text-jazan">
            <MailIcon width={22} height={22} />
          </span>
          <span>
            <span className="block text-[14px] font-bold text-charcoal">البريد الإلكتروني</span>
            <span className="block text-[12px] text-muted" dir="ltr">support@jazanheroes.sa</span>
          </span>
        </a>
      </div>

      {sent ? (
        <div className="mt-4 flex flex-col items-center rounded-[16px] border border-line bg-surface p-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
            <CheckIcon width={28} height={28} strokeWidth={2.4} />
          </span>
          <h2 className="mt-4 text-[18px] font-extrabold text-charcoal">وصلتنا رسالتك!</h2>
          <p className="mt-2 text-[14px] text-muted">
            سيتواصل معك فريق الدعم في أقرب وقت ممكن. شكراً لتواصلك.
          </p>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setMessage("");
            }}
            className="mt-5 cursor-pointer rounded-xl border-[1.5px] border-jazan/40 px-5 py-2.5 text-[13px] font-semibold text-jazan transition-colors hover:bg-jazan hover:text-white"
          >
            إرسال رسالة أخرى
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!message.trim()) return;
            submitTicket();
            setSent(true);
          }}
          className="mt-4 rounded-[16px] border border-line bg-surface p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">
                نوع الطلب
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={inputClass}
              >
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[13px] font-semibold text-charcoal">
                رسالتك
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اشرح مشكلتك أو استفسارك بالتفصيل…"
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!message.trim()}
            className="mt-4 cursor-pointer rounded-xl bg-jazan px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-jazan-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            إرسال للدعم الفني
          </button>
        </form>
      )}

      {myTickets.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-[15px] font-bold text-charcoal">
            رسائلك <span className="mono font-medium text-muted">({myTickets.length})</span>
          </h2>
          <div className="mt-2.5 flex flex-col gap-3">
            {myTickets.map((t) => (
              <div key={t.id} className="rounded-[16px] border border-line bg-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[13px] font-bold text-charcoal">{t.topic}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted">{t.date}</span>
                    <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", statusMeta[t.status].cls)}>
                      {statusMeta[t.status].label}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-ink">{t.message}</p>
                {t.reply ? (
                  <div
                    className={cn(
                      "mt-3 rounded-[12px] border p-3",
                      t.status === "rejected" ? "border-danger-line bg-danger-soft/40" : "border-success/30 bg-success/8"
                    )}
                  >
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-charcoal">
                      {t.status === "rejected" ? (
                        <XIcon width={13} height={13} className="text-danger" />
                      ) : (
                        <HeadsetIcon width={13} height={13} className="text-success-ink" />
                      )}
                      رد إدارة المنصة
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink">{t.reply}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
