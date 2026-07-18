
export type AvailabilityStatus = "freelance" | "job" | "both" | "producer";

export type UserRole = "hero" | "producer" | "company" | "admin";

export interface PortfolioItem {
  id: string;
  title: string;
  imageUrl?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date?: string;
}

export type ProfileSocials = Record<string, string>;

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
  socials?: ProfileSocials;
}

export interface Product {
  id: string;
  name: string;
  price?: number;
  imageUrl?: string;
  category?: string;
}

export interface Producer {
  id: string;
  name: string;
  category: string;
  city: string;
  bio?: string;
  rating?: number;
  reviewsCount?: number;
  avatarUrl?: string;
  coverUrl?: string;
  whatsapp?: string;
  verified?: boolean;
  products?: Product[];
  socials?: ProfileSocials;
}

export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyId?: string;
  city: string;
  type?: string;
  salary?: string;
  postedAt?: string;
  tags?: string[];
}

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
  socials?: ProfileSocials;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface SessionUser {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
}

export interface PendingVerification {
  id: string;
  name: string;
  role: Exclude<UserRole, "admin">;
  city: string;
  date: string;
}

export interface AdminReport {
  id: string;
  target: string;
  targetType: string;
  targetHref?: string;
  reason: string;
  reporter: string;
  date: string;
  status: "open" | "resolved";
  message: string;
  content: string;
}
