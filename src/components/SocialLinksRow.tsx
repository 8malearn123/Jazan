"use client";

import { useEffect, useState } from "react";
import {
  WhatsappIcon,
  XSocialIcon,
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
  TiktokIcon,
  GithubIcon,
  GlobeIcon,
} from "@/components/icons";
import {
  socialPlatforms,
  loadSocialLinks,
  demoUserForPublicProfile,
  type SocialLinks,
} from "@/lib/social";
import { cn } from "@/lib/cn";

const platformIcons: Record<string, typeof GlobeIcon> = {
  whatsapp: WhatsappIcon,
  x: XSocialIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  linkedin: LinkedinIcon,
  tiktok: TiktokIcon,
  github: GithubIcon,
  website: GlobeIcon,
};

/**
 * صف أيقونات شبكات التواصل في الصفحة العامة.
 * يعرض روابط الملف الافتراضية (seed)، وإذا عدّل صاحب الحساب روابطه
 * من «شبكات التواصل» في لوحة التحكم فإنها تحل محلها.
 */
export function SocialLinksRow({
  profileId,
  seed,
  className,
}: {
  profileId: string;
  seed?: SocialLinks;
  className?: string;
}) {
  const [saved, setSaved] = useState<SocialLinks | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const demoUser = demoUserForPublicProfile(profileId);
    if (!demoUser) {
      setSaved(null);
      return;
    }
    const stored = loadSocialLinks(demoUser);
    setSaved(Object.keys(stored).length > 0 ? stored : null);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [profileId]);

  const links = saved ?? seed ?? {};
  const active = socialPlatforms.filter((p) => links[p.key]?.trim());
  if (active.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-2", className)}>
      {active.map((p) => {
        const Icon = platformIcons[p.key] ?? GlobeIcon;
        return (
          <a
            key={p.key}
            href={links[p.key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={p.label}
            title={p.label}
            className="flex h-9 w-9 items-center justify-center rounded-[11px] border border-line bg-surface text-muted transition-colors hover:border-jazan hover:text-jazan"
          >
            <Icon width={17} height={17} />
          </a>
        );
      })}
    </div>
  );
}
