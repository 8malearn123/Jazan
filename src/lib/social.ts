
export type SocialLinks = Record<string, string>;

export const socialPlatforms = [
  { key: "whatsapp", label: "واتساب", placeholder: "https://wa.me/9665XXXXXXXX" },
  { key: "x", label: "X (تويتر)", placeholder: "https://x.com/username" },
  { key: "instagram", label: "انستقرام", placeholder: "https://instagram.com/username" },
  { key: "youtube", label: "يوتيوب", placeholder: "https://youtube.com/@channel" },
  { key: "linkedin", label: "لينكدإن", placeholder: "https://linkedin.com/in/username" },
  { key: "tiktok", label: "تيك توك", placeholder: "https://tiktok.com/@username" },
  { key: "github", label: "GitHub", placeholder: "https://github.com/username" },
  { key: "website", label: "موقع إلكتروني", placeholder: "https://example.com" },
] as const;

export type SocialPlatformKey = (typeof socialPlatforms)[number]["key"];

export function socialStorageKey(userId: string): string {
  return `jazanheroes.social.${userId}`;
}

export function loadSocialLinks(userId: string): SocialLinks {
  try {
    const raw = localStorage.getItem(socialStorageKey(userId));
    return raw ? (JSON.parse(raw) as SocialLinks) : {};
  } catch {
    return {};
  }
}

export function saveSocialLinks(userId: string, links: SocialLinks): void {
  try {
    localStorage.setItem(socialStorageKey(userId), JSON.stringify(links));
  } catch {
    // ignore
  }
}

const publicToDemoUser: Record<string, string> = {
  h1: "demo-hero",
  pr1: "demo-producer",
  c1: "demo-company",
};

export function demoUserForPublicProfile(profileId: string): string | null {
  return publicToDemoUser[profileId] ?? null;
}
