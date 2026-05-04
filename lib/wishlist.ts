"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dumka-wishlist-v1";

function readStorage(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((h) => typeof h === "string") : [];
  } catch {
    return [];
  }
}

function writeStorage(handles: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(handles));
  } catch {}
}

export function useWishlist() {
  const [handles, setHandles] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHandles(readStorage());
    setHydrated(true);
  }, []);

  const toggle = useCallback((handle: string) => {
    setHandles((prev) => {
      const next = prev.includes(handle) ? prev.filter((h) => h !== handle) : [...prev, handle];
      writeStorage(next);
      return next;
    });
  }, []);

  const isWishlisted = useCallback(
    (handle: string) => hydrated && handles.includes(handle),
    [handles, hydrated]
  );

  return { handles, toggle, isWishlisted, count: handles.length };
}
