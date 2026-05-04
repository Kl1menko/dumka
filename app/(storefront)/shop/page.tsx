export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { CatalogClient } from "./CatalogClient";
import { getCatalogProductsResult } from "@/lib/data";
import {
  catalogCategories,
  getCategoryCounts,
  normalizeCategory,
  normalizeSort,
} from "@/lib/catalog";
import { Locale } from "@/lib/i18n";

type ShopPageProps = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Каталог | DUMKA by Nadiya Dumka",
  description: "Повний каталог DUMKA: сукні, костюми, вечірній одяг і подарунки з шоуруму у Львові.",
};

export default function ShopPage({ searchParams }: ShopPageProps) {
  return ShopPageContent({ searchParams, locale: "uk" });
}

export async function ShopPageContent({
  searchParams,
  locale = "uk",
}: ShopPageProps & { locale?: Locale }) {
  const [{ category, sort }, products] = await Promise.all([
    searchParams,
    getCatalogProductsResult(),
  ]);
  const initialCategory = normalizeCategory(category);
  const initialSort = normalizeSort(sort);
  const counts = getCategoryCounts(products.products);
  const categoryCounts = Object.fromEntries(
    catalogCategories.map((item) => [item.slug, counts.get(item.slug) || 0])
  );

  return (
    <CatalogClient
      locale={locale}
      products={products.products}
      productsError={products.error}
      initialCategory={initialCategory}
      initialSort={initialSort}
      categoryCounts={categoryCounts}
    />
  );
}
