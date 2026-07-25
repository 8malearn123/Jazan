import type {
  Hero,
  Company,
  Producer,
  Job,
  Sponsor,
  PendingVerification,
  AdminReport,
} from "./types";

export const sampleHeroes: Hero[] = [];

export const producers: Producer[] = [];

export const companies: Company[] = [];

export const jobs: Job[] = [];

export function getHero(id: string): Hero | undefined {
  return sampleHeroes.find((h) => h.id === id);
}

export function getProducer(id: string): Producer | undefined {
  return producers.find((p) => p.id === id);
}

export function getCompany(id: string): Company | undefined {
  return companies.find((c) => c.id === id);
}

export const sponsors: Sponsor[] = [];

export const pendingVerifications: PendingVerification[] = [];

export function getPendingVerification(id: string): PendingVerification | undefined {
  return pendingVerifications.find((p) => p.id === id);
}

export const reports: AdminReport[] = [];
