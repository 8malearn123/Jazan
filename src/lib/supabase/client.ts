"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

/**
 * عميل Supabase لجهة المتصفح.
 * يُرجع null إن لم تُضبط المفاتيح (وضع البيانات التجريبية).
 */
export function createClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
