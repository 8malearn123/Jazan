"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import {
  UsersIcon,
  StoreIcon,
  BuildingIcon,
  CheckIcon,
  EyeIcon,
} from "@/components/icons";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/cn";
import { homeForRole } from "@/lib/demo";
import { governorates } from "@/lib/jazan-map";
import { useLiveCounts } from "@/lib/registry";
import { useLocale } from "@/lib/i18n";
import type { UserRole } from "@/lib/types";

type RoleChoice = Extract<UserRole, "hero" | "producer" | "company">;

const roleStyles: {
  value: RoleChoice;
  Icon: typeof UsersIcon;
  iconBg: string;
  iconText: string;
}[] = [
  { value: "hero", Icon: UsersIcon, iconBg: "bg-jazan/10", iconText: "text-jazan" },
  { value: "producer", Icon: StoreIcon, iconBg: "bg-amber/14", iconText: "text-amber-dark" },
  { value: "company", Icon: BuildingIcon, iconBg: "bg-info/12", iconText: "text-info-ink" },
];

const inputClass =
  "w-full rounded-xl border-[1.5px] border-line bg-surface px-4 py-3.5 text-[14.5px] text-charcoal outline-none transition-[border-color,box-shadow] placeholder:text-muted/60 focus:border-jazan focus:shadow-[0_0_0_3px_rgba(166,63,43,.12)]";

function RegisterForm() {
  const { d, isAr } = useLocale();
  const live = useLiveCounts();
  const heroStats = [
    { value: String(live.heroes), label: d.stats.heroes },
    { value: String(live.producers), label: d.stats.producers },
    { value: String(live.companies), label: d.stats.companies },
  ];
  const perks = isAr
    ? [
        { title: "ملف احترافي في دقائق", sub: "صفحة تعريفية جاهزة تشاركها برابط واحد" },
        { title: "تواصل مباشر عبر واتساب", sub: "العملاء وأصحاب الفرص يصلونك بضغطة زر" },
        { title: "حضور في مجتمع جازان", sub: "مكانك الطبيعي بين مواهب المنطقة وفرصها" },
      ]
    : [
        { title: "A professional profile in minutes", sub: "A ready page you share with one link" },
        { title: "Direct WhatsApp contact", sub: "Clients and employers reach you in one tap" },
        { title: "Presence in Jazan's community", sub: "Your place among the region's talent" },
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
    <main className="grid min-h-screen bg-sand lg:grid-cols-2">
      {/* Brand side — يمين في RTL */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-jazan p-14 lg:flex">
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
          <path d="M50 5 L88 19 V50 C88 74 71 91 50 97 C29 91 12 74 12 50 V19 Z" fill="#72A98F" />
        </svg>

        <div className="relative flex max-w-[460px] flex-col gap-5">
          <Link href="/" className="self-start no-underline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/forsa-logo-white.svg" alt="فرصة — FORSA" className="h-[54px] w-auto" />
          </Link>

          <div className="mt-4 inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/[.12] px-3.5 py-[7px] text-[12.5px] font-semibold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-amber" />
            {isAr ? "التسجيل مجاني — ويستغرق أقل من دقيقة" : "Free to join — takes under a minute"}
          </div>
          <h2 className="text-balance text-[40px] font-extrabold leading-[1.35] tracking-[-.8px] text-white">
            {isAr ? "انضم لمجتمع مواهب جازان" : "Join Jazan's talent community"}
          </h2>
          <p className="text-[15.5px] leading-[1.95] text-white/[.76]">
            {d.auth.asideRegisterDesc}
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
                  stroke="#72A98F"
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

      {/* Form side */}
      <section className="flex flex-col items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-[460px]">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo size="md" />
          </div>

          <div className="text-center">
            <h1 className="text-[29px] font-extrabold tracking-[-.5px] text-charcoal">
              {d.auth.registerTitle}
            </h1>
            <p className="mt-2 text-[14.5px] leading-[1.7] text-muted">
              {d.auth.haveAccount}{" "}
              <Link
                href="/login"
                className="font-bold text-jazan no-underline transition-colors hover:text-amber"
              >
                {d.auth.loginLink}
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4" noValidate>
            <div>
              <span className="mb-2 block text-[13.5px] font-semibold text-charcoal">
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
                        "group relative flex cursor-pointer flex-row items-center gap-3 rounded-2xl border-[1.5px] bg-surface p-3.5 text-start transition-[border-color,box-shadow,transform] sm:flex-col sm:items-start sm:gap-0 sm:p-4",
                        active
                          ? "border-jazan shadow-[0_10px_26px_rgba(166,63,43,.12)]"
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
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-[13.5px] font-semibold text-charcoal">{d.auth.fullName}</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={d.auth.namePh}
                className={inputClass}
                autoComplete="name"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[13.5px] font-semibold text-charcoal">{d.auth.govLabel}</span>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                {governorates.map((g) => (
                  <option key={g.id} value={g.ar}>
                    {isAr ? g.ar : g.en}
                  </option>
                ))}
              </select>
            </label>

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
                <span className="text-[12px] text-muted/80">{d.auth.passwordHint}</span>
              </div>
              <div className="relative flex">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`pe-12 ${inputClass}`}
                  autoComplete="new-password"
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

            {confirmEmailSent ? (
              <p className="rounded-[11px] border border-success/30 bg-success/12 px-3.5 py-3 text-[13px] font-medium leading-relaxed text-success-ink">
                {d.auth.confirmPrefix}
                <span className="mono font-semibold" dir="ltr">{email.trim()}</span>
                {d.auth.confirmSuffix}
                <Link href="/login" className="font-bold text-success-ink underline">
                  {d.auth.confirmLogin}
                </Link>
                .
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit || loading || confirmEmailSent}
              className="cursor-pointer rounded-xl bg-jazan p-[15px] text-center text-[15px] font-bold text-white shadow-[0_2px_8px_rgba(166,63,43,.22)] transition-[background-color,transform] hover:bg-jazan-dark active:translate-y-px disabled:opacity-60"
            >
              {loading ? d.auth.creating : d.auth.createBtn}
            </button>
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
