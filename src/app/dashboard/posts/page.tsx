"use client";

import { useEffect, useState } from "react";
import { XIcon, ImagesIcon, PenIcon } from "@/components/icons";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLocale } from "@/lib/i18n";
import {
  createPost,
  deletePost,
  fetchPosts,
  formatPostDate,
  type Post,
} from "@/lib/posts";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 900;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}

export default function PostsPage() {
  const { user } = useAuth();
  const { isAr } = useLocale();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetchPosts(user.id).then((list) => {
      if (cancelled) return;
      setPosts(list);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  async function pickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setImage(await fileToDataUrl(file));
      setError("");
    } catch {
      setError("تعذّرت قراءة الصورة — جرّب ملفاً آخر (JPG أو PNG).");
    }
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    const text = content.trim();
    if (!text || !user || publishing) return;
    setPublishing(true);
    setError("");
    const post = await createPost(user.id, text, image ?? undefined);
    setPublishing(false);
    if (!post) {
      setError(
        "تعذّر النشر — تأكد من تنفيذ ملف supabase/posts.sql في مشروع Supabase، أو جرّب صورة أصغر."
      );
      return;
    }
    setPosts((prev) => [post, ...prev]);
    setContent("");
    setImage(null);
  }

  async function handleDelete(postId: string) {
    if (!user) return;
    const ok = await deletePost(user.id, postId);
    if (ok) setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  return (
    <div className="mx-auto w-full max-w-[720px] pb-10">
      <h1 className="text-[18px] font-extrabold text-charcoal">مدونتي</h1>
      <p className="mt-0.5 text-[13px] text-muted">
        شارك أخبارك وإنجازاتك وما تعمل عليه — منشوراتك تظهر في ملفك العام أمام الزوار.
      </p>

      <form onSubmit={handlePublish} className="mt-5 rounded-[16px] border border-line bg-surface p-5">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="بمَ تشارك مجتمع جازان اليوم؟ إنجاز جديد، مشروع أنهيته، خبر يسرّ عملاءك…"
          className="w-full resize-none rounded-xl border-[1.5px] border-line bg-surface px-4 py-3 text-[14.5px] leading-[1.8] text-charcoal outline-none transition-[border-color,box-shadow] placeholder:text-muted/60 focus:border-jazan focus:shadow-[0_0_0_3px_rgba(166,63,43,.12)]"
        />

        {image ? (
          <div className="relative mt-3 inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt="معاينة صورة المنشور"
              className="max-h-[220px] rounded-[12px] border border-line object-cover"
            />
            <button
              type="button"
              onClick={() => setImage(null)}
              aria-label="إزالة الصورة"
              className="absolute -end-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-danger text-white shadow"
            >
              <XIcon width={12} height={12} />
            </button>
          </div>
        ) : null}

        {error ? (
          <p className="mt-3 rounded-lg bg-warn/12 px-3 py-2 text-[13px] font-medium text-warn-ink">{error}</p>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-[1.5px] border-line bg-surface px-4 py-2 text-[13px] font-semibold text-charcoal transition-colors hover:border-jazan hover:text-jazan">
            <ImagesIcon width={16} height={16} />
            {image ? "تغيير الصورة" : "إضافة صورة"}
            <input type="file" accept="image/*" className="hidden" onChange={pickImage} />
          </label>
          <button
            type="submit"
            disabled={!content.trim() || publishing}
            className="cursor-pointer rounded-xl bg-jazan px-7 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-jazan-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            {publishing ? "جارٍ النشر…" : "نشر"}
          </button>
        </div>
      </form>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-charcoal">
          منشوراتي <span className="mono font-medium text-muted">({posts.length})</span>
        </h2>
      </div>

      {loaded && posts.length === 0 ? (
        <div className="mt-3 rounded-[16px] border border-dashed border-line bg-surface py-14 text-center">
          <PenIcon className="mx-auto text-muted/50" width={28} height={28} />
          <p className="mt-3 text-[15px] font-semibold text-charcoal">لا توجد منشورات بعد</p>
          <p className="mt-1 text-[13px] text-muted">اكتب أول منشور من النموذج بالأعلى.</p>
        </div>
      ) : null}

      <div className="mt-3 flex flex-col gap-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group rounded-[16px] border border-line bg-surface p-5 transition-[border-color] hover:border-jazan/40"
          >
            <div className="flex items-start justify-between gap-3">
              <time className="text-[12px] font-medium text-muted">
                {formatPostDate(post.createdAt, isAr)}
              </time>
              <button
                type="button"
                onClick={() => handleDelete(post.id)}
                aria-label="حذف المنشور"
                title="حذف"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-danger opacity-0 transition-opacity hover:bg-danger-soft group-hover:opacity-100"
              >
                <XIcon width={15} height={15} />
              </button>
            </div>
            <p className="mt-2 whitespace-pre-line text-[14.5px] leading-[1.9] text-ink">
              {post.content}
            </p>
            {post.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={post.image}
                alt=""
                className="mt-3 max-h-[340px] w-full rounded-[12px] border border-line object-cover"
              />
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
