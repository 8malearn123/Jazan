# أبطال جازان | Jazan Heroes

منصة جازان المجتمعية للمواهب — تربط المستقلين والباحثين عن عمل، والأسر المنتجة
والصُنّاع، بالشركات والجهات في منطقة جازان، مع تواصل مباشر عبر واتساب.

A community talent platform for the Jazan region, built with [Next.js](https://nextjs.org).

## التقنيات | Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Supabase** (اختياري — قاعدة بيانات ومصادقة وتخزين)
- واجهة عربية بدعم RTL وخط Alexandria

## أقسام المنصة | Features

| القسم | الوصف |
| --- | --- |
| تصفّح الأبطال `/browse` | بحث وتصفية للمستقلين والباحثين عن عمل (بحث، مدينة، حالة التوفّر) |
| الأسر المنتجة `/producers` | متاجر الأسر المنتجة والصُنّاع مع منتجاتها وطلب مباشر عبر واتساب |
| الشركات `/companies` | ملفات الشركات وفرصها الوظيفية والتقديم عبر واتساب |
| لوحة التحكم `/dashboard` | إدارة الملف الشخصي (بطل / أسرة / شركة) |
| لوحة المشرف `/admin` | إحصائيات، طلبات التوثيق، البلاغات، إدارة المستخدمين |

## وضعا التشغيل | Modes

- **الوضع التجريبي (الافتراضي):** بدون أي إعداد — بيانات تجريبية من `src/lib/data.ts`
  وحسابات ديمو جاهزة في صفحة الدخول، والجلسة تُحفظ في المتصفح.
- **وضع Supabase:** عند ضبط المفاتيح في `.env.local` تتحوّل المصادقة والبيانات
  لقاعدة البيانات الحقيقية. راجع [دليل إعداد الباك-إند](docs/BACKEND_SETUP.md).

## التشغيل محلياً | Getting Started

```bash
npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

## الأوامر | Scripts

| الأمر | الوصف |
| --- | --- |
| `npm run dev` | تشغيل خادم التطوير |
| `npm run build` | بناء نسخة الإنتاج |
| `npm run start` | تشغيل نسخة الإنتاج |
| `npm run lint` | فحص الكود |

## بنية المشروع | Project Structure

```
src/
├── app/               # صفحات App Router
│   ├── (site)/        # الصفحات العامة (تصفّح، أسر منتجة، شركات، …)
│   ├── admin/         # لوحة المشرف
│   ├── dashboard/     # لوحة تحكم المستخدم
│   └── login|register # المصادقة
├── components/        # مكوّنات مشتركة (ui, layout, home, hero, icons)
└── lib/               # الأنواع، البيانات التجريبية، إعدادات الموقع، Supabase
supabase/schema.sql    # مخطط قاعدة البيانات وسياسات RLS
docs/BACKEND_SETUP.md  # دليل إعداد Supabase خطوة بخطوة
design-reference/      # مراجع التصميم الأصلية (HTML ثابت — ليست جزءاً من التطبيق)
```

## النشر | Deployment

يُنشر المشروع تلقائياً على [Vercel](https://vercel.com) عند كل `push` إلى GitHub.
لتفعيل الباك-إند أضف متغيّري `NEXT_PUBLIC_SUPABASE_URL` و`NEXT_PUBLIC_SUPABASE_ANON_KEY`
في إعدادات المشروع على Vercel.
