"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "dumka-wishlist-v1";

export interface WishlistItem {
  handle: string;
  title: string;
  image: string;
  price: string;
  priceNumber: number;
}

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  toggle: (item: WishlistItem) => void;
  isWishlisted: (handle: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

function readStorage(): WishlistItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => (typeof entry === "string" ? null : entry))
      .filter((entry): entry is WishlistItem => Boolean(entry?.handle));
  } catch {
    return [];
  }
}

function writeStorage(items: WishlistItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
  }, []);

  const toggle = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.handle === item.handle);
      const next = exists ? prev.filter((i) => i.handle !== item.handle) : [...prev, item];
      writeStorage(next);
      return next;
    });
  }, []);

  const isWishlisted = useCallback(
    (handle: string) => hydrated && items.some((i) => i.handle === handle),
    [items, hydrated]
  );

  return (
    <WishlistContext.Provider value={{ items, count: items.length, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
