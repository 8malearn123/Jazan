import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * عميل Supabase لجهة الخادم (يقرأ/يكتب الجلسة عبر الكوكيز).
 * يُرجع null إن لم تُضبط المفاتيح.
 */
export async function createClient() {
  if (!isSupabaseConfigured) return null;

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // يُستدعى من Server Component — يمكن تجاهله مع وجود middleware لتحديث الجلسة.
        }
      },
    },
  });
}
