"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import {
  StarIcon,
  UsersIcon,
  StoreIcon,
  BuildingIcon,
  CheckIcon,
  MailIcon,
  LockIcon,
  UserIcon,
  EyeIcon,
  MapPinIcon,
} from "@/components/icons";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/cn";
import { homeForRole } from "@/lib/demo";
import { governorates } from "@/lib/jazan-map";
import { site } from "@/lib/site";
import { useLiveCounts } from "@/lib/registry";
import { useLocale } from "@/lib/i18n";
import type { UserRole } from "@/lib/types";

type RoleChoice = Extract<UserRole, "hero" | "producer" | "company">;

const roleStyles: {
  value: RoleChoice;
  Icon: typeof UsersIcon;
  accent: string;
  iconBg: string;
  iconText: string;
}[] = [
  { value: "hero", Icon: UsersIcon, accent: "text-jazan", iconBg: "bg-jazan/10", iconText: "text-jazan" },
  { value: "producer", Icon: StoreIcon, accent: "text-amber-dark", iconBg: "bg-amber/14", iconText: "text-amber-dark" },
  { value: "company", Icon: BuildingIcon, accent: "text-info-ink", iconBg: "bg-info/12", iconText: "text-info-ink" },
];

const inputWrap =
  "flex items-center gap-2.5 rounded-xl border-[1.5px] border-line bg-surface px-4 py-3 transition-[border-color,box-shadow] focus-within:border-jazan focus-within:shadow-[0_0_0_4px_rgba(15,92,74,.08)]";
const inputField =
  "min-w-0 flex-1 bg-transparent text-[15px] text-charcoal outline-none placeholder:text-muted/60";

function RegisterForm() {
  const { d, isAr } = useLocale();
  const live = useLiveCounts();
  const heroStats = [
    { value: String(live.heroes), label: d.stats.heroes },
    { value: String(live.producers), label: d.stats.producers },
    { value: String(live.companies), label: d.stats.companies },
  ];
  const roles = roleStyles.map((r) => ({ ...r, ...d.categories[r.value] }));
  const router = useRouter();
  const { signUp } = useAuth();
  const params = useSearchParams();

  const paramRole = params.get("role");
  const initialRole: RoleChoice =
    paramRole === "producer" || paramRole === "company" ? paramRole : "hero";

  const [role, setRole] = useState<RoleChoice>(initialRole);
  const [name, setName] = useState("");
  const [city, setCity] = useState("جيزان");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmEmailSent, setConfirmEmailSent] = useState(false);

  const canSubmit = name.trim() && email.trim() && password.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setError("");
    setLoading(true);
    const { user, error, needsEmailConfirmation } = await signUp({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      city,
    });
    if (error || !user) {
      setError(d.auth.registerErr);
      setLoading(false);
      return;
    }
    if (needsEmailConfirmation) {
      setConfirmEmailSent(true);
      setLoading(false);
      return;
    }
    router.push(homeForRole(user.role));
  }

  return (
    <main className="flex min-h-screen flex-col bg-sand md:flex-row">
      <aside className="relative flex flex-col justify-between overflow-hidden bg-jazan p-8 md:w-[42%] md:p-12">
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
            {d.auth.asideRegisterTitle1}
            <br />
            {d.auth.asideRegisterTitle2}
          </h2>
          <p className="mt-4 max-w-[340px] text-[15px] leading-[1.8] text-white/70 md:text-base">
            {d.auth.asideRegisterDesc}
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

      <section className="flex flex-1 flex-col justify-center bg-cream px-6 py-10 sm:px-10 md:px-14">
        <div className="mx-auto w-full max-w-[460px]">
          <div className="mb-8 md:hidden">
            <Logo size="md" />
          </div>

          <h1 className="text-[26px] font-extrabold tracking-[-.4px] text-charcoal md:text-[28px]">
            {d.auth.registerTitle}
          </h1>
          <p className="mt-2 text-[15px] text-muted">
            {d.auth.haveAccount}{" "}
            <Link
              href="/login"
              className="font-semibold text-jazan no-underline hover:underline"
            >
              {d.auth.loginLink}
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-6" noValidate>
            <span className="mb-3 block text-[13px] font-semibold text-charcoal">
              {d.auth.howJoin}
            </span>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {roles.map((r) => {
                const active = role === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    aria-pressed={active}
                    className={cn(
                      "group relative flex flex-row items-center gap-3 rounded-2xl border-[1.5px] bg-surface p-3.5 text-start transition-[border-color,box-shadow,transform] sm:flex-col sm:items-start sm:gap-0 sm:p-4",
                      active
                        ? "border-jazan shadow-[0_10px_26px_rgba(15,92,74,.12)]"
                        : "border-line hover:-translate-y-0.5 hover:border-jazan/40 hover:shadow-[0_10px_26px_rgba(28,42,38,.08)]"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-11 w-11 flex-none items-center justify-center rounded-[14px] sm:mb-3",
                        r.iconBg
                      )}
                    >
                      <r.Icon className={r.iconText} width={24} height={24} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-bold text-charcoal sm:text-base">
                        {r.title}
                      </span>
                      <span className="mt-1 hidden text-[12px] leading-[1.55] text-muted sm:block">
                        {r.desc}
                      </span>
                    </span>
                    {active ? (
                      <span className="absolute end-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-jazan text-white">
                        <CheckIcon width={13} height={13} strokeWidth={2.6} />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <label
              htmlFor="name"
              className="mb-2 mt-[18px] block text-[13px] font-semibold text-charcoal"
            >
              {d.auth.fullName}
            </label>
            <div className={inputWrap}>
              <UserIcon width={18} height={18} className="text-muted" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={d.auth.namePh}
                className={inputField}
                autoComplete="name"
              />
            </div>

            <label
              htmlFor="city"
              className="mb-2 mt-[18px] block text-[13px] font-semibold text-charcoal"
            >
              {d.auth.govLabel}
            </label>
            <div className={inputWrap}>
              <MapPinIcon width={18} height={18} className="text-muted" />
              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`${inputField} cursor-pointer bg-transparent`}
              >
                {governorates.map((g) => (
                  <option key={g.id} value={g.ar}>
                    {isAr ? g.ar : g.en}
                  </option>
                ))}
              </select>
            </div>

            <label
              htmlFor="email"
              className="mb-2 mt-[18px] block text-[13px] font-semibold text-charcoal"
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
                autoComplete="new-password"
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
            <p className="mt-[7px] text-[12px] text-muted/70">
              {d.auth.passwordHint}
            </p>

            {error ? (
              <p className="mt-4 rounded-lg bg-warn/12 px-3 py-2 text-[13px] font-medium text-warn-ink">
                {error}
              </p>
            ) : null}

            {confirmEmailSent ? (
              <p className="mt-4 rounded-lg bg-success/12 px-3 py-2.5 text-[13px] font-medium leading-relaxed text-success-ink">
                {d.auth.confirmPrefix}
                <span className="mono font-semibold" dir="ltr">{email.trim()}</span>
                {d.auth.confirmSuffix}
                <Link href="/login" className="font-bold text-success-ink underline">
                  {d.auth.confirmLogin}
                </Link>
                .
              </p>
            ) : null}

            <Button
              type="submit"
              size="lg"
              className="mt-6 w-full"
              disabled={!canSubmit || loading || confirmEmailSent}
            >
              {loading ? d.auth.creating : d.auth.createBtn}
            </Button>
          </form>

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

export default function RegisterPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-cream" aria-hidden="true" />}
    >
      <RegisterForm />
    </Suspense>
  );
}
