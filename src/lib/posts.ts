"use client";

import { createClient } from "./supabase/client";

/**
 * مدونة الأعضاء — كل عضو ينشر منشورات نصية (مع صورة اختيارية)
 * تظهر في ملفه العام. مع Supabase تُحفظ في جدول posts وتظهر لجميع
 * الزوار، وبدونه تُحفظ محلياً في المتصفح (الوضع التجريبي).
 */

export type Post = {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
};

function storageKey(userId: string): string {
  return `jazanheroes.posts.${userId}`;
}

function loadLocal(userId: string): Post[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? (JSON.parse(raw) as Post[]) : [];
  } catch {
    return [];
  }
}

function saveLocal(userId: string, posts: Post[]): boolean {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(posts));
    return true;
  } catch {
    return false;
  }
}

type PostRow = {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

function rowToPost(row: PostRow): Post {
  return {
    id: row.id,
    content: row.content,
    image: row.image_url ?? undefined,
    createdAt: row.created_at,
  };
}

/** منشورات عضو معيّن — الأحدث أولاً */
export async function fetchPosts(authorId: string): Promise<Post[]> {
  const supabase = createClient();
  if (!supabase) return loadLocal(authorId);
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("id, content, image_url, created_at")
      .eq("author_id", authorId)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return (data as PostRow[]).map(rowToPost);
  } catch {
    return [];
  }
}

/** نشر منشور جديد — يعيد المنشور أو null عند الفشل */
export async function createPost(
  authorId: string,
  content: string,
  image?: string
): Promise<Post | null> {
  const supabase = createClient();
  if (!supabase) {
    const post: Post = {
      id: `p${Date.now()}`,
      content,
      image,
      createdAt: new Date().toISOString(),
    };
    const posts = [post, ...loadLocal(authorId)];
    return saveLocal(authorId, posts) ? post : null;
  }
  try {
    const { data, error } = await supabase
      .from("posts")
      .insert({ author_id: authorId, content, image_url: image ?? null })
      .select("id, content, image_url, created_at")
      .single();
    if (error || !data) return null;
    return rowToPost(data as PostRow);
  } catch {
    return null;
  }
}

/** حذف منشور — يعيد نجاح العملية */
export async function deletePost(authorId: string, postId: string): Promise<boolean> {
  const supabase = createClient();
  if (!supabase) {
    return saveLocal(
      authorId,
      loadLocal(authorId).filter((p) => p.id !== postId)
    );
  }
  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    return !error;
  } catch {
    return false;
  }
}

/** تاريخ عرض ودّي للمنشور */
export function formatPostDate(iso: string, isAr: boolean): string {
  try {
    return new Date(iso).toLocaleDateString(isAr ? "ar-SA-u-ca-gregory" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
