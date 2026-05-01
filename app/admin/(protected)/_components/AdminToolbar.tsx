"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  allTypes: string[];
  currentSearch: string;
  currentType: string;
  currentStatus: string;
  matchCount: number;
  grandTotal: number;
}

export function AdminToolbar({ allTypes, currentSearch, currentType, currentStatus, matchCount, grandTotal }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch);
  const isFirstRender = useRef(true);

  const push = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v) params.set(k, v);
        else params.delete(k);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (search === currentSearch) return;

    const t = setTimeout(() => push({ q: search }), 350);
    return () => clearTimeout(t);
  }, [search, currentSearch, push]);

  const hasFilters = currentSearch || currentType || currentStatus;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="relative">
        <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#111]/30" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="search"
          placeholder="Пошук товарів…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-64 border border-[#111]/12 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#111]/35 placeholder:text-[#111]/30"
        />
      </div>

      <select
        value={currentType}
        onChange={(e) => push({ type: e.target.value })}
        className="h-9 border border-[#111]/12 bg-white px-3 text-sm outline-none focus:border-[#111]/35 text-[#111]/70"
      >
        <option value="">Усі типи</option>
        {allTypes.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select
        value={currentStatus}
        onChange={(e) => push({ status: e.target.value })}
        className="h-9 border border-[#111]/12 bg-white px-3 text-sm outline-none focus:border-[#111]/35 text-[#111]/70"
      >
        <option value="">Усі статуси</option>
        <option value="published">Опубліковано</option>
        <option value="hidden">Приховано</option>
      </select>

      {hasFilters && (
        <button
          onClick={() => { setSearch(""); push({ q: "", type: "", status: "" }); }}
          className="h-9 px-3 text-xs text-[#111]/40 hover:text-[#111] border border-[#111]/12 bg-white"
        >
          Очистити
        </button>
      )}

      <span className="ml-auto text-xs text-[#111]/35">
        {matchCount !== grandTotal ? `${matchCount} з ${grandTotal}` : `${grandTotal} товарів`}
      </span>
    </div>
  );
}
