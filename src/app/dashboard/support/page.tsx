"use client";

import { useState } from "react";
import { WhatsappIcon, MailIcon, CheckIcon } from "@/components/icons";
import { site, whatsappLink } from "@/lib/site";

// الدعم الفني — التواصل مع إدارة المنصة

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
  const [topic, setTopic] = useState(topics[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

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

      {/* قنوات مباشرة */}
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

      {/* نموذج الرسالة */}
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
            if (message.trim()) setSent(true);
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
    </div>
  );
}
