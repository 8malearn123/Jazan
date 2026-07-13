"use client";

import { useEffect, useState } from "react";
import { XIcon, CheckIcon, HeadsetIcon } from "@/components/icons";
import { AdminPageHead, TableCard, Th, Td, Pill } from "../_components/AdminTable";
import { cn } from "@/lib/cn";
import {
  loadTickets,
  onTicketsChange,
  decideTicket,
  type SupportTicket,
  type TicketStatus,
} from "@/lib/support";

// الدعم الفني — رسائل الأعضاء (مشاكل، استفسارات، طلبات) والرد عليها

const statusMeta: Record<TicketStatus, { label: string; tone: "warn" | "success" | "muted" }> = {
  new: { label: "جديدة", tone: "warn" },
  answered: { label: "تم الرد", tone: "success" },
  rejected: { label: "مرفوضة", tone: "muted" },
};

const roleTone: Record<string, string> = {
  "شركة": "bg-info/12 text-info-ink",
  "أسرة منتجة": "bg-amber/15 text-amber-dark",
  "بطل": "bg-jazan/10 text-jazan",
  "بطل / مستقل": "bg-jazan/10 text-jazan",
  "زائر": "bg-tag text-muted",
};

const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-surface px-3.5 py-2.5 text-[14px] text-charcoal outline-none transition-colors placeholder:text-[#9aa29d] focus:border-jazan";

/** نافذة تفاصيل التذكرة — عرض الرسالة كاملة والرد أو الرفض */
function TicketModal({
  ticket,
  onClose,
  onDecide,
}: {
  ticket: SupportTicket;
  onClose: () => void;
  onDecide: (id: string, status: "answered" | "rejected", reply: string) => void;
}) {
  const [reply, setReply] = useState(ticket.reply ?? "");
  const isNew = ticket.status === "new";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`تفاصيل رسالة ${ticket.userName}`}
    >
      <button
        aria-label="إغلاق"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-[2px]"
      />
      <div className="relative z-10 flex max-h-[88vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[22px] border border-line bg-surface shadow-[0_24px_70px_rgba(0,0,0,.35)]">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] font-extrabold text-charcoal">تفاصيل الرسالة</h2>
            <Pill tone={statusMeta[ticket.status].tone}>{statusMeta[ticket.status].label}</Pill>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="flex h-9 w-9 flex-none cursor-pointer items-center justify-center rounded-[10px] border border-line text-muted transition-colors hover:border-jazan hover:text-jazan"
          >
            <XIcon width={18} height={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          <div className="grid gap-2.5 rounded-[14px] border border-line bg-cream/60 p-4 text-[13px] sm:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold text-muted">المرسِل</div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2">
                <span className="font-bold text-charcoal">{ticket.userName}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", roleTone[ticket.roleLabel] ?? "bg-tag text-muted")}>
                  {ticket.roleLabel}
                </span>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-muted">نوع الطلب</div>
              <div className="mt-0.5 font-bold text-charcoal">{ticket.topic}</div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-muted">التاريخ</div>
              <div className="mt-0.5 text-charcoal">{ticket.date}</div>
            </div>
            {ticket.email ? (
              <div>
                <div className="text-[11px] font-semibold text-muted">البريد الإلكتروني</div>
                <a
                  href={`mailto:${ticket.email}`}
                  className="mono mt-0.5 block text-jazan no-underline hover:underline"
                  dir="ltr"
                >
                  {ticket.email}
                </a>
              </div>
            ) : null}
          </div>

          <h3 className="mt-4 text-[13px] font-bold text-charcoal">نص الرسالة</h3>
          <p className="mt-1.5 rounded-[14px] border border-line bg-surface p-3.5 text-[13px] leading-relaxed text-ink">
            {ticket.message}
          </p>

          <h3 className="mt-4 text-[13px] font-bold text-charcoal">
            {isNew ? "ردّك" : "الرد المُرسَل"}
          </h3>
          {isNew ? (
            <textarea
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="اكتب ردّك هنا — يصل لصاحب الرسالة كإشعار وفي صفحة الدعم الفني لديه…"
              className={`${inputClass} mt-1.5 resize-none`}
            />
          ) : (
            <p className="mt-1.5 rounded-[14px] border border-success/30 bg-success/8 p-3.5 text-[13px] leading-relaxed text-ink">
              {ticket.reply || "—"}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-4">
          {isNew ? (
            <>
              <button
                onClick={() => onDecide(ticket.id, "answered", reply.trim())}
                disabled={!reply.trim()}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-jazan px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-jazan-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CheckIcon width={15} height={15} strokeWidth={2.4} />
                إرسال الرد
              </button>
              <button
                onClick={() => onDecide(ticket.id, "rejected", reply.trim())}
                className="cursor-pointer rounded-xl border border-danger-line bg-surface px-5 py-2.5 text-[13px] font-semibold text-danger transition-colors hover:bg-danger-soft"
              >
                رفض الطلب
              </button>
            </>
          ) : null}
          <button
            onClick={onClose}
            className="ms-auto cursor-pointer rounded-xl border border-line bg-surface px-5 py-2.5 text-[13px] font-semibold text-muted transition-colors hover:bg-cream"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [toast, setToast] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTickets(loadTickets());
    update();
    return onTicketsChange(update);
  }, []);

  function decide(id: string, status: "answered" | "rejected", reply: string) {
    decideTicket(id, status, reply);
    setToast(
      status === "answered"
        ? "تم إرسال الرد — وصل صاحب الرسالة إشعار بالرد"
        : "تم رفض الطلب — وصل صاحب الرسالة إشعار بذلك"
    );
    setTimeout(() => setToast(""), 2500);
    setOpenId(null);
  }

  const openTicket = tickets.find((t) => t.id === openId) ?? null;
  const pending = tickets.filter((t) => t.status === "new");
  const decided = tickets.filter((t) => t.status !== "new");

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-5">
      <AdminPageHead
        title="الدعم الفني"
        subtitle={
          pending.length > 0
            ? `${pending.length} رسالة جديدة بانتظار الرد — من الأبطال والأسر المنتجة والشركات`
            : "رسائل الأعضاء — مشاكل واستفسارات وطلبات"
        }
      />

      {toast ? (
        <div className="rounded-xl bg-success/12 px-4 py-2.5 text-[13px] font-semibold text-success-ink">
          ✓ {toast}
        </div>
      ) : null}

      {/* الرسائل الجديدة */}
      <div>
        <h2 className="text-[14px] font-bold text-charcoal">بانتظار الرد</h2>
        {pending.length === 0 ? (
          <div className="mt-2.5 rounded-[16px] border border-line bg-surface px-6 py-10 text-center text-[14px] text-muted">
            ✓ لا توجد رسائل جديدة — تم الرد على الكل.
          </div>
        ) : (
          <div className="mt-2.5 grid gap-3 lg:grid-cols-2">
            {pending.map((t) => (
              <div key={t.id} className="rounded-[16px] border border-line bg-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[12px] bg-jazan/10 text-jazan">
                      <HeadsetIcon width={18} height={18} />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[14px] font-bold text-charcoal">{t.userName}</h3>
                        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", roleTone[t.roleLabel] ?? "bg-tag text-muted")}>
                          {t.roleLabel}
                        </span>
                      </div>
                      <div className="text-[12px] text-muted">{t.topic} · {t.date}</div>
                    </div>
                  </div>
                  <Pill tone="warn">جديدة</Pill>
                </div>
                <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-ink">{t.message}</p>
                <div className="mt-3 flex gap-2 border-t border-line-soft pt-3">
                  <button
                    onClick={() => setOpenId(t.id)}
                    className="cursor-pointer rounded-lg bg-jazan px-4 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-jazan-dark"
                  >
                    التفاصيل والرد
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* السجل */}
      <div>
        <h2 className="text-[14px] font-bold text-charcoal">
          سجل الرسائل <span className="mono font-medium text-muted">({decided.length})</span>
        </h2>
        {decided.length === 0 ? (
          <div className="mt-2.5 rounded-[16px] border border-line bg-surface px-6 py-8 text-center text-[13px] text-muted">
            لم يُبتّ في أي رسالة بعد.
          </div>
        ) : (
          <div className="mt-2.5">
            <TableCard>
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="border-b border-line bg-cream">
                    <Th>المرسِل</Th>
                    <Th>نوع الطلب</Th>
                    <Th>الرسالة</Th>
                    <Th>التاريخ</Th>
                    <Th>الحالة</Th>
                    <Th>إجراءات</Th>
                  </tr>
                </thead>
                <tbody>
                  {decided.map((t) => (
                    <tr key={t.id} className="border-b border-line last:border-0">
                      <Td className="font-bold text-charcoal">
                        {t.userName}
                        <span className="block text-[11px] font-medium text-muted">{t.roleLabel}</span>
                      </Td>
                      <Td>{t.topic}</Td>
                      <Td className="max-w-[280px]">
                        <span className="line-clamp-2">{t.message}</span>
                      </Td>
                      <Td className="whitespace-nowrap">{t.date}</Td>
                      <Td>
                        <Pill tone={statusMeta[t.status].tone}>{statusMeta[t.status].label}</Pill>
                      </Td>
                      <Td>
                        <button
                          onClick={() => setOpenId(t.id)}
                          className="cursor-pointer rounded-lg border border-line bg-surface px-3 py-1.5 text-[12px] font-semibold text-charcoal transition-colors hover:border-jazan hover:text-jazan"
                        >
                          التفاصيل
                        </button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableCard>
          </div>
        )}
      </div>

      {openTicket ? (
        <TicketModal
          key={openTicket.id}
          ticket={openTicket}
          onClose={() => setOpenId(null)}
          onDecide={decide}
        />
      ) : null}
    </div>
  );
}
