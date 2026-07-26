"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { StarIcon, EyeIcon } from "@/components/icons";
import { useAuth } from "@/components/auth/AuthProvider";
import { homeForRole } from "@/lib/demo";
import { site } from "@/lib/site";
import { useLiveCounts } from "@/lib/registry";
import { useLocale } from "@/lib/i18n";

const REMEMBER_KEY = "jazanheroes.login.email";

const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-surface px-4 py-3.5 text-[14.5px] text-charcoal outline-none transition-[border-color,box-shadow] placeholder:text-muted/60 focus:border-jazan focus:shadow-[0_0_0_3px_rgba(15,92,74,.12)]";

export default function LoginPage() {
  const { d, isAr } = useLocale();
  const live = useLiveCounts();
  const heroStats = [
    { value: String(live.heroes), label: d.stats.heroes },
    { value: String(live.producers), label: d.stats.producers },
    { value: String(live.companies), label: d.stats.companies },
  ];
  const perks = isAr
    ? [
        { title: "ملف مهني جاهز للمشاركة", sub: "رابط واحد يعرض أعمالك ومهاراتك" },
        { title: "فرص عمل محلية موثّقة", sub: "وظائف ومشاريع من جهات داخل جازان" },
        { title: "بازار الأسر المنتجة", sub: "اعرض منتجاتك واستقبل الطلبات مباشرة" },
      ]
    : [
        { title: "A shareable professional profile", sub: "One link that showcases your work and skills" },
        { title: "Verified local opportunities", sub: "Jobs and projects from employers in Jazan" },
        { title: "Producing-families bazaar", sub: "Show your products and receive orders directly" },
      ];
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      if (saved) setEmail(saved);
    } catch {
      // ignore
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim() || loading) return;
    setError("");
    setLoading(true);
    try {
      if (remember) localStorage.setItem(REMEMBER_KEY, email.trim());
      else localStorage.removeItem(REMEMBER_KEY);
    } catch {
      // ignore
    }
    const { user, error } = await signIn({ email: email.trim(), password });
    if (error || !user) {
      setError(d.auth.loginErr);
      setLoading(false);
      return;
    }
    router.push(homeForRole(user.role));
  }

  return (
    <main className="grid min-h-screen bg-sand lg:grid-cols-2">
      {/* Form side — placed after the brand aside in RTL so the green side sits on the right */}
      <section className="flex flex-col items-center justify-center px-6 py-10 sm:px-10 lg:order-last">
        <div className="w-full max-w-[412px]">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo size="md" />
          </div>

          <div className="text-center">
            <h1 className="text-[29px] font-extrabold tracking-[-.5px] text-charcoal">
              {d.auth.loginTitle}
            </h1>
            <p className="mt-2 text-[14.5px] leading-[1.7] text-muted">
              {isAr
                ? "أدخل بريدك وكلمة المرور للوصول إلى حسابك"
                : "Enter your email and password to access your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4" noValidate>
            <label className="flex flex-col gap-2">
              <span className="text-[13.5px] font-semibold text-charcoal">{d.auth.email}</span>
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={`text-start ${inputClass}`}
                autoComplete="email"
              />
            </label>

            <label className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[13.5px] font-semibold text-charcoal">{d.auth.password}</span>
                <Link
                  href="/forgot-password"
                  className="text-[12.5px] font-medium text-jazan no-underline transition-colors hover:text-amber"
                >
                  {d.auth.forgot}
                </Link>
              </div>
              <div className="relative flex">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`pe-12 ${inputClass}`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? d.auth.hidePass : d.auth.showPass}
                  className="absolute bottom-0 end-3 top-0 flex cursor-pointer items-center text-muted transition-colors hover:text-jazan"
                >
                  <EyeIcon off={showPass} width={19} height={19} />
                </button>
              </div>
            </label>

            <button
              type="button"
              onClick={() => setRemember((v) => !v)}
              className="flex cursor-pointer items-center gap-2.5 self-start"
            >
              <span
                className={`flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border-[1.5px] transition-colors ${
                  remember ? "border-jazan bg-jazan" : "border-[#c9c4b7] bg-surface"
                }`}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FAF8F4"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={remember ? "opacity-100" : "opacity-0"}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="text-[13px] text-charcoal/80">
                {isAr ? "تذكّرني" : "Remember me"}
              </span>
            </button>

            {error ? (
              <div className="flex items-center gap-2.5 rounded-[11px] border border-warn/30 bg-warn/12 px-3.5 py-3">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  className="shrink-0 text-warn-ink"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                <span className="text-[13px] font-medium text-warn-ink">{error}</span>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!email.trim() || !password.trim() || loading}
              className="cursor-pointer rounded-xl bg-jazan p-[15px] text-center text-[15px] font-bold text-white shadow-[0_2px_8px_rgba(15,92,74,.22)] transition-[background-color,transform] hover:bg-jazan-dark active:translate-y-px disabled:opacity-60"
            >
              {loading ? d.auth.loggingIn : d.auth.loginBtn}
            </button>

            <p className="text-center text-[13.5px] leading-[1.8] text-muted">
              {d.auth.noAccount}{" "}
              <Link
                href="/register"
                className="font-bold text-jazan no-underline transition-colors hover:text-amber"
              >
                {d.auth.registerLink}
              </Link>
            </p>
          </form>

          <p className="mt-6 text-center text-[11.5px] leading-[1.9] text-muted/70">
            {d.auth.terms1}{" "}
            <Link href="/terms" className="text-muted underline">
              {d.auth.termsLink}
            </Link>{" "}
            {d.auth.and}
            <Link href="/privacy" className="text-muted underline">
              {d.auth.privacyLink}
            </Link>
          </p>
        </div>
      </section>

      {/* Brand side */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-jazan p-14 lg:order-first lg:flex">
        <svg
          width="520"
          height="520"
          viewBox="0 0 100 100"
          fill="none"
          className="pointer-events-none absolute -top-[90px] left-[-140px] opacity-[.07]"
        >
          <path d="M50 5 L88 19 V50 C88 74 71 91 50 97 C29 91 12 74 12 50 V19 Z" fill="#FAF8F4" />
        </svg>
        <svg
          width="300"
          height="300"
          viewBox="0 0 100 100"
          fill="none"
          className="pointer-events-none absolute -bottom-[70px] right-[-60px] opacity-[.06]"
        >
          <path d="M50 5 L88 19 V50 C88 74 71 91 50 97 C29 91 12 74 12 50 V19 Z" fill="#E8932E" />
        </svg>

        <div className="relative flex max-w-[460px] flex-col gap-5">
          <Link href="/" className="flex items-center gap-3 self-start no-underline">
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-white/[.12]">
              <StarIcon width={26} height={26} className="text-amber" strokeWidth={2.1} />
            </span>
            <span className="text-xl font-extrabold text-white">
              {isAr ? site.name : "Jazan Heroes"}
            </span>
          </Link>

          <div className="mt-4 inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/[.12] px-3.5 py-[7px] text-[12.5px] font-semibold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-amber" />
            {isAr
              ? "متاحة للجميع — مستقلين، أسر منتجة، جهات عمل"
              : "Open to all — freelancers, producing families, employers"}
          </div>
          <h2 className="text-balance text-[40px] font-extrabold leading-[1.35] tracking-[-.8px] text-white">
            {isAr ? "مواهب جازان في مكان واحد" : "Jazan's talent, in one place"}
          </h2>
          <p className="text-[15.5px] leading-[1.95] text-white/[.76]">
            {isAr
              ? "سجّل دخولك لإدارة ملفك، متابعة الطلبات، والتقديم على الفرص في منطقة جازان."
              : "Sign in to manage your profile, follow orders, and apply for opportunities across the Jazan region."}
          </p>
        </div>

        <div className="relative flex flex-col gap-4">
          {perks.map((perk) => (
            <div key={perk.title} className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white/[.14]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#E8932E"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <div className="flex flex-col gap-[3px] pt-[3px]">
                <div className="text-[14.5px] font-semibold text-white">{perk.title}</div>
                <div className="text-[13px] leading-[1.7] text-white/[.66]">{perk.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative flex gap-8 pt-2">
          {heroStats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <div className="mono text-[26px] font-medium text-amber">{s.value}</div>
              <div className="text-[12.5px] text-white/60">{s.label}</div>
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
}
