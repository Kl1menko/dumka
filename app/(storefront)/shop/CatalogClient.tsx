"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import {
  catalogCategories,
  catalogSorts,
  CategorySlug,
  CollectionOption,
  filterProductsByCategory,
  filterProductsByCollection,
  filterProductsByPrice,
  sortProducts,
  SortKey,
} from "@/lib/catalog";
import { Product } from "@/lib/types";
import { getSiteContent } from "@/content/site";
import { Locale } from "@/lib/i18n";
import { useRecentlyViewed } from "@/lib/recently-viewed";

interface Filters {
  category: CategorySlug;
  collection: string;
  priceMin: number | null;
  priceMax: number | null;
}

interface CatalogClientProps {
  locale: Locale;
  products: Product[];
  productsError: string;
  initialCategory: CategorySlug;
  initialSort: SortKey;
  categoryCounts: Record<string, number>;
  collectionOptions: CollectionOption[];
  priceRange: { min: number; max: number };
  initialCollection: string;
  initialPriceMin: number | null;
  initialPriceMax: number | null;
}

export function CatalogClient({
  locale,
  products,
  productsError,
  initialCategory,
  initialSort,
  categoryCounts,
  collectionOptions,
  priceRange,
  initialCollection,
  initialPriceMin,
  initialPriceMax,
}: CatalogClientProps) {
  const PRODUCTS_PER_PAGE = 24;
  const content = getSiteContent(locale).catalog;
  const localePrefix = locale === "en" ? "/en" : "";
  const router = useRouter();

  // Applied filters — what the catalog actually shows
  const [applied, setApplied] = useState<Filters>({
    category: initialCategory,
    collection: initialCollection,
    priceMin: initialPriceMin,
    priceMax: initialPriceMax,
  });

  // Draft filters — what the user is editing inside the drawer
  const [draft, setDraft] = useState<Filters>(applied);
  const [draftPriceMinInput, setDraftPriceMinInput] = useState(initialPriceMin?.toString() ?? "");
  const [draftPriceMaxInput, setDraftPriceMaxInput] = useState(initialPriceMax?.toString() ?? "");

  const [sort, setSort] = useState<SortKey>(initialSort);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const isMounted = useRef(false);
  const { items: recentItems } = useRecentlyViewed();

  // Open drawer — reset draft to current applied state
  function openFilters() {
    setDraft(applied);
    setDraftPriceMinInput(applied.priceMin?.toString() ?? "");
    setDraftPriceMaxInput(applied.priceMax?.toString() ?? "");
    setFiltersOpen(true);
  }

  function closeFilters() {
    setFiltersOpen(false);
  }

  // Apply draft → applied and close
  function applyFilters() {
    const priceMin = draftPriceMinInput !== "" ? Number(draftPriceMinInput) : null;
    const priceMax = draftPriceMaxInput !== "" ? Number(draftPriceMaxInput) : null;
    const next: Filters = { ...draft, priceMin, priceMax };
    setApplied(next);
    syncUrl(next, sort);
    closeFilters();
  }

  function resetFilters() {
    const empty: Filters = { category: "all", collection: "", priceMin: null, priceMax: null };
    setDraft(empty);
    setDraftPriceMinInput("");
    setDraftPriceMaxInput("");
    setApplied(empty);
    setSort("featured");
    syncUrl(empty, "featured");
  }

  function selectSort(next: SortKey) {
    setSort(next);
    syncUrl(applied, next);
  }

  function syncUrl(filters: Filters, nextSort: SortKey) {
    const params = new URLSearchParams();
    if (filters.category !== "all") params.set("category", filters.category);
    if (nextSort !== "featured") params.set("sort", nextSort);
    if (filters.collection) params.set("collection", filters.collection);
    if (filters.priceMin !== null) params.set("priceMin", String(filters.priceMin));
    if (filters.priceMax !== null) params.set("priceMax", String(filters.priceMax));
    const query = params.toString();
    router.replace(query ? `${localePrefix}/shop?${query}` : `${localePrefix}/shop`, { scroll: false });
  }

  const visibleProducts = useMemo(() => {
    let result = filterProductsByCategory(products, applied.category);
    result = filterProductsByCollection(result, applied.collection);
    result = filterProductsByPrice(result, applied.priceMin, applied.priceMax);
    return sortProducts(result, sort);
  }, [applied, products, sort]);

  // Preview count — how many products the draft would show
  const draftPriceMin = draftPriceMinInput !== "" ? Number(draftPriceMinInput) : null;
  const draftPriceMax = draftPriceMaxInput !== "" ? Number(draftPriceMaxInput) : null;
  const previewCount = useMemo(() => {
    let result = filterProductsByCategory(products, draft.category);
    result = filterProductsByCollection(result, draft.collection);
    result = filterProductsByPrice(result, draftPriceMin, draftPriceMax);
    return result.length;
  }, [draft, draftPriceMin, draftPriceMax, products]);

  const activeFilterCount = [
    applied.category !== "all",
    applied.collection !== "",
    applied.priceMin !== null || applied.priceMax !== null,
  ].filter(Boolean).length;

  const currentCategoryLabel = content.categoryLabels[applied.category] || content.categoryLabels.all;
  const currentSortLabel = content.sortLabels[sort] || content.sortLabels.featured;
  const displayedProducts = visibleProducts.slice(0, visibleCount);
  const canLoadMore = visibleCount < visibleProducts.length;

  const recentProducts = useMemo(() => {
    const byHandle = new Map(products.map((item) => [normalizeHandle(item.handle), item]));
    return recentItems
      .map((item) => byHandle.get(normalizeHandle(item.handle)))
      .filter((item): item is Product => Boolean(item))
      .slice(0, 4);
  }, [products, recentItems]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    setVisibleCount(PRODUCTS_PER_PAGE);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [applied, sort]);

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [filtersOpen]);

  return (
    <>
      <section className="border-b border-[#111111]/10 pt-24 md:pt-30">
        <div className="mx-auto max-w-[1600px] px-4 pb-6 md:px-8 md:pb-8">
          <h1 className="font-serif text-5xl font-light uppercase leading-[0.92] md:text-7xl">
            {content.title}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-6 md:px-8 md:py-8">
        <div className="mb-8 flex items-center justify-between gap-3 border-b border-[#111111]/10 pb-5">
          <button
            className="flex items-center gap-2.5 text-xs font-normal uppercase text-[#111111]/55 transition hover:text-[#111111]"
            onClick={openFilters}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25">
              <line x1="1" y1="4" x2="15" y2="4" />
              <line x1="1" y1="8" x2="15" y2="8" />
              <line x1="1" y1="12" x2="15" y2="12" />
              <circle cx="5" cy="4" r="1.5" fill="white" />
              <circle cx="10" cy="8" r="1.5" fill="white" />
              <circle cx="6" cy="12" r="1.5" fill="white" />
            </svg>
            <span>{locale === "en" ? "Filter" : "Фільтр"}</span>
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#111111] text-[9px] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-6">
            <label className="hidden items-center gap-4 text-xs uppercase text-[#111111]/55 lg:flex">
              <span>{content.sorting}</span>
              <select
                value={sort}
                onChange={(e) => selectSort(e.target.value as SortKey)}
                className="min-h-11 border border-[#111111]/15 bg-white px-4 text-xs uppercase text-[#111111] outline-none transition hover:border-[#111111]/40 focus:border-[#111111]"
              >
                {catalogSorts.map((item) => (
                  <option key={item.key} value={item.key}>
                    {content.sortLabels[item.key]}
                  </option>
                ))}
              </select>
            </label>
            <div className="text-right text-[11px] uppercase leading-5 text-[#111111]/55 lg:hidden">
              <p>{currentCategoryLabel}</p>
              <p>{currentSortLabel}</p>
            </div>
          </div>
        </div>

        {productsError ? (
          <CatalogError message={productsError} title={content.errorTitle} cta={content.contactShowroom} />
        ) : visibleProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:gap-x-8 md:gap-y-16 lg:grid-cols-3 xl:grid-cols-4">
              {displayedProducts.map((product) => (
                <ProductCard key={product.handle} product={product} locale={locale} />
              ))}
            </div>
            <p className="mt-10 text-center text-xs uppercase text-[#111111]/45">
              {displayedProducts.length} / {visibleProducts.length} {content.itemWord}
            </p>
            {canLoadMore && (
              <div className="mt-6 flex justify-center">
                <button
                  className="ghost-button min-w-44"
                  onClick={() => setVisibleCount((count) => count + PRODUCTS_PER_PAGE)}
                >
                  {locale === "en" ? "Show more" : "Показати ще"}
                </button>
              </div>
            )}
            {recentProducts.length > 0 && (
              <section className="mt-16 border-t border-[#111111]/10 pt-10 md:mt-20">
                <p className="mb-3 text-xs uppercase text-[#111111]/45">
                  {locale === "en" ? "Recently viewed" : "Нещодавно переглянуті"}
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:gap-x-8 md:gap-y-16 xl:grid-cols-4">
                  {recentProducts.map((product) => (
                    <ProductCard key={product.handle} product={product} locale={locale} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="flex min-h-[420px] flex-col items-center justify-center border-y border-[#111111]/10 text-center">
            <p className="mb-4 font-serif text-3xl font-light uppercase">{content.emptyTitle}</p>
            <p className="max-w-md text-sm leading-7 text-[#111111]/60">{content.emptyText}</p>
            <button className="primary-button mt-8" onClick={resetFilters}>
              {content.showAll}
            </button>
          </div>
        )}
      </section>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-[#111111]/35 transition duration-500 ${
          filtersOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeFilters}
      />

      {/* Filter drawer */}
      <aside
        className={`fixed bottom-0 left-0 right-0 z-50 max-h-[90dvh] overflow-y-auto bg-white px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 text-[#111111] transition duration-500 lg:bottom-auto lg:right-auto lg:top-0 lg:max-h-dvh lg:w-[480px] lg:px-10 lg:pb-10 lg:pt-28 ${
          filtersOpen ? "translate-y-0 lg:translate-x-0" : "translate-y-full lg:translate-y-0 lg:-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-end text-xs uppercase">
          <button className="luxury-link" onClick={closeFilters}>
            {locale === "en" ? "Close" : "Закрити"}
          </button>
        </div>

        {/* Categories */}
        <div className="border-t border-[#111111]/10 py-6">
          <p className="mb-5 text-xs uppercase text-[#111111]/55">{content.categories}</p>
          <div className="max-h-[30dvh] overflow-y-auto pr-1 lg:max-h-none">
            <div className="grid gap-0">
              {catalogCategories.map((item) => {
                const count = categoryCounts[item.slug] || 0;
                const isActive = draft.category === item.slug;
                const disabled = item.slug !== "all" && count === 0;
                return (
                  <button
                    key={item.slug}
                    disabled={disabled}
                    className={`flex min-h-10 items-center justify-between border-b border-[#111111]/10 text-left text-xs uppercase transition ${
                      isActive ? "text-[#111111]" : "text-[#111111]/55 hover:text-[#111111]"
                    } ${disabled ? "cursor-not-allowed opacity-35" : ""}`}
                    onClick={() => setDraft((d) => ({ ...d, category: item.slug }))}
                  >
                    <span>{content.categoryLabels[item.slug]}</span>
                    <span>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Collections */}
        {collectionOptions.length > 0 && (
          <div className="border-t border-[#111111]/10 py-6">
            <p className="mb-5 text-xs uppercase text-[#111111]/55">
              {locale === "en" ? "Collection" : "Колекція"}
            </p>
            <div className="grid gap-0">
              <button
                className={`flex min-h-10 items-center border-b border-[#111111]/10 text-left text-xs uppercase transition ${
                  draft.collection === "" ? "text-[#111111]" : "text-[#111111]/55 hover:text-[#111111]"
                }`}
                onClick={() => setDraft((d) => ({ ...d, collection: "" }))}
              >
                {locale === "en" ? "All" : "Усі"}
              </button>
              {collectionOptions.map((opt) => (
                <button
                  key={opt.slug}
                  className={`flex min-h-10 items-center border-b border-[#111111]/10 text-left text-xs uppercase transition ${
                    draft.collection === opt.slug ? "text-[#111111]" : "text-[#111111]/55 hover:text-[#111111]"
                  }`}
                  onClick={() => setDraft((d) => ({ ...d, collection: opt.slug }))}
                >
                  {locale === "en" ? opt.labelEn : opt.labelUk}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="border-t border-[#111111]/10 py-6">
          <p className="mb-5 text-xs uppercase text-[#111111]/55">
            {locale === "en" ? "Price, ₴" : "Ціна, ₴"}
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              inputMode="numeric"
              placeholder={String(priceRange.min)}
              value={draftPriceMinInput}
              onChange={(e) => setDraftPriceMinInput(e.target.value)}
              className="w-full border border-[#111111]/15 bg-white px-3 py-2.5 text-xs text-[#111111] outline-none transition placeholder:text-[#111111]/35 hover:border-[#111111]/40 focus:border-[#111111]"
            />
            <span className="shrink-0 text-xs text-[#111111]/35">—</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder={String(priceRange.max)}
              value={draftPriceMaxInput}
              onChange={(e) => setDraftPriceMaxInput(e.target.value)}
              className="w-full border border-[#111111]/15 bg-white px-3 py-2.5 text-xs text-[#111111] outline-none transition placeholder:text-[#111111]/35 hover:border-[#111111]/40 focus:border-[#111111]"
            />
          </div>
        </div>

        {/* Sorting — mobile only */}
        <div className="border-t border-[#111111]/10 py-6 lg:hidden">
          <p className="mb-5 text-xs uppercase text-[#111111]/55">{content.sorting}</p>
          <div className="grid gap-2">
            {catalogSorts.map((item) => (
              <button
                key={item.key}
                className={`flex min-h-12 items-center justify-between border px-4 text-left text-xs uppercase transition ${
                  sort === item.key
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-[#111111]/12 text-[#111111] hover:border-[#111111]/45"
                }`}
                onClick={() => setSort(item.key)}
              >
                <span>{content.sortLabels[item.key]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button className="ghost-button w-full" onClick={resetFilters}>
            {content.clear}
          </button>
          <button className="primary-button w-full" onClick={applyFilters}>
            {content.show} {previewCount}
          </button>
        </div>
      </aside>
    </>
  );
}

function normalizeHandle(value: string): string {
  return value.trim().normalize("NFC").toLowerCase();
}

function CatalogError({ message, title, cta }: { message: string; title: string; cta: string }) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center border-y border-[#111111]/10 text-center">
      <p className="mb-4 font-serif text-3xl font-light uppercase">{title}</p>
      <p className="max-w-md text-sm leading-7 text-[#111111]/60">{message}</p>
      <a className="primary-button mt-8" href="tel:+380677570121">{cta}</a>
    </div>
  );
}
