"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { StarIcon, MailIcon, LockIcon, EyeIcon } from "@/components/icons";
import { useAuth } from "@/components/auth/AuthProvider";
import { demoAccounts, homeForRole } from "@/lib/demo";
import { site } from "@/lib/site";
import { counts } from "@/lib/stats";
import { useLocale } from "@/lib/i18n";

const inputWrap =
  "flex items-center gap-2.5 rounded-xl border-[1.5px] border-line bg-surface px-4 py-3 transition-[border-color,box-shadow] focus-within:border-jazan focus-within:shadow-[0_0_0_4px_rgba(15,92,74,.08)]";
const inputField =
  "min-w-0 flex-1 bg-transparent text-[15px] text-charcoal outline-none placeholder:text-muted/60";

export default function LoginPage() {
  const { d, isAr } = useLocale();
  const heroStats = [
    { value: String(counts.heroes), label: d.stats.heroes },
    { value: String(counts.producers), label: d.stats.producers },
    { value: String(counts.companies), label: d.stats.companies },
  ];
  const router = useRouter();
  const { signIn, loginDemo } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim() || loading) return;
    setError("");
    setLoading(true);
    const { user, error } = await signIn({ email: email.trim(), password });
    if (error || !user) {
      setError(d.auth.loginErr);
      setLoading(false);
      return;
    }
    router.push(homeForRole(user.role));
  }

  function handleDemo(account: (typeof demoAccounts)[number]) {
    const user = loginDemo(account);
    router.push(homeForRole(user.role));
  }

  return (
    <main className="flex min-h-screen flex-col bg-sand md:flex-row">
      {/* لوحة العلامة التجارية */}
      <aside className="relative flex flex-col justify-between overflow-hidden bg-jazan p-8 md:w-[46%] md:p-12">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-white/[.12]">
            <StarIcon width={26} height={26} className="text-amber" strokeWidth={2.1} />
          </span>
          <span className="text-xl font-extrabold text-white md:text-[21px]">
            {isAr ? site.name : "Jazan Heroes"}
          </span>
        </Link>

        <div className="my-10 md:my-0">
          <h2 className="text-balance text-[30px] font-extrabold leading-[1.25] tracking-[-.5px] text-white md:text-[34px]">
            {d.auth.asideLoginTitle1}
            <br />
            {d.auth.asideLoginTitle2}
          </h2>
          <p className="mt-4 max-w-[340px] text-[15px] leading-[1.8] text-white/70 md:text-base">
            {d.auth.asideLoginDesc}
          </p>
          <div className="mt-7 flex items-center gap-6">
            {heroStats.map((s) => (
              <div key={s.label}>
                <div className="mono text-2xl font-semibold text-amber">
                  {s.value}
                </div>
                <div className="text-[13px] text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <span className="pointer-events-none absolute -bottom-16 start-[-60px] h-52 w-52 rounded-full bg-white/[.04]" />
        <span className="pointer-events-none absolute top-10 start-[-40px] h-32 w-32 rounded-full bg-amber/10" />
      </aside>

      {/* لوحة النموذج */}
      <section className="flex flex-1 flex-col justify-center bg-cream px-6 py-10 sm:px-10 md:px-14">
        <div className="mx-auto w-full max-w-[420px]">
          <div className="mb-8 md:hidden">
            <Logo size="md" />
          </div>

          <h1 className="text-[26px] font-extrabold tracking-[-.4px] text-charcoal md:text-[28px]">
            {d.auth.loginTitle}
          </h1>
          <p className="mt-2 text-[15px] text-muted">
            {d.auth.noAccount}{" "}
            <Link
              href="/register"
              className="font-semibold text-jazan no-underline hover:underline"
            >
              {d.auth.registerLink}
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-6" noValidate>
            <label
              htmlFor="email"
              className="mb-2 block text-[13px] font-semibold text-charcoal"
            >
              {d.auth.email}
            </label>
            <div className={inputWrap}>
              <MailIcon width={18} height={18} className="text-muted" />
              <input
                id="email"
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mohammed@email.com"
                className={`mono text-start ${inputField}`}
                autoComplete="email"
              />
            </div>

            <label
              htmlFor="password"
              className="mb-2 mt-[18px] block text-[13px] font-semibold text-charcoal"
            >
              {d.auth.password}
            </label>
            <div className={inputWrap}>
              <LockIcon width={18} height={18} className="text-muted" />
              <input
                id="password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputField}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? d.auth.hidePass : d.auth.showPass}
                className="text-muted/70 transition-colors hover:text-muted"
              >
                <EyeIcon off={showPass} width={18} height={18} />
              </button>
            </div>

            <div className="mt-2.5 text-start">
              <Link
                href="/forgot-password"
                className="text-[13px] font-semibold text-jazan no-underline hover:underline"
              >
                {d.auth.forgot}
              </Link>
            </div>

            {error ? (
              <p className="mt-4 rounded-lg bg-warn/12 px-3 py-2 text-[13px] font-medium text-warn-ink">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              size="lg"
              className="mt-5 w-full"
              disabled={!email.trim() || !password.trim() || loading}
            >
              {loading ? d.auth.loggingIn : d.auth.loginBtn}
            </Button>
          </form>

          {/* حسابات الديمو — دخول سريع للتجربة */}
          <div className="mt-7">
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <span className="text-[12px] font-medium text-muted">{d.auth.tryDemo}</span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleDemo(acc)}
                  className="flex flex-col items-start rounded-xl border border-line bg-surface px-3.5 py-2.5 text-start transition-colors hover:border-jazan hover:bg-jazan/[.03]"
                >
                  <span className="text-[13px] font-bold text-charcoal">{d.demo[acc.role].label}</span>
                  <span className="text-[11px] text-muted">{d.demo[acc.role].hint}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-5 text-center text-[12px] leading-[1.7] text-muted/70">
            {d.auth.terms1}{" "}
            <Link href="/terms" className="text-muted hover:underline">
              {d.auth.termsLink}
            </Link>{" "}
            {d.auth.and}
            <Link href="/privacy" className="text-muted hover:underline">
              {d.auth.privacyLink}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
