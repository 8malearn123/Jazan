import type { UserRole } from "./types";

export interface DemoAccount {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  label: string;
  hint: string;
}

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

export function homeForRole(role: UserRole): string {
  return role === "admin" ? "/admin" : "/dashboard";
}

export function matchDemoAccount(email: string, password: string): DemoAccount | undefined {
  const e = email.trim().toLowerCase();
  return demoAccounts.find((a) => a.email === e && a.password === password);
}
