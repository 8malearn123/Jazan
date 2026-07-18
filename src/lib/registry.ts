"use client";

import { useEffect, useState } from "react";
import { counts } from "./stats";
import type { UserRole } from "./types";

export type RegisteredMember = {
  id: string;
  name: string;
  role: UserRole;
  city?: string;
};

const REGISTRY_KEY = "jazanheroes.registry";
const REGISTRY_EVENT = "jazanheroes:registry";

export function loadRegistry(): RegisteredMember[] {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    return raw ? (JSON.parse(raw) as RegisteredMember[]) : [];
  } catch {
    return [];
  }
}

export function addToRegistry(member: RegisteredMember): void {
  if (member.role === "admin") return;
  try {
    const list = loadRegistry();
    if (list.some((m) => m.id === member.id)) return;
    localStorage.setItem(REGISTRY_KEY, JSON.stringify([...list, member]));
    window.dispatchEvent(new Event(REGISTRY_EVENT));
  } catch {
    // ignore
  }
}

export function onRegistryChange(listener: () => void): () => void {
  window.addEventListener(REGISTRY_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(REGISTRY_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}

function extraCounts() {
  const list = loadRegistry();
  return {
    heroes: list.filter((m) => m.role === "hero").length,
    producers: list.filter((m) => m.role === "producer").length,
    companies: list.filter((m) => m.role === "company").length,
  };
}

export function useLiveCounts() {
  const [extra, setExtra] = useState({ heroes: 0, producers: 0, companies: 0 });

  useEffect(() => {
    const update = () => setExtra(extraCounts());
    update();
    return onRegistryChange(update);
  }, []);

  return {
    heroes: counts.heroes + extra.heroes,
    producers: counts.producers + extra.producers,
    companies: counts.companies + extra.companies,
  };
}
