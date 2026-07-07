import type {
  Hero,
  Company,
  Producer,
  Job,
  Sponsor,
  PendingVerification,
  AdminReport,
} from "./types";

// بيانات تجريبية مؤقتة — تُستبدل بقاعدة بيانات حقيقية في مرحلة الباك-إند

export const sampleHeroes: Hero[] = [
  {
    id: "h1",
    name: "محمد عسيري",
    title: "مطوّر واجهات أمامية",
    city: "صبيا",
    status: "freelance",
    skills: ["React", "TypeScript", "Next.js", "RTL"],
    years: 4,
    rating: 4.9,
    reviewsCount: 12,
    verified: true,
    bio: "مطوّر واجهات أمامية بخبرة 4 سنوات في React وTypeScript، يركّز على الأداء وتجربة المستخدم وبناء واجهات عربية الاتجاه.",
  },
  {
    id: "h2",
    name: "نورة حكمي",
    title: "مصمّمة هوية بصرية",
    city: "جيزان",
    status: "both",
    skills: ["هوية بصرية", "Figma", "تصميم"],
    years: 3,
    rating: 5.0,
    reviewsCount: 8,
    verified: true,
  },
  {
    id: "h3",
    name: "عبدالله مالكي",
    title: "مهندس بيانات",
    city: "أبو عريش",
    status: "job",
    skills: ["Python", "SQL", "تحليل بيانات"],
    years: 4,
    rating: 4.7,
    reviewsCount: 5,
  },
  {
    id: "h4",
    name: "ريم زيلعي",
    title: "كاتبة محتوى",
    city: "جيزان",
    status: "freelance",
    skills: ["كتابة", "SEO"],
    years: 2,
    rating: 4.8,
    reviewsCount: 9,
  },
  {
    id: "h5",
    name: "خالد فيفي",
    title: "مصوّر فوتوغرافي",
    city: "فيفا",
    status: "both",
    skills: ["تصوير", "مونتاج"],
    years: 5,
    rating: 4.9,
    reviewsCount: 16,
  },
  {
    id: "h6",
    name: "سارة مدخلي",
    title: "مطوّرة واجهات",
    city: "صامطة",
    status: "job",
    skills: ["Vue", "CSS"],
    years: 1,
    rating: 4.6,
    reviewsCount: 4,
  },
  {
    id: "h7",
    name: "يوسف نجمي",
    title: "مطوّر تطبيقات",
    city: "بيش",
    status: "freelance",
    skills: ["Flutter", "Firebase"],
    years: 3,
    rating: 4.8,
    reviewsCount: 11,
  },
  {
    id: "h8",
    name: "أمل شعبي",
    title: "مديرة مشاريع",
    city: "الدرب",
    status: "both",
    skills: ["Agile", "Scrum"],
    years: 6,
    rating: 5.0,
    reviewsCount: 20,
  },
];

export const producers: Producer[] = [
  {
    id: "pr1",
    name: "أسرة نكهات صبيا",
    category: "طعام",
    city: "صبيا",
    rating: 4.9,
    reviewsCount: 34,
    verified: true,
    bio: "أكلات جازانية منزلية أصيلة — معصوب، مراصيع، وحلويات شعبية بنكهة البيت.",
  },
  {
    id: "pr2",
    name: "حرفة جازان",
    category: "حِرف",
    city: "أبو عريش",
    rating: 4.8,
    reviewsCount: 21,
    verified: true,
    bio: "حِرف يدوية وسلال خوص ومنتجات تراثية مصنوعة بحب.",
  },
  {
    id: "pr3",
    name: "عطور الساحل",
    category: "عطور",
    city: "جيزان",
    rating: 4.7,
    reviewsCount: 18,
    verified: false,
    bio: "عطور ومباخر فاخرة بخلطات جنوبية مميّزة.",
  },
];

export const companies: Company[] = [
  {
    id: "c1",
    name: "تهامة للتقنية",
    field: "تطوير برمجيات",
    city: "جيزان",
    openings: 4,
    verified: true,
    about: "شركة تقنية محلية متخصصة في تطوير البرمجيات والحلول الرقمية لمنطقة جازان.",
  },
  {
    id: "c2",
    name: "واحة جازان الرقمية",
    field: "تسويق رقمي",
    city: "صبيا",
    openings: 3,
    verified: true,
  },
  {
    id: "c3",
    name: "متجر الساحل",
    field: "تجارة إلكترونية",
    city: "جيزان",
    openings: 2,
    verified: true,
  },
  {
    id: "c4",
    name: "دار صبيا للنشر",
    field: "إعلام ومحتوى",
    city: "صبيا",
    openings: 1,
    verified: true,
  },
];

export const jobs: Job[] = [
  {
    id: "j1",
    title: "مطوّر واجهات أمامية",
    companyName: "تهامة للتقنية",
    companyId: "c1",
    city: "جيزان",
    type: "دوام كامل",
    tags: ["React", "TypeScript"],
  },
  {
    id: "j2",
    title: "أخصائي تسويق رقمي",
    companyName: "واحة جازان الرقمية",
    companyId: "c2",
    city: "صبيا",
    type: "عن بُعد",
    tags: ["SEO", "إعلانات"],
  },
  {
    id: "j3",
    title: "مدير متجر إلكتروني",
    companyName: "متجر الساحل",
    companyId: "c3",
    city: "جيزان",
    type: "دوام جزئي",
    tags: ["إدارة", "تجارة"],
  },
];

/** يجلب بطلاً بالمعرّف */
export function getHero(id: string): Hero | undefined {
  return sampleHeroes.find((h) => h.id === id);
}

/** يجلب أسرة منتجة بالمعرّف */
export function getProducer(id: string): Producer | undefined {
  return producers.find((p) => p.id === id);
}

/** يجلب شركة بالمعرّف */
export function getCompany(id: string): Company | undefined {
  return companies.find((c) => c.id === id);
}

export const sponsors: Sponsor[] = [
  { id: "s1", name: "راعٍ ١" },
  { id: "s2", name: "راعٍ ٢" },
  { id: "s3", name: "راعٍ ٣" },
  { id: "s4", name: "راعٍ ٤" },
  { id: "s5", name: "راعٍ ٥" },
];

// طلبات التوثيق المعلّقة (لوحة المشرف)
export const pendingVerifications: PendingVerification[] = [
  { id: "pv1", name: "سعيد قحطاني", role: "hero", city: "جيزان", date: "قبل ساعتين" },
  { id: "pv2", name: "مخبز ريف جازان", role: "producer", city: "بيش", date: "قبل 4 ساعات" },
  { id: "pv3", name: "متجر الساحل", role: "company", city: "جيزان", date: "أمس" },
  { id: "pv4", name: "هند صبياني", role: "hero", city: "صامطة", date: "أمس" },
  { id: "pv5", name: "عطور الساحل", role: "producer", city: "جيزان", date: "قبل يومين" },
  { id: "pv6", name: "تهامة للتقنية", role: "company", city: "جيزان", date: "قبل 3 أيام" },
];

/** يجلب طلب توثيق بالمعرّف */
export function getPendingVerification(id: string): PendingVerification | undefined {
  return pendingVerifications.find((p) => p.id === id);
}

// البلاغات (لوحة المشرف)
export const reports: AdminReport[] = [
  { id: "r1", target: "متجر الساحل", reason: "محتوى غير مناسب", reporter: "مستخدم #1042", date: "اليوم", status: "open" },
  { id: "r2", target: "سعيد قحطاني", reason: "معلومات مضلّلة", reporter: "مستخدم #877", date: "أمس", status: "open" },
  { id: "r3", target: "عطور الساحل", reason: "صورة مخالفة", reporter: "مستخدم #654", date: "قبل يومين", status: "resolved" },
];
