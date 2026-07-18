"use client";

import { useRouter } from "next/navigation";
import { useVerifications } from "../../_components/useVerifications";

export function VerificationActions({ id }: { id: string }) {
  const router = useRouter();
  const { resolve } = useVerifications();

  function decide(accepted: boolean) {
    resolve(id, accepted);
    router.push("/admin/verifications");
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      <button
        onClick={() => decide(true)}
        className="cursor-pointer rounded-xl bg-jazan px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-jazan-dark"
      >
        قبول التوثيق
      </button>
      <button
        onClick={() => decide(false)}
        className="cursor-pointer rounded-xl border border-danger-line bg-surface px-6 py-2.5 text-[14px] font-semibold text-danger transition-colors hover:bg-danger-soft"
      >
        رفض الطلب
      </button>
    </div>
  );
}
