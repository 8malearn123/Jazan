import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Hero } from "@/lib/types";

export function HeroCard({ hero }: { hero: Hero }) {
  return (
    <Link
      href={`/heroes/${hero.id}`}
      className="jh-hero-card block overflow-hidden rounded-[18px] border border-line bg-surface no-underline shadow-[0_1px_2px_rgba(28,42,38,.04)] transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(28,42,38,.12)]"
    >
      <ImagePlaceholder shape="rect" className="h-[150px] w-full" />
      <div className="p-[18px]">
        <ImagePlaceholder
          shape="circle"
          className="-mt-11 h-[46px] w-[46px] border-[3px] border-surface"
        />
        <h3 className="mt-3 text-[17px] font-bold text-charcoal">{hero.name}</h3>
        <div className="mt-0.5 text-sm text-muted">
          {hero.title} · {hero.city}
        </div>
        <StatusBadge status={hero.status} size="sm" className="mt-3.5" />
      </div>
    </Link>
  );
}
