"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { ArrowLeftIcon, LockIcon, EyeIcon } from "@/components/icons";
import { useLocale } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

const inputWrap =
  "flex items-center gap-2.5 rounded-xl border-[1.5px] border-line bg-surface px-4 py-3 transition-[border-color,box-shadow] focus-within:border-jazan focus-within:shadow-[0_0_0_4px_rgba(15,92,74,.08)]";
const inputField =
  "min-w-0 flex-1 bg-transparent text-[15px] text-charcoal outline-none placeholder:text-muted/60";

type Stage = "checking" | "ready" | "invalid" | "done";

export default function ResetPasswordPage() {
  const { d } = useLocale();
  const [stage, setStage] = useState<Stage>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let settled = false;
    const settle = (s: Stage) => {
      if (!settled) {
        settled = true;
        setStage(s);
      }
    };
    if (!supabase) {
      settle("invalid");
      return;
    }
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) settle("ready");
    });
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        settle("ready");
        return;
      }
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        settle(exchangeError ? "invalid" : "ready");
        return;
      }
      setTimeout(async () => {
        const { data: later } = await supabase.auth.getSession();
        settle(later.session ? "ready" : "invalid");
      }, 1500);
    })();
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (password.length < 8) {
      setError(d.auth.resetShort);
      return;
    }
    if (password !== confirm) {
      setError(d.auth.resetMismatch);
      return;
    }
    setError("");
    setLoading(true);
    const supabase = createClient();
    if (!supabase) {
      setError(d.auth.resetErr);
      setLoading(false);
      return;
    }
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(d.auth.resetErr);
      setLoading(false);
      return;
    }
    await supabase.auth.signOut();
    setLoading(false);
    setStage("done");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="md" />
        </div>

        <div className="rounded-[22px] border border-line bg-surface p-7 shadow-[0_8px_28px_rgba(28,42,38,.06)] sm:p-9">
          {stage === "checking" ? (
            <p className="py-4 text-center text-[15px] text-muted">{d.auth.resetChecking}</p>
          ) : stage === "invalid" ? (
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-warn/15">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="text-warn-ink">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </span>
              <h1 className="mt-4 text-[22px] font-extrabold text-charcoal">{d.auth.resetInvalidTitle}</h1>
              <p className="mt-2 text-[15px] leading-8 text-muted">{d.auth.resetInvalidDesc}</p>
              <Link
                href="/forgot-password"
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-jazan px-5 py-2.5 text-sm font-bold text-white no-underline transition hover:brightness-110"
              >
                {d.auth.resetRequestNew}
              </Link>
            </div>
          ) : stage === "done" ? (
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <h1 className="mt-4 text-[22px] font-extrabold text-charcoal">{d.auth.resetDoneTitle}</h1>
              <p className="mt-2 text-[15px] leading-8 text-muted">{d.auth.resetDoneDesc}</p>
            </div>
          ) : (
            <>
              <h1 className="text-[24px] font-extrabold tracking-[-.4px] text-charcoal">
                {d.auth.resetTitle}
              </h1>
              <p className="mt-2 text-[15px] leading-7 text-muted">{d.auth.resetDesc}</p>
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
                <div>
                  <label htmlFor="new-password" className="mb-2 block text-[13px] font-semibold text-charcoal">
                    {d.auth.newPassword}
                  </label>
                  <div className={inputWrap}>
                    <LockIcon width={18} height={18} className="text-muted" />
                    <input
                      id="new-password"
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
                  <p className="mt-1.5 text-[12px] text-muted/80">{d.auth.passwordHint}</p>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="mb-2 block text-[13px] font-semibold text-charcoal">
                    {d.auth.confirmPassword}
                  </label>
                  <div className={inputWrap}>
                    <LockIcon width={18} height={18} className="text-muted" />
                    <input
                      id="confirm-password"
                      type={showPass ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      className={inputField}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                {error ? (
                  <p className="rounded-lg bg-warn/12 px-3 py-2 text-[13px] font-medium text-warn-ink">
                    {error}
                  </p>
                ) : null}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={!password || !confirm || loading}
                >
                  {loading ? d.auth.resetting : d.auth.resetBtn}
                </Button>
              </form>
            </>
          )}

          <Link
            href="/login"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-muted no-underline transition-colors hover:text-jazan"
          >
            <ArrowLeftIcon width={16} height={16} />
            {d.auth.backToLogin}
          </Link>
        </div>
      </div>
    </main>
  );
}
