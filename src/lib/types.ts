// أنواع البيانات الأساسية لمنصة أبطال جازان

/** حالة التوفّر للبطل */
export type AvailabilityStatus = "freelance" | "job" | "both" | "producer";

/** دور المستخدم في المنصة */
export type UserRole = "hero" | "producer" | "company" | "admin";

/** عنصر في معرض الأعمال */
export interface PortfolioItem {
  id: string;
  title: string;
  imageUrl?: string;
}

/** تقييم */
export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date?: string;
}

/** روابط شبكات التواصل الشخصية (المفتاح = المنصة) */
export type ProfileSocials = Record<string, string>;

/** بطل (مستقل / باحث عن عمل) */
export interface Hero {
  id: string;
  name: string;
  title: string;
  city: string;
  status: AvailabilityStatus;
  skills: string[];
  years?: number;
  rating?: number;
  reviewsCount?: number;
  avatarUrl?: string;
  coverUrl?: string;
  bio?: string;
  whatsapp?: string;
  verified?: boolean;
  portfolio?: PortfolioItem[];
  reviews?: Review[];
  /** روابط التواصل الافتراضية — تظهر في الصفحة العامة */
  socials?: ProfileSocials;
}

/** منتج لأسرة منتجة */
export interface Product {
  id: string;
  name: string;
  price?: number;
  imageUrl?: string;
  category?: string;
}

/** أسرة منتجة / صانع */
export interface Producer {
  id: string;
  name: string;
  category: string; // طعام · حِرف · عطور
  city: string;
  bio?: string;
  rating?: number;
  reviewsCount?: number;
  avatarUrl?: string;
  coverUrl?: string;
  whatsapp?: string;
  verified?: boolean;
  products?: Product[];
  /** روابط التواصل الافتراضية — تظهر في الصفحة العامة */
  socials?: ProfileSocials;
}

/** وظيفة / فرصة تنشرها شركة */
export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyId?: string;
  city: string;
  type?: string; // دوام كامل · جزئي · عن بُعد
  salary?: string;
  postedAt?: string;
  tags?: string[];
}

/** شركة / جهة */
export interface Company {
  id: string;
  name: string;
  field: string;
  city?: string;
  about?: string;
  logoUrl?: string;
  coverUrl?: string;
  openings: number;
  verified: boolean;
  whatsapp?: string;
  jobs?: Job[];
  /** روابط التواصل الافتراضية — تظهر في الصفحة العامة */
  socials?: ProfileSocials;
}

/** راعٍ للمنصة */
export interface Sponsor {
  id: string;
  name: string;
  logoUrl?: string;
}

/** إحصائية */
export interface Stat {
  value: string;
  label: string;
}

/** مستخدم مُسجّل (مصادقة مبدئية) */
export interface SessionUser {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
}

/** طلب توثيق معلّق (لوحة المشرف) */
export interface PendingVerification {
  id: string;
  name: string;
  role: Exclude<UserRole, "admin">;
  city: string;
  date: string;
}

/** بلاغ (لوحة المشرف) */
export interface AdminReport {
  id: string;
  target: string;
  /** نوع الجهة المُبلَّغ عنها */
  targetType: string;
  /** رابط الصفحة العامة للجهة (إن وُجدت) */
  targetHref?: string;
  reason: string;
  reporter: string;
  date: string;
  status: "open" | "resolved";
  /** نص البلاغ كما كتبه المُبلِّغ */
  message: string;
  /** اقتباس من المحتوى المُبلَّغ عنه */
  content: string;
}
