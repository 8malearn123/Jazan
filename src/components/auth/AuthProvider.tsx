"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { SessionUser, UserRole } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { matchDemoAccount, type DemoAccount } from "@/lib/demo";
import { addToRegistry } from "@/lib/registry";

// المصادقة: تستخدم Supabase عند ضبط المفاتيح، وإلا تعمل بوضع تجريبي (localStorage).

const STORAGE_KEY = "jazanheroes.session";

type Credentials = { email: string; password: string };
type SignUpInput = { name: string; email: string; password: string; role: UserRole };
type Result = {
  user?: SessionUser;
  error?: string;
  /** أُنشئ الحساب لكن يلزم تأكيد البريد قبل الدخول (وضع Supabase) */
  needsEmailConfirmation?: boolean;
};

type AuthContextValue = {
  user: SessionUser | null;
  ready: boolean;
  /** تسجيل الدخول */
  signIn: (c: Credentials) => Promise<Result>;
  /** إنشاء حساب */
  signUp: (c: SignUpInput) => Promise<Result>;
  /** دخول سريع بحساب ديمو */
  loginDemo: (account: DemoAccount) => SessionUser;
  /** تسجيل الخروج */
  logout: () => Promise<void>;
  /** ضبط جلسة مباشرة (للوضع التجريبي) */
  login: (user: SessionUser) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  // --- وضع Supabase ---
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    if (!supabase) return;

    let active = true;

    async function loadProfile(userId: string, fallbackEmail?: string) {
      const { data } = await supabase!
        .from("profiles")
        .select("name, role")
        .eq("id", userId)
        .single();
      if (!active) return;
      setUser({
        id: userId,
        name: data?.name || fallbackEmail?.split("@")[0] || "مستخدم",
        role: (data?.role as UserRole) || "hero",
        email: fallbackEmail,
      });
    }

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) loadProfile(data.user.id, data.user.email ?? undefined);
      if (active) setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id, session.user.email ?? undefined);
      } else {
        setUser(null);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // --- الوضع التجريبي (بدون مفاتيح) ---
  useEffect(() => {
    if (isSupabaseConfigured) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as SessionUser);
    } catch {
      // ignore
    }
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const login = useCallback((u: SessionUser) => {
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {
      // ignore
    }
  }, []);

  const loginDemo = useCallback((account: DemoAccount): SessionUser => {
    const u: SessionUser = {
      id: `demo-${account.role}`,
      name: account.name,
      role: account.role,
      email: account.email,
    };
    login(u);
    return u;
  }, [login]);

  const signIn = useCallback(async (c: Credentials): Promise<Result> => {
    const supabase = createClient();
    if (!supabase) {
      // وضع تجريبي — تعرّف على حسابات الديمو
      const demo = matchDemoAccount(c.email, c.password);
      const u: SessionUser = demo
        ? { id: `demo-${demo.role}`, name: demo.name, role: demo.role, email: demo.email }
        : { id: crypto.randomUUID(), name: c.email.split("@")[0], role: "hero", email: c.email };
      login(u);
      return { user: u };
    }
    const { data, error } = await supabase.auth.signInWithPassword(c);
    if (error) return { error: error.message };
    const userId = data.user?.id;
    let role: UserRole = "hero";
    let name = c.email.split("@")[0];
    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, role")
        .eq("id", userId)
        .single();
      if (profile?.role) role = profile.role as UserRole;
      if (profile?.name) name = profile.name;
    }
    return { user: { id: userId ?? "", name, role, email: c.email } };
  }, [login]);

  const signUp = useCallback(async (c: SignUpInput): Promise<Result> => {
    const supabase = createClient();
    if (!supabase) {
      const u: SessionUser = { id: crypto.randomUUID(), name: c.name, role: c.role, email: c.email };
      addToRegistry({ id: u.id, name: u.name, role: u.role });
      login(u);
      return { user: u };
    }
    const { data, error } = await supabase.auth.signUp({
      email: c.email,
      password: c.password,
      options: { data: { name: c.name, role: c.role } },
    });
    if (error) return { error: error.message };
    const u: SessionUser = { id: data.user?.id ?? "", name: c.name, role: c.role, email: c.email };
    addToRegistry({ id: u.id, name: u.name, role: u.role });
    // بدون جلسة فعّالة (تفعيل البريد مطلوب) لا يمكن دخول الداشبورد مباشرة.
    if (!data.session) return { user: u, needsEmailConfirmation: true };
    return { user: u };
  }, [login]);

  const logout = useCallback(async () => {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, signIn, signUp, loginDemo, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

/** أسماء الأدوار بالعربية */
export const roleLabels: Record<UserRole, string> = {
  hero: "بطل / مستقل",
  producer: "أسرة منتجة",
  company: "شركة / جهة",
  admin: "مشرف",
};
