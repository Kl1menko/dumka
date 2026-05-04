"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import {
  catalogCategories,
  catalogSorts,
  CategorySlug,
  filterProductsByCategory,
  sortProducts,
  SortKey,
} from "@/lib/catalog";
import { Product } from "@/lib/types";
import { getSiteContent } from "@/content/site";
import { Locale } from "@/lib/i18n";

interface CatalogClientProps {
  locale: Locale;
  products: Product[];
  productsError: string;
  initialCategory: CategorySlug;
  initialSort: SortKey;
  categoryCounts: Record<string, number>;
}

export function CatalogClient({
  locale,
  products,
  productsError,
  initialCategory,
  initialSort,
  categoryCounts,
}: CatalogClientProps) {
  const content = getSiteContent(locale).catalog;
  const localePrefix = locale === "en" ? "/en" : "";
  const router = useRouter();
  const [category, setCategory] = useState<CategorySlug>(initialCategory);
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visibleProducts = useMemo(() => {
    return sortProducts(filterProductsByCategory(products, category), sort);
  }, [category, products, sort]);

  const currentCategoryLabel =
    content.categoryLabels[category] || content.categoryLabels.all;
  const currentSortLabel =
    content.sortLabels[sort] || content.sortLabels.featured;

  function syncUrl(nextCategory: CategorySlug, nextSort: SortKey) {
    const params = new URLSearchParams();

    if (nextCategory !== "all") {
      params.set("category", nextCategory);
    }

    if (nextSort !== "featured") {
      params.set("sort", nextSort);
    }

    const query = params.toString();
    router.replace(query ? `${localePrefix}/shop?${query}` : `${localePrefix}/shop`, { scroll: false });
  }

  function selectCategory(nextCategory: CategorySlug) {
    setCategory(nextCategory);
    syncUrl(nextCategory, sort);
  }

  function selectSort(nextSort: SortKey) {
    setSort(nextSort);
    syncUrl(category, nextSort);
  }

  function resetFilters() {
    setCategory("all");
    setSort("featured");
    syncUrl("all", "featured");
  }

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
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
          <aside className="hidden lg:block">
            <div className="sticky top-32 max-h-[calc(100dvh-8.5rem)] overflow-hidden">
              <div className="mb-10 flex items-center justify-between border-b border-[#111111]/10 pb-5">
                <p className="text-xs uppercase text-[#111111]/55">{content.categories}</p>
                {(category !== "all" || sort !== "featured") && (
                  <button className="luxury-link text-xs uppercase" onClick={resetFilters}>
                    {content.clear}
                  </button>
                )}
              </div>

              <div className="max-h-[calc(100dvh-14rem)] overflow-y-auto pr-1">
                <CategoryList
                  activeCategory={category}
                  categoryCounts={categoryCounts}
                  labels={content.categoryLabels}
                  onSelect={selectCategory}
                />
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-8 hidden items-end justify-between gap-8 border-b border-[#111111]/10 pb-5 lg:flex">
              <p className="text-xs uppercase text-[#111111]/55">
                {visibleProducts.length} / {products.length} {content.itemWord}
              </p>
              <label className="flex items-center gap-4 text-xs uppercase text-[#111111]/55">
                <span>{content.sorting}</span>
                <select
                  value={sort}
                  onChange={(event) => selectSort(event.target.value as SortKey)}
                  className="min-h-11 border border-[#111111]/15 bg-white px-4 text-xs uppercase text-[#111111] outline-none transition hover:border-[#111111]/40 focus:border-[#111111]"
                >
                  {catalogSorts.map((item) => (
                    <option key={item.key} value={item.key}>
                      {content.sortLabels[item.key]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mb-8 flex items-center justify-between gap-3 border-b border-[#111111]/10 pb-4 lg:hidden">
              <button
                className="ghost-button min-h-11 px-5"
                onClick={() => setFiltersOpen(true)}
              >
                {content.filters}
              </button>
              <div className="text-right text-[11px] uppercase leading-5 text-[#111111]/55">
                <p>{currentCategoryLabel}</p>
                <p>{currentSortLabel}</p>
              </div>
            </div>

            {productsError ? (
              <CatalogError message={productsError} title={content.errorTitle} cta={content.contactShowroom} />
            ) : visibleProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:gap-x-8 md:gap-y-16 xl:grid-cols-3">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.handle} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center border-y border-[#111111]/10 text-center">
                <p className="mb-4 font-serif text-3xl font-light uppercase">{content.emptyTitle}</p>
                <p className="max-w-md text-sm leading-7 text-[#111111]/60">
                  {content.emptyText}
                </p>
                <button className="primary-button mt-8" onClick={resetFilters}>
                  {content.showAll}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div
        className={`fixed inset-0 z-50 bg-[#111111]/35 transition duration-500 lg:hidden ${
          filtersOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setFiltersOpen(false)}
      />
      <aside
        className={`fixed bottom-0 left-0 right-0 z-50 max-h-[86dvh] overflow-y-auto bg-white px-4 py-6 text-[#111111] transition duration-500 lg:hidden ${
          filtersOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between text-xs uppercase">
          <span>{content.filtersTitle}</span>
          <button className="luxury-link" onClick={() => setFiltersOpen(false)}>
            {locale === "en" ? "Close" : "Закрити"}
          </button>
        </div>

        <div className="border-y border-[#111111]/10 py-6">
          <p className="mb-5 text-xs uppercase text-[#111111]/55">{content.categories}</p>
          <div className="max-h-[42dvh] overflow-y-auto pr-1">
            <CategoryList
              activeCategory={category}
              categoryCounts={categoryCounts}
              labels={content.categoryLabels}
              onSelect={selectCategory}
            />
          </div>
        </div>

        <div className="border-b border-[#111111]/10 py-6">
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
                onClick={() => selectSort(item.key)}
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
          <button className="primary-button w-full" onClick={() => setFiltersOpen(false)}>
            {content.show} {visibleProducts.length}
          </button>
        </div>
      </aside>
    </>
  );
}

function CatalogError({
  message,
  title,
  cta,
}: {
  message: string;
  title: string;
  cta: string;
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center border-y border-[#111111]/10 text-center">
      <p className="mb-4 font-serif text-3xl font-light uppercase">
        {title}
      </p>
      <p className="max-w-md text-sm leading-7 text-[#111111]/60">
        {message}
      </p>
      <a className="primary-button mt-8" href="tel:+380677570121">
        {cta}
      </a>
    </div>
  );
}

function CategoryList({
  activeCategory,
  categoryCounts,
  labels,
  onSelect,
}: {
  activeCategory: CategorySlug;
  categoryCounts: Record<string, number>;
  labels: Record<CategorySlug, string>;
  onSelect: (category: CategorySlug) => void;
}) {
  return (
    <div className="grid gap-2">
      {catalogCategories.map((item) => {
        const count = categoryCounts[item.slug] || 0;
        const isActive = activeCategory === item.slug;
        const disabled = item.slug !== "all" && count === 0;

        return (
          <button
            key={item.slug}
            disabled={disabled}
            className={`flex min-h-11 items-center justify-between border-b border-[#111111]/10 text-left text-xs uppercase transition ${
              isActive
                ? "text-[#111111]"
                : "text-[#111111]/55 hover:text-[#111111]"
            } ${disabled ? "cursor-not-allowed opacity-35" : ""}`}
            onClick={() => onSelect(item.slug)}
          >
            <span>{labels[item.slug]}</span>
            <span>{count}</span>
          </button>
        );
      })}
    </div>
  );
}
