
import type { Job } from "./types";

export type OfferStatus = "pending" | "approved" | "rejected";

export type CompanyOffer = Job & {
  seedStatus: OfferStatus;
  desc: string;
};

export const companyOffers: CompanyOffer[] = [];

export type OfferModeration = Record<string, OfferStatus>;

const MODERATION_KEY = "jazanheroes.offers.moderation";
const MODERATION_EVENT = "jazanheroes:offers";

export function loadOfferModeration(): OfferModeration {
  try {
    const raw = localStorage.getItem(MODERATION_KEY);
    return raw ? (JSON.parse(raw) as OfferModeration) : {};
  } catch {
    return {};
  }
}

export function saveOfferModeration(moderation: OfferModeration): void {
  try {
    localStorage.setItem(MODERATION_KEY, JSON.stringify(moderation));
    window.dispatchEvent(new Event(MODERATION_EVENT));
  } catch {
    // ignore
  }
}

export function onOfferModerationChange(listener: () => void): () => void {
  window.addEventListener(MODERATION_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(MODERATION_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

export function offerStatus(offer: CompanyOffer, moderation: OfferModeration): OfferStatus {
  return moderation[offer.id] ?? offer.seedStatus;
}

export function pendingOffers(moderation: OfferModeration): CompanyOffer[] {
  return companyOffers.filter((o) => offerStatus(o, moderation) === "pending");
}

export function approvedOffers(moderation: OfferModeration): Job[] {
  return companyOffers
    .filter((o) => offerStatus(o, moderation) === "approved")
    .map((o) => {
      const { seedStatus, ...job } = o;
      void seedStatus;
      return job;
    });
}
