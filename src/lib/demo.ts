import type { UserRole } from "./types";

/** حساب تجريبي جاهز للاختبار */
export interface DemoAccount {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  label: string;
  hint: string;
}

/**
 * حسابات الديمو — للتجربة والاختبار.
 * تعمل في الوضع التجريبي مباشرة (بدون باك-إند).
 */
export const demoAccounts: DemoAccount[] = [
  {
    role: "hero",
    name: "محمد عسيري",
    email: "hero@demo.jazanheroes.sa",
    password: "demo1234",
    label: "بطل / مستقل",
    hint: "مطوّر واجهات أمامية",
  },
  {
    role: "producer",
    name: "أسرة نكهات صبيا",
    email: "producer@demo.jazanheroes.sa",
    password: "demo1234",
    label: "أسرة منتجة",
    hint: "أكلات جازانية منزلية",
  },
  {
    role: "company",
    name: "تهامة للتقنية",
    email: "company@demo.jazanheroes.sa",
    password: "demo1234",
    label: "شركة / جهة",
    hint: "تطوير برمجيات",
  },
  {
    role: "admin",
    name: "إدارة المنصة",
    email: "admin@demo.jazanheroes.sa",
    password: "demo1234",
    label: "الإدارة العامة",
    hint: "لوحة المشرف",
  },
];

/** المسار الذي يُوجَّه إليه المستخدم بعد الدخول حسب دوره */
export function homeForRole(role: UserRole): string {
  return role === "admin" ? "/admin" : "/dashboard";
}

/** يبحث عن حساب ديمو يطابق البريد وكلمة المرور */
export function matchDemoAccount(email: string, password: string): DemoAccount | undefined {
  const e = email.trim().toLowerCase();
  return demoAccounts.find((a) => a.email === e && a.password === password);
}
