
export type TicketStatus = "new" | "answered" | "rejected";

export type SupportTicket = {
  id: string;
  userId: string;
  userName: string;
  role: "hero" | "producer" | "company" | "guest";
  roleLabel: string;
  topic: string;
  message: string;
  date: string;
  status: TicketStatus;
  email?: string;
  reply?: string;
};

const seedTickets: SupportTicket[] = [
  {
    id: "t1",
    userId: "demo-producer",
    userName: "أسرة نكهات صبيا",
    role: "producer",
    roleLabel: "أسرة منتجة",
    topic: "استفسار عام",
    message: "السلام عليكم، نبغى نعرف طريقة توثيق حسابنا كأسرة منتجة، وهل التوثيق يرفع ترتيبنا في نتائج البحث؟",
    date: "اليوم",
    status: "new",
  },
  {
    id: "t2",
    userId: "demo-company",
    userName: "تهامة للتقنية",
    role: "company",
    roleLabel: "شركة",
    topic: "مشكلة تقنية",
    message: "عند محاولة نشر وظيفة جديدة تظهر رسالة خطأ ولا يكتمل النشر. جربنا من متصفحين مختلفين ونفس المشكلة.",
    date: "أمس",
    status: "new",
  },
  {
    id: "t3",
    userId: "demo-hero",
    userName: "محمد عسيري",
    role: "hero",
    roleLabel: "بطل",
    topic: "اقتراح تطوير",
    message: "اقترح إضافة إمكانية رفع فيديو قصير تعريفي في الملف الشخصي بجانب معرض الأعمال.",
    date: "قبل 3 أيام",
    status: "answered",
    reply: "شكراً لاقتراحك! أضفناه لقائمة التطويرات القادمة وسنعلن عنه فور جاهزيته.",
  },
];

const TICKETS_KEY = "jazanheroes.support.tickets";
const TICKETS_EVENT = "jazanheroes:support";

export function loadTickets(): SupportTicket[] {
  try {
    const raw = localStorage.getItem(TICKETS_KEY);
    return raw ? (JSON.parse(raw) as SupportTicket[]) : seedTickets;
  } catch {
    return seedTickets;
  }
}

function saveTickets(tickets: SupportTicket[]): void {
  try {
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    window.dispatchEvent(new Event(TICKETS_EVENT));
  } catch {
    // ignore
  }
}

export function onTicketsChange(listener: () => void): () => void {
  window.addEventListener(TICKETS_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(TICKETS_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function addTicket(input: {
  userId: string;
  userName: string;
  role: SupportTicket["role"];
  roleLabel: string;
  topic: string;
  message: string;
  email?: string;
}): void {
  const ticket: SupportTicket = {
    ...input,
    id: `t${Date.now()}`,
    date: new Date().toLocaleDateString("ar-SA", { month: "long", day: "numeric" }),
    status: "new",
  };
  saveTickets([ticket, ...loadTickets()]);
}

export function decideTicket(id: string, status: "answered" | "rejected", reply: string): void {
  const tickets = loadTickets();
  const ticket = tickets.find((t) => t.id === id);
  saveTickets(tickets.map((t) => (t.id === id ? { ...t, status, reply } : t)));
  if (ticket) {
    pushNotification(ticket.userId, {
      id: `n${Date.now()}`,
      type: status === "answered" ? "support" : "support-rejected",
      title: status === "answered" ? "رد من الدعم الفني" : "تم إغلاق طلب الدعم",
      desc:
        status === "answered"
          ? `ردّت الإدارة على «${ticket.topic}»: ${reply}`
          : `عذراً، تم رفض طلبك «${ticket.topic}»${reply ? ` — ${reply}` : ""}`,
      time: "الآن",
    });
  }
}

export function newTicketsCount(): number {
  return loadTickets().filter((t) => t.status === "new").length;
}

export type DynamicNotif = {
  id: string;
  type: string;
  title: string;
  desc: string;
  time: string;
};

const NOTIFS_PREFIX = "jazanheroes.notifs.dynamic.";
const NOTIFS_EVENT = "jazanheroes:notifs";

export function loadDynamicNotifs(userId: string): DynamicNotif[] {
  try {
    const raw = localStorage.getItem(NOTIFS_PREFIX + userId);
    return raw ? (JSON.parse(raw) as DynamicNotif[]) : [];
  } catch {
    return [];
  }
}

export function pushNotification(userId: string, notif: DynamicNotif): void {
  try {
    localStorage.setItem(
      NOTIFS_PREFIX + userId,
      JSON.stringify([notif, ...loadDynamicNotifs(userId)].slice(0, 20))
    );
    window.dispatchEvent(new Event(NOTIFS_EVENT));
  } catch {
    // ignore
  }
}

export function onNotifsChange(listener: () => void): () => void {
  window.addEventListener(NOTIFS_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(NOTIFS_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
