import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream px-6 text-center">
      <Logo size="md" />
      <div className="mono text-[64px] font-extrabold leading-none text-jazan/20 sm:text-[88px]">
        404
      </div>
      <div>
        <h1 className="text-[22px] font-extrabold text-charcoal sm:text-[26px]">
          الصفحة غير موجودة
        </h1>
        <p className="mt-2 max-w-md text-[15px] leading-8 text-muted">
          ربما حُذفت الصفحة أو تغيّر رابطها. تأكّد من الرابط أو عُد للصفحة الرئيسية.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button href="/" variant="primary">
          الصفحة الرئيسية
        </Button>
        <Button href="/browse" variant="ghost">
          تصفّح الأبطال
        </Button>
      </div>
    </main>
  );
}
