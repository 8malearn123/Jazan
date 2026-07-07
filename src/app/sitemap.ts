import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { sampleHeroes, producers, companies } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/browse",
    "/producers",
    "/companies",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
    "/sponsor",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const heroRoutes = sampleHeroes.map((h) => ({
    url: `${site.url}/heroes/${h.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const producerRoutes = producers.map((p) => ({
    url: `${site.url}/producers/${p.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const companyRoutes = companies.map((c) => ({
    url: `${site.url}/companies/${c.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...heroRoutes, ...producerRoutes, ...companyRoutes];
}
