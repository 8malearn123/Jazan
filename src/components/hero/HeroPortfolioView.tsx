"use client";

import { useEffect, useMemo, useState } from "react";
import { Tag } from "@/components/ui/Tag";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { StarFilledIcon, WhatsappIcon, XIcon } from "@/components/icons";
import { useLocale } from "@/lib/i18n";
import { fetchWorks, type Work } from "@/lib/works";
import { fetchPosts, formatPostDate, type Post } from "@/lib/posts";
import { fetchHeroDetails, type HeroDetails } from "@/lib/members";
import { usePublicPhotos } from "@/lib/photos";
import { demoUserForPublicProfile } from "@/lib/social";
import { cn } from "@/lib/cn";
import type { Hero } from "@/lib/types";

function SectionMarker({
  number,
  label,
  title,
}: {
  number: string;
  label: string;
  title: string;
}) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="flex items-center gap-3">
        <span className="mono text-[13px] font-semibold text-amber">{number}</span>
        <span className="text-[11px] font-bold uppercase tracking-[2px] text-jazan/60">
          {label}
        </span>
      </div>
      <h2 className="text-[24px] font-extrabold tracking-[-.4px] text-charcoal">{title}</h2>
      <span className="mt-1 h-[3px] w-12 rounded-full bg-amber" />
    </div>
  );
}

const cardClass = "rounded-[18px] border border-line bg-surface";

export function HeroPortfolioView({ hero, bio }: { hero: Hero; bio: string }) {
  const { d, isAr } = useLocale();
  const dataId = demoUserForPublicProfile(hero.id) ?? hero.id;

  const [works, setWorks] = useState<Work[]>([]);
  const [details, setDetails] = useState<HeroDetails | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const photos = usePublicPhotos(hero.id);

  useEffect(() => {
    let cancelled = false;
    fetchWorks(dataId).then((list) => {
      if (!cancelled) setWorks(list);
    });
    fetchHeroDetails(dataId).then((dts) => {
      if (!cancelled) setDetails(dts);
    });
    fetchPosts(dataId).then((list) => {
      if (!cancelled) setPosts(list);
    });
    return () => {
      cancelled = true;
    };
  }, [dataId]);

  const avatar = hero.avatarUrl || photos.avatar;
  const cover = hero.coverUrl || photos.cover;
  const whatsappDigits = (hero.whatsapp ?? "").replace(/[^0-9]/g, "");
  const services = details?.services?.filter((s) => s.name.trim()) ?? [];
  const timeline = details?.timeline?.filter((t) => t.role.trim()) ?? [];
  const certs = details?.certs?.filter((c) => c.name.trim()) ?? [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    works.forEach((w) => {
      if (w.category?.trim()) set.add(w.category.trim());
    });
    return Array.from(set);
  }, [works]);
  const [filter, setFilter] = useState("all");
  const shownWorks = useMemo(
    () => (filter === "all" ? works : works.filter((w) => w.category?.trim() === filter)),
    [works, filter]
  );

  const [lightbox, setLightbox] = useState<Work | null>(null);

  const [reqName, setReqName] = useState("");
  const [reqPhone, setReqPhone] = useState("");
  const [reqService, setReqService] = useState("");
  const [reqSent, setReqSent] = useState(false);

  function openWhatsApp(text?: string) {
    if (!whatsappDigits) return;
    const base = `https://wa.me/${whatsappDigits}`;
    window.open(text ? `${base}?text=${encodeURIComponent(text)}` : base, "_blank");
  }

  function submitRequest(e: React.FormEvent) {
    e.preventDefault();
    const msg = isAr
      ? `طلب خدمة جديد من منصة أبطال جازان:\nالاسم: ${reqName}\nالجوال: ${reqPhone}\nالخدمة: ${reqService}`
      : `New service request from Jazan Heroes:\nName: ${reqName}\nPhone: ${reqPhone}\nService: ${reqService}`;
    openWhatsApp(msg);
    setReqSent(true);
  }

  function scrollToRequest() {
    document.getElementById("request")?.scrollIntoView({ behavior: "smooth" });
  }

  // ترقيم الأقسام الظاهرة فقط — بلا فجوات عندما تُخفى أقسام فارغة
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  const sectionKeys = [
    "works",
    services.length > 0 ? "services" : null,
    timeline.length > 0 || certs.length > 0 ? "experience" : null,
    "about",
    posts.length > 0 ? "blog" : null,
    hero.reviews?.length ? "reviews" : null,
    whatsappDigits ? "request" : null,
  ].filter((k): k is string => k !== null);
  const numberOf = (key: string) => {
    const i = sectionKeys.indexOf(key);
    return i === -1 ? "" : `٠${arabicDigits[i + 1]}`;
  };
  const numbers = {
    works: numberOf("works"),
    services: numberOf("services"),
    experience: numberOf("experience"),
    about: numberOf("about"),
    blog: numberOf("blog"),
    reviews: numberOf("reviews"),
    request: numberOf("request"),
  };

  return (
    <div className="flex flex-col gap-14 pb-6">
      {/* بطاقة الملف */}
      <header className={cn(cardClass, "overflow-hidden")}>
        <div className="relative h-[190px] bg-jazan sm:h-[240px]">
          {cover ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={cover} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center overflow-hidden">
              <span className="pointer-events-none absolute -top-10 start-[-40px] h-44 w-44 rounded-full bg-white/[.05]" />
              <span className="pointer-events-none absolute -bottom-14 end-[-30px] h-52 w-52 rounded-full bg-amber/10" />
              <svg width="120" height="120" viewBox="0 0 100 100" fill="none" className="opacity-[.12]">
                <path d="M50 5 L88 19 V50 C88 74 71 91 50 97 C29 91 12 74 12 50 V19 Z" fill="#FAF8F4" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center px-5 pb-10 text-center sm:px-10">
          <div className="relative z-[1] -mt-16 h-32 w-32 overflow-hidden rounded-full border-4 border-surface bg-cream shadow-[0_8px_24px_rgba(28,42,38,.12)]">
            {avatar ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={avatar} alt={hero.name} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-[40px] font-extrabold text-jazan">
                {hero.name.trim().charAt(0)}
              </span>
            )}
          </div>

          <div className="mt-5 text-[11px] font-bold uppercase tracking-[2px] text-amber">
            {isAr ? "أبطال جازان · Jazan Heroes" : "Jazan Heroes · أبطال جازان"}
          </div>
          <h1 className="mt-2 text-[36px] font-extrabold leading-[1.1] tracking-[-.8px] text-charcoal sm:text-[44px]">
            {hero.name}
          </h1>
          <p className="mt-2 text-[17px] text-ink sm:text-[19px]">{hero.title}</p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <StatusBadge status={hero.status} />
            {details?.availabilityText ? (
              <>
                <span className="h-1 w-1 rounded-full bg-amber" />
                <span className="text-sm text-muted">{details.availabilityText}</span>
              </>
            ) : null}
            <span className="h-1 w-1 rounded-full bg-amber" />
            <span className="text-sm text-muted">
              {hero.city}
              {hero.city.includes("جازان") || hero.city.includes("جيزان")
                ? null
                : d.heroPage.region}
            </span>
            {hero.rating ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-charcoal">
                <StarFilledIcon className="h-4 w-4 text-amber" />
                <span className="mono">{hero.rating.toFixed(1)}</span>
              </span>
            ) : null}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center divide-x divide-x-reverse divide-line rounded-2xl border border-line bg-cream/60 py-2.5">
            <div className="flex flex-col gap-0.5 px-7">
              <span className="mono text-[22px] font-semibold text-charcoal">{works.length}</span>
              <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-muted">
                {isAr ? "أعمال" : "Works"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 px-7">
              <span className="mono text-[22px] font-semibold text-charcoal">
                {hero.skills.length}
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-muted">
                {isAr ? "مهارات" : "Skills"}
              </span>
            </div>
            {hero.years != null && hero.years > 0 ? (
              <div className="flex flex-col gap-0.5 px-7">
                <span className="mono text-[22px] font-semibold text-charcoal">+{hero.years}</span>
                <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-muted">
                  {isAr ? "سنوات خبرة" : "Years"}
                </span>
              </div>
            ) : null}
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            {whatsappDigits ? (
              <button
                type="button"
                onClick={() => openWhatsApp()}
                className="inline-flex cursor-pointer items-center gap-2.5 rounded-xl bg-jazan px-7 py-3 text-[15px] font-bold text-white shadow-[0_2px_8px_rgba(15,92,74,.22)] transition-[background-color,transform] hover:bg-jazan-dark active:translate-y-px"
              >
                <WhatsappIcon width={18} height={18} />
                {isAr ? "تواصل عبر واتساب" : "Contact on WhatsApp"}
              </button>
            ) : null}
            {details?.cvUrl ? (
              <a
                href={details.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-line bg-surface px-6 py-3 text-[15px] font-bold text-charcoal no-underline transition-colors hover:border-jazan hover:text-jazan"
              >
                {isAr ? "السيرة الذاتية" : "Résumé"} ↓
              </a>
            ) : null}
          </div>
        </div>
      </header>

      {/* معرض الأعمال */}
      <section id="works">
        <SectionMarker number={numbers.works} label="Portfolio" title={isAr ? "معرض الأعمال" : "Portfolio"} />
        {categories.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2.5">
            {[{ key: "all", label: isAr ? "الكل" : "All" }, ...categories.map((c) => ({ key: c, label: c }))].map(
              (c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setFilter(c.key)}
                  className={cn(
                    "cursor-pointer rounded-full border-[1.5px] px-4 py-1.5 text-[13px] font-semibold transition-colors",
                    filter === c.key
                      ? "border-jazan bg-jazan text-white"
                      : "border-line bg-surface text-charcoal hover:border-jazan/50"
                  )}
                >
                  {c.label}
                </button>
              )
            )}
          </div>
        ) : null}

        {shownWorks.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shownWorks.map((w) => (
              <figure key={w.id} className={cn(cardClass, "m-0 flex flex-col overflow-hidden")}>
                <div className="h-[200px]">
                  {w.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={w.image} alt={w.title} className="h-full w-full object-cover" />
                  ) : (
                    <ImagePlaceholder shape="rect" label={w.title} className="h-full w-full" />
                  )}
                </div>
                <figcaption className="flex items-center justify-between gap-3 px-4 py-3.5">
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-[14.5px] font-bold text-charcoal">{w.title}</span>
                    {w.category ? (
                      <span className="text-[11px] font-semibold uppercase tracking-[1.5px] text-muted">
                        {w.category}
                      </span>
                    ) : null}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLightbox(w)}
                    className="shrink-0 cursor-pointer rounded-[10px] border-[1.5px] border-line bg-surface px-3.5 py-2 text-[13px] font-semibold text-jazan transition-colors hover:border-jazan"
                  >
                    {isAr ? "عرض" : "View"}
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className={cn(cardClass, "mt-6 border-dashed py-14 text-center")}>
            <p className="text-[15px] font-semibold text-charcoal">
              {isAr ? "لا توجد أعمال معروضة بعد" : "No works showcased yet"}
            </p>
            <p className="mt-1 text-[13px] text-muted">
              {isAr ? "يضيفها البطل من لوحته — قسم «أعمالي»" : "The hero adds them from their dashboard"}
            </p>
          </div>
        )}
      </section>

      {/* عرض مكبّر */}
      {lightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal/60 p-5 sm:p-10"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[820px] overflow-hidden rounded-[18px] bg-surface"
          >
            <div className="max-h-[60vh] bg-cream/60">
              {lightbox.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={lightbox.image}
                  alt={lightbox.title}
                  className="max-h-[60vh] w-full object-contain"
                />
              ) : (
                <ImagePlaceholder shape="rect" label={lightbox.title} className="h-[320px] w-full" />
              )}
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-line px-6 py-4">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-[18px] font-extrabold text-charcoal">{lightbox.title}</span>
                {lightbox.desc ? (
                  <span className="text-[13.5px] leading-relaxed text-muted">{lightbox.desc}</span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                aria-label={isAr ? "إغلاق" : "Close"}
                className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-line text-charcoal transition-colors hover:bg-cream"
              >
                <XIcon width={16} height={16} />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* الخدمات والأسعار */}
      {services.length > 0 ? (
        <section id="services">
          <SectionMarker
            number={numbers.services}
            label="Services"
            title={isAr ? "الخدمات والأسعار" : "Services & Pricing"}
          />
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.name} className={cn(cardClass, "flex flex-col gap-3.5 p-7")}>
                <span className="text-[19px] font-extrabold text-charcoal">{s.name}</span>
                <span className="flex-1 text-[14px] leading-[1.8] text-muted">{s.desc}</span>
                {s.price.trim() ? (
                  <span className="text-[13px] font-bold tracking-[.5px] text-amber-dark">
                    {isAr ? `ابتداءً من ${s.price} ﷼` : `From ${s.price} SAR`}
                  </span>
                ) : null}
                {whatsappDigits ? (
                  <button
                    type="button"
                    onClick={scrollToRequest}
                    className="cursor-pointer self-start rounded-[10px] border-[1.5px] border-jazan/40 px-4 py-2 text-[13px] font-semibold text-jazan transition-colors hover:bg-jazan hover:text-white"
                  >
                    {isAr ? "اطلب الخدمة" : "Request service"}
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* الخبرة والشهادات */}
      {timeline.length > 0 || certs.length > 0 ? (
        <section>
          <SectionMarker
            number={numbers.experience}
            label="Experience"
            title={isAr ? "الخبرة والشهادات" : "Experience & Certifications"}
          />
          <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            {timeline.length > 0 ? (
              <div className={cn(cardClass, "flex flex-col px-7 py-4 sm:px-9")}>
                {timeline.map((t, i) => (
                  <div
                    key={`${t.years}-${t.role}`}
                    className={cn(
                      "flex gap-5 py-[18px]",
                      i < timeline.length - 1 && "border-b border-line"
                    )}
                  >
                    <div className="flex flex-col items-center gap-1.5 pt-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber" />
                      <span className="w-px flex-1 bg-line" />
                    </div>
                    <div className="flex flex-col gap-1 pb-1">
                      <span className="mono text-[12px] font-semibold tracking-[1px] text-muted">
                        {t.years}
                      </span>
                      <span className="text-[15.5px] font-bold text-charcoal">{t.role}</span>
                      {t.desc ? (
                        <span className="text-[13.5px] leading-[1.8] text-muted">{t.desc}</span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            {certs.length > 0 ? (
              <div className={cn(cardClass, "p-7 sm:p-9")}>
                <div className="mb-5 text-[11px] font-bold uppercase tracking-[2px] text-amber">
                  {isAr ? "شهادات واعتمادات" : "Certifications"}
                </div>
                <div className="flex flex-col gap-4">
                  {certs.map((c) => (
                    <div key={c.name} className="flex items-baseline gap-3">
                      <span className="h-1.5 w-1.5 flex-none -translate-y-0.5 rounded-full bg-amber" />
                      <span className="flex-1 text-[14.5px] text-charcoal">{c.name}</span>
                      {c.year ? <span className="mono text-[12px] text-muted">{c.year}</span> : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* نبذة ومهارات */}
      <section>
        <SectionMarker number={numbers.about} label="About" title={isAr ? "نبذة ومهارات" : "About & Skills"} />
        <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className={cn(cardClass, "p-7 sm:p-9")}>
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[2px] text-amber">
              {isAr ? "نبذة" : "About"}
            </div>
            <p className="m-0 text-[16px] leading-[1.95] text-ink">{bio}</p>
          </div>
          <div className={cn(cardClass, "p-7 sm:p-9")}>
            <div className="mb-5 text-[11px] font-bold uppercase tracking-[2px] text-amber">
              {isAr ? "المهارات" : "Skills"}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {hero.skills.length ? (
                hero.skills.map((skill) => <Tag key={skill}>{skill}</Tag>)
              ) : (
                <span className="text-[13px] text-muted">
                  {isAr ? "لم تُضف مهارات بعد" : "No skills added yet"}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* المدونة */}
      {posts.length > 0 ? (
        <section>
          <SectionMarker number={numbers.blog} label="Blog" title={isAr ? "المدونة" : "Blog"} />
          <div className="mt-6 flex flex-col gap-4">
            {posts.map((post) => (
              <article key={post.id} className={cn(cardClass, "p-6")}>
                <time className="text-[12px] font-medium text-muted">
                  {formatPostDate(post.createdAt, isAr)}
                </time>
                <p className="mt-1.5 whitespace-pre-line text-[14.5px] leading-[1.9] text-ink">
                  {post.content}
                </p>
                {post.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={post.image}
                    alt=""
                    className="mt-3 max-h-[320px] w-full rounded-[12px] border border-line object-cover"
                  />
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* آراء العملاء */}
      {hero.reviews?.length ? (
        <section>
          <SectionMarker
            number={numbers.reviews}
            label="Testimonials"
            title={isAr ? "آراء العملاء" : "Testimonials"}
          />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {hero.reviews.map((review) => (
              <article key={review.id} className={cn(cardClass, "p-6")}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[14px] font-bold text-charcoal">{review.author}</span>
                  <span className="inline-flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarFilledIcon
                        key={i}
                        className={
                          i < review.rating ? "h-3.5 w-3.5 text-amber" : "h-3.5 w-3.5 text-line"
                        }
                      />
                    ))}
                  </span>
                </div>
                <p className="mt-2.5 text-[14px] leading-[1.85] text-ink">{review.comment}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* اطلب خدمة */}
      {whatsappDigits ? (
        <section id="request">
          <SectionMarker number={numbers.request} label="Request" title={isAr ? "اطلب خدمة" : "Request a Service"} />
          <div className={cn(cardClass, "mt-6 max-w-[720px] p-7 sm:p-9")}>
            {reqSent ? (
              <p className="m-0 text-[18px] font-bold text-jazan">
                {isAr
                  ? "✓ فتحنا لك واتساب بتفاصيل طلبك — أكمل الإرسال من هناك."
                  : "✓ WhatsApp opened with your request — complete it there."}
              </p>
            ) : (
              <form onSubmit={submitRequest} className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-[13.5px] font-semibold text-charcoal">
                      {isAr ? "الاسم" : "Name"}
                    </span>
                    <input
                      value={reqName}
                      onChange={(e) => setReqName(e.target.value)}
                      placeholder={isAr ? "اسمكم الكريم" : "Your name"}
                      className="w-full rounded-xl border-[1.5px] border-line bg-surface px-4 py-3 text-[14px] text-charcoal outline-none transition-colors placeholder:text-muted/60 focus:border-jazan"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-[13.5px] font-semibold text-charcoal">
                      {isAr ? "الجوال" : "Phone"}
                    </span>
                    <input
                      dir="ltr"
                      value={reqPhone}
                      onChange={(e) => setReqPhone(e.target.value)}
                      placeholder="05XXXXXXXX"
                      className="w-full rounded-xl border-[1.5px] border-line bg-surface px-4 py-3 text-[14px] text-charcoal outline-none transition-colors placeholder:text-muted/60 focus:border-jazan"
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-2">
                  <span className="text-[13.5px] font-semibold text-charcoal">
                    {isAr ? "الخدمة المطلوبة" : "Requested service"}
                  </span>
                  <input
                    value={reqService}
                    onChange={(e) => setReqService(e.target.value)}
                    placeholder={isAr ? "مثال: تصميم شعار لمشروعي" : "e.g. logo design"}
                    className="w-full rounded-xl border-[1.5px] border-line bg-surface px-4 py-3 text-[14px] text-charcoal outline-none transition-colors placeholder:text-muted/60 focus:border-jazan"
                  />
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={!reqName.trim() || !reqService.trim()}
                    className="cursor-pointer rounded-xl bg-jazan px-7 py-3 text-[14.5px] font-bold text-white transition-colors hover:bg-jazan-dark disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isAr ? "أرسل الطلب" : "Send request"}
                  </button>
                  <span className="text-[13px] text-muted">
                    {isAr ? "يُرسل مباشرة إلى واتساب البطل" : "Sent directly to the hero's WhatsApp"}
                  </span>
                </div>
              </form>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
