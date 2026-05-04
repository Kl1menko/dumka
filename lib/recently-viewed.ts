"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dumka-recently-viewed-v1";
const MAX_ITEMS = 6;

export interface RecentProduct {
  handle: string;
  title: string;
  image: string;
  price: string;
  priceNumber: number;
}

function readStorage(): RecentProduct[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((p) => p && typeof p.handle === "string")
      : [];
  } catch {
    return [];
  }
}

function writeStorage(items: RecentProduct[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function useRecentlyViewed(current?: RecentProduct) {
  const [items, setItems] = useState<RecentProduct[]>([]);

  useEffect(() => {
    const stored = readStorage();
    if (current) {
      const next = [current, ...stored.filter((p) => p.handle !== current.handle)].slice(
        0,
        MAX_ITEMS
      );
      writeStorage(next);
      // show without current product
      setItems(next.filter((p) => p.handle !== current.handle));
    } else {
      setItems(stored);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.handle]);

  const clear = useCallback(() => {
    writeStorage([]);
    setItems([]);
  }, []);

  return { items, clear };
}
