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
// أرقام الواتساب هنا أرقام تجريبية للعرض فقط.

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
    whatsapp: "966500000101",
    bio: "مطوّر واجهات أمامية بخبرة 4 سنوات في React وTypeScript، يركّز على الأداء وتجربة المستخدم وبناء واجهات عربية الاتجاه.",
    reviews: [
      {
        id: "rv1",
        author: "تهامة للتقنية",
        rating: 5,
        comment: "تسليم قبل الموعد وجودة عالية في التفاصيل. تجربة تعامل ممتازة.",
        date: "قبل أسبوع",
      },
      {
        id: "rv2",
        author: "متجر الساحل",
        rating: 5,
        comment: "طوّر لنا واجهة المتجر بالكامل — سريع، متعاون، ويقترح حلولاً أفضل.",
        date: "قبل شهر",
      },
      {
        id: "rv3",
        author: "واحة جازان الرقمية",
        rating: 4,
        comment: "عمل احترافي والتواصل سلس عبر واتساب.",
        date: "قبل شهرين",
      },
    ],
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
    whatsapp: "966500000102",
    reviews: [
      {
        id: "rv4",
        author: "دار صبيا للنشر",
        rating: 5,
        comment: "صمّمت هوية كاملة لمشروعنا — ذوق رفيع وفهم عميق للسوق المحلي.",
        date: "قبل أسبوعين",
      },
      {
        id: "rv5",
        author: "أسرة نكهات صبيا",
        rating: 5,
        comment: "شعارنا الجديد من إبداعها. شكراً نورة!",
        date: "قبل شهر",
      },
    ],
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
    whatsapp: "966500000103",
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
    whatsapp: "966500000104",
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
    whatsapp: "966500000105",
    reviews: [
      {
        id: "rv6",
        author: "واحة جازان الرقمية",
        rating: 5,
        comment: "تصوير احترافي لحملتنا الإعلانية — زوايا مبدعة وإخراج مميز.",
        date: "قبل 3 أيام",
      },
    ],
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
    whatsapp: "966500000106",
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
    whatsapp: "966500000107",
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
    whatsapp: "966500000108",
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
    whatsapp: "966500000201",
    bio: "أكلات جازانية منزلية أصيلة — معصوب، مراصيع، وحلويات شعبية بنكهة البيت.",
    products: [
      { id: "p1", name: "معصوب بالموز والعسل", price: 28, category: "طعام" },
      { id: "p2", name: "مرسة جمبري", price: 45, category: "طعام" },
      { id: "p3", name: "عريكة بالعسل البلدي", price: 35, category: "طعام" },
      { id: "p4", name: "مديد الحلبة", price: 22, category: "طعام" },
      { id: "p5", name: "رز كبسة دجاج", price: 40, category: "طعام" },
      { id: "p6", name: "حنيذ لحم بلدي", price: 75, category: "طعام" },
    ],
  },
  {
    id: "pr2",
    name: "حرفة جازان",
    category: "حِرف",
    city: "أبو عريش",
    rating: 4.8,
    reviewsCount: 21,
    verified: true,
    whatsapp: "966500000202",
    bio: "حِرف يدوية وسلال خوص ومنتجات تراثية مصنوعة بحب.",
    products: [
      { id: "p7", name: "سلة خوص مضفورة يدوياً", price: 60, category: "حِرف" },
      { id: "p8", name: "مكبّة عريش تراثية", price: 85, category: "حِرف" },
      { id: "p9", name: "حصيرة سعف ملوّنة", price: 120, category: "حِرف" },
      { id: "p10", name: "قبعة مظلّة جازانية", price: 45, category: "حِرف" },
      { id: "p11", name: "مروحة يدوية من الخوص", price: 25, category: "حِرف" },
    ],
  },
  {
    id: "pr3",
    name: "عطور الساحل",
    category: "عطور",
    city: "جيزان",
    rating: 4.7,
    reviewsCount: 18,
    verified: false,
    whatsapp: "966500000203",
    bio: "عطور ومباخر فاخرة بخلطات جنوبية مميّزة.",
    products: [
      { id: "p12", name: "دهن عود جنوبي فاخر", price: 150, category: "عطور" },
      { id: "p13", name: "خلطة الفل والكادي", price: 95, category: "عطور" },
      { id: "p14", name: "بخور معطّر بالمسك", price: 70, category: "عطور" },
      { id: "p15", name: "ماء ورد طبيعي", price: 35, category: "عطور" },
    ],
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
    whatsapp: "966500000301",
    about: "شركة تقنية محلية متخصصة في تطوير البرمجيات والحلول الرقمية لمنطقة جازان.",
  },
  {
    id: "c2",
    name: "واحة جازان الرقمية",
    field: "تسويق رقمي",
    city: "صبيا",
    openings: 3,
    verified: true,
    whatsapp: "966500000302",
  },
  {
    id: "c3",
    name: "متجر الساحل",
    field: "تجارة إلكترونية",
    city: "جيزان",
    openings: 2,
    verified: true,
    whatsapp: "966500000303",
  },
  {
    id: "c4",
    name: "دار صبيا للنشر",
    field: "إعلام ومحتوى",
    city: "صبيا",
    openings: 1,
    verified: true,
    whatsapp: "966500000304",
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
    salary: "8,000 – 12,000 ر.س",
    tags: ["React", "TypeScript"],
  },
  {
    id: "j2",
    title: "أخصائي تسويق رقمي",
    companyName: "واحة جازان الرقمية",
    companyId: "c2",
    city: "صبيا",
    type: "عن بُعد",
    salary: "6,000 – 9,000 ر.س",
    tags: ["SEO", "إعلانات"],
  },
  {
    id: "j3",
    title: "مدير متجر إلكتروني",
    companyName: "متجر الساحل",
    companyId: "c3",
    city: "جيزان",
    type: "دوام جزئي",
    salary: "بالاتفاق",
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
