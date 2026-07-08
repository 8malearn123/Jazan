"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

// نظام ترجمة خفيف: قاموسان (عربي/إنجليزي) + سياق React.
// اللغة تُحفظ في localStorage وتُطبّق lang/dir على <html>
// (سكربت مبكر في layout يطبّقها قبل الرسم لتفادي الوميض).

export type Locale = "ar" | "en";
const STORAGE_KEY = "jazanheroes.locale";

const ar = {
  header: {
    browse: "تصفّح الأبطال",
    companies: "للشركات",
    how: "كيف تعمل",
    login: "تسجيل الدخول",
    join: "انضم كبطل",
    dashboard: "لوحة التحكم",
    adminPanel: "لوحة المشرف",
    hello: "أهلاً،",
  },
  footer: {
    about: "منصة مجتمعية محلية تربط مواهب منطقة جازان بالفرص — مستقلين، أسر منتجة، وشركات.",
    platform: "المنصة",
    support: "الدعم",
    faq: "الأسئلة الشائعة",
    contact: "تواصل معنا",
    privacy: "سياسة الخصوصية",
    terms: "شروط الاستخدام",
    follow: "تابعنا",
    rights: "جميع الحقوق محفوظة",
    made: "صُنع بفخر في منطقة جازان",
  },
  fab: "تواصل عبر واتساب",
  stats: {
    heroes: "بطل مسجّل",
    producers: "أسرة منتجة",
    companies: "شركة وجهة",
  },
  hero: {
    tagline: "منصة جازان المجتمعية للمواهب",
    title1: "مواهب جازان",
    title2: "تلتقي بالفرص الحقيقية",
    desc: "منصة محلية تربط المستقلين والباحثين عن عمل، والأسر المنتجة والصُنّاع، بالشركات والجهات — تواصل مباشر بضغطة زر.",
    searchPh: "ابحث عن مطوّر، مصمّم، أسرة منتجة…",
    search: "بحث",
    contacted: "تم التواصل بنجاح",
    viaWa: "عبر واتساب · قبل دقيقة",
    specsAvail: "تخصصات متاحة",
    specs: "برمجة · تصميم · حِرف",
    imgLabel: "صورة الهيرو — مواهب جازان",
  },
  categories: {
    start: "ابدأ الآن",
    hero: {
      title: "مستقل / باحث عن عمل",
      desc: "ابنِ بروفايلك، اعرض مهاراتك وسيرتك الذاتية، وحدّد حالتك.",
    },
    producer: {
      title: "أسرة منتجة / صانع",
      desc: "اعرض منتجاتك بصرياً — طعام، حِرف، عطور — واستقبل الطلبات.",
    },
    company: {
      title: "شركة / جهة",
      desc: "انشر الفرص، تابع المتقدمين، ووظّف مواهب جازان المحلية.",
    },
  },
  how: {
    kicker: "كيف تعمل المنصة",
    title: "ثلاث خطوات تفصلك عن الفرصة",
    steps: [
      { title: "أنشئ بروفايلك", desc: "سجّل، اختر دورك، وابنِ صفحتك الاحترافية في دقائق." },
      { title: "اعرض أعمالك", desc: "أضف مهاراتك ومنتجاتك ومعرض أعمالك بشكل بصري جذّاب." },
      { title: "تواصل مباشرة", desc: "يصلك العميل أو صاحب العمل عبر واتساب بضغطة زر واحدة." },
    ],
  },
  sample: {
    kicker: "عيّنة من الأبطال",
    title: "مواهب من قلب المنطقة",
    browseAll: "تصفّح كل الأبطال ←",
  },
  partners: {
    kicker: "الشركاء",
    title: "شركات وجهات تنشر فرصها معنا",
    desc: "جهات مسجّلة في المنصة توظّف مواهب جازان مباشرة.",
    all: "كل الشركاء ←",
    opening: "فرصة مفتوحة",
    openings: "فرص مفتوحة",
    verified: "موثّقة",
  },
  sponsors: {
    kicker: "الرعاة",
    title: "بدعمٍ من رعاة مبادرة أبطال جازان",
    desc: "جهات ساهمت في رعاية المنصة ودعمها تسويقياً لتمكين مواهب المنطقة.",
    logo: "شعار راعٍ",
    become: "كن راعياً للمنصة",
  },
  cta: {
    title: "جاهز تكون من أبطال جازان؟",
    desc: "سجّل مجاناً وابنِ صفحتك خلال دقائق.",
    join: "انضم كبطل الآن",
  },
  tabs: {
    heroes: "الأبطال",
    producers: "الأسر المنتجة",
    jobs: "الوظائف",
  },
  browse: {
    title: "تصفّح أبطال جازان",
    subtitlePrefix: "مطوّرون، مصمّمون، كتّاب ومواهب من قلب المنطقة — ",
    subtitleSuffix: " بطل.",
    searchPh: "ابحث بالاسم أو المهارة…",
    allCities: "كل المدن",
    chips: {
      all: "الكل",
      freelance: "متاح للعمل الحر",
      job: "يبحث عن وظيفة",
      both: "متاح للاثنين",
    },
    result: "نتيجة",
    emptyTitle: "لا توجد نتائج مطابقة",
    emptyDesc: "جرّب تعديل البحث أو المُرشّحات.",
  },
  producersPage: {
    title: "الأسر المنتجة والصُنّاع",
    subtitlePrefix: "طعام منزلي، حِرف يدوية وعطور من جازان — ",
    subtitleSuffix: " أسرة.",
    searchPh: "ابحث عن نشاط أو منتج…",
    allCities: "كل المدن",
    all: "الكل",
    result: "نتيجة",
    emptyTitle: "لا توجد نتائج مطابقة",
    emptyDesc: "جرّب تعديل البحث أو الفئة.",
  },
  companiesPage: {
    title: "شركات وجهات تنشر فرصها معنا",
    subtitlePrefix: "فرص عمل من شركات وجهات جازان — ",
    subtitleMid: " فرصة من ",
    subtitleSuffix: " شركة.",
    searchPh: "ابحث عن وظيفة أو شركة…",
    allCities: "كل المدن",
    all: "الكل",
    company: "شركة",
    latestJobs: "أحدث الوظائف",
    emptyCompanies: "لا توجد شركات مطابقة",
    emptyJobs: "لا توجد وظائف مطابقة",
  },
  cards: {
    viewProfile: "عرض الملف",
    viewStore: "عرض المتجر",
    order: "اطلب",
    viewCompany: "عرض الشركة",
    apply: "تقدّم",
    verified: "موثّقة",
    openings: "فرص مفتوحة",
    review: "تقييم",
  },
  status: {
    freelance: "عمل حر",
    job: "يبحث عن وظيفة",
    both: "للاثنين",
    producer: "أسرة منتجة",
  },
};

export type Dict = typeof ar;

const en: Dict = {
  header: {
    browse: "Browse Heroes",
    companies: "For Companies",
    how: "How It Works",
    login: "Log in",
    join: "Join as a Hero",
    dashboard: "Dashboard",
    adminPanel: "Admin Panel",
    hello: "Hi,",
  },
  footer: {
    about: "A local community platform connecting Jazan's talents with opportunities — freelancers, producer families, and companies.",
    platform: "Platform",
    support: "Support",
    faq: "FAQ",
    contact: "Contact Us",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    follow: "Follow Us",
    rights: "All rights reserved",
    made: "Proudly made in Jazan",
  },
  fab: "Chat on WhatsApp",
  stats: {
    heroes: "Registered heroes",
    producers: "Producer families",
    companies: "Companies",
  },
  hero: {
    tagline: "Jazan's community talent platform",
    title1: "Jazan's talents",
    title2: "meet real opportunities",
    desc: "A local platform connecting freelancers, job seekers, producer families and artisans with companies — direct contact in one click.",
    searchPh: "Search for a developer, designer, producer…",
    search: "Search",
    contacted: "Contacted successfully",
    viaWa: "via WhatsApp · a minute ago",
    specsAvail: "Available specialties",
    specs: "Coding · Design · Crafts",
    imgLabel: "Hero image — Jazan talents",
  },
  categories: {
    start: "Start now",
    hero: {
      title: "Freelancer / Job Seeker",
      desc: "Build your profile, showcase your skills and CV, and set your availability.",
    },
    producer: {
      title: "Producer Family / Artisan",
      desc: "Showcase your products visually — food, crafts, perfumes — and receive orders.",
    },
    company: {
      title: "Company / Organization",
      desc: "Post opportunities, track applicants, and hire local Jazan talent.",
    },
  },
  how: {
    kicker: "How the platform works",
    title: "Three steps between you and the opportunity",
    steps: [
      { title: "Create your profile", desc: "Sign up, pick your role, and build a professional page in minutes." },
      { title: "Showcase your work", desc: "Add your skills, products and portfolio in a visual, attractive way." },
      { title: "Connect directly", desc: "Clients and employers reach you on WhatsApp with a single click." },
    ],
  },
  sample: {
    kicker: "A sample of our heroes",
    title: "Talents from the heart of the region",
    browseAll: "Browse all heroes →",
  },
  partners: {
    kicker: "Partners",
    title: "Companies posting their opportunities with us",
    desc: "Registered organizations hiring Jazan's talents directly.",
    all: "All partners →",
    opening: "open position",
    openings: "open positions",
    verified: "Verified",
  },
  sponsors: {
    kicker: "Sponsors",
    title: "Backed by the sponsors of Jazan Heroes",
    desc: "Organizations that sponsored and promoted the platform to empower local talent.",
    logo: "Sponsor logo",
    become: "Become a sponsor",
  },
  cta: {
    title: "Ready to become a Jazan Hero?",
    desc: "Sign up for free and build your page in minutes.",
    join: "Join as a Hero now",
  },
  tabs: {
    heroes: "Heroes",
    producers: "Producers",
    jobs: "Jobs",
  },
  browse: {
    title: "Browse Jazan Heroes",
    subtitlePrefix: "Developers, designers, writers and talents from the region — ",
    subtitleSuffix: " heroes.",
    searchPh: "Search by name or skill…",
    allCities: "All cities",
    chips: {
      all: "All",
      freelance: "Available for freelance",
      job: "Looking for a job",
      both: "Open to both",
    },
    result: "results",
    emptyTitle: "No matching results",
    emptyDesc: "Try adjusting your search or filters.",
  },
  producersPage: {
    title: "Producer Families & Artisans",
    subtitlePrefix: "Homemade food, handcrafts and perfumes from Jazan — ",
    subtitleSuffix: " families.",
    searchPh: "Search for a business or product…",
    allCities: "All cities",
    all: "All",
    result: "results",
    emptyTitle: "No matching results",
    emptyDesc: "Try adjusting your search or category.",
  },
  companiesPage: {
    title: "Companies posting their opportunities with us",
    subtitlePrefix: "Job opportunities from Jazan's companies — ",
    subtitleMid: " openings from ",
    subtitleSuffix: " companies.",
    searchPh: "Search for a job or company…",
    allCities: "All cities",
    all: "All",
    company: "companies",
    latestJobs: "Latest jobs",
    emptyCompanies: "No matching companies",
    emptyJobs: "No matching jobs",
  },
  cards: {
    viewProfile: "View profile",
    viewStore: "View store",
    order: "Order",
    viewCompany: "View company",
    apply: "Apply",
    verified: "Verified",
    openings: "open positions",
    review: "reviews",
  },
  status: {
    freelance: "Freelance",
    job: "Job seeker",
    both: "Both",
    producer: "Producer",
  },
};

const dictionaries: Record<Locale, Dict> = { ar, en };

type LocaleContextValue = {
  locale: Locale;
  /** القاموس الحالي */
  d: Dict;
  isAr: boolean;
  setLocale: (l: Locale) => void;
  toggle: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function applyToDocument(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "ar") setLocaleState(saved);
    } catch {
      // ignore
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    applyToDocument(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
  }, []);

  const toggle = useCallback(() => {
    setLocale(locale === "ar" ? "en" : "ar");
  }, [locale, setLocale]);

  return (
    <LocaleContext.Provider
      value={{ locale, d: dictionaries[locale], isAr: locale === "ar", setLocale, toggle }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within <LocaleProvider>");
  return ctx;
}
