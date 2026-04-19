import { Product } from "./types";

export type CategorySlug =
  | "all"
  | "dresses"
  | "suits"
  | "blouses"
  | "evening"
  | "vests"
  | "tops"
  | "shorts"
  | "jumpsuits"
  | "accessories"
  | "gifts"
  | "other";

export type SortKey = "featured" | "price-asc" | "price-desc" | "name-asc";

export interface CategoryOption {
  slug: CategorySlug;
  label: string;
}

export const catalogCategories: CategoryOption[] = [
  { slug: "all", label: "Усі" },
  { slug: "dresses", label: "Сукні" },
  { slug: "suits", label: "Костюми" },
  { slug: "blouses", label: "Блузи" },
  { slug: "evening", label: "Вечірній одяг" },
  { slug: "vests", label: "Жилети" },
  { slug: "tops", label: "Топи" },
  { slug: "shorts", label: "Шорти" },
  { slug: "jumpsuits", label: "Комбінезони" },
  { slug: "accessories", label: "Аксесуари" },
  { slug: "gifts", label: "Подарунки" },
  { slug: "other", label: "Інше" },
];

export const catalogSorts: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Рекомендоване" },
  { key: "price-asc", label: "Ціна: від нижчої" },
  { key: "price-desc", label: "Ціна: від вищої" },
  { key: "name-asc", label: "Назва: А-Я" },
];

const categoryMatchers: Record<Exclude<CategorySlug, "all" | "other">, string[]> = {
  dresses: ["dress", "dresses", "сукня", "сукні"],
  suits: ["suit", "suits", "костюм", "костюми"],
  blouses: ["blouse", "blouses", "блуза", "блузи"],
  evening: ["evening", "evening wear", "evening wears", "вечір"],
  vests: ["vest", "vests", "жилет", "жилети"],
  tops: ["top", "tops", "топ", "топи"],
  shorts: ["short", "shorts", "шорти"],
  jumpsuits: ["jumpsuit", "jumpsuits", "комбінезон", "комбінезони"],
  accessories: ["accessory", "accessories", "аксесуар", "аксесуари"],
  gifts: ["gift", "gifts", "подарунок", "подарунки"],
};

export function getProductCategory(product: Product): CategorySlug {
  const haystack = [
    product.productType,
    product.title,
    ...product.tags,
  ]
    .join(" ")
    .toLowerCase();

  for (const [slug, terms] of Object.entries(categoryMatchers)) {
    if (terms.some((term) => haystack.includes(term))) {
      return slug as CategorySlug;
    }
  }

  return "other";
}

export function getCategoryCounts(products: Product[]) {
  const counts = new Map<CategorySlug, number>();
  counts.set("all", products.length);

  for (const product of products) {
    const category = getProductCategory(product);
    counts.set(category, (counts.get(category) || 0) + 1);
  }

  return counts;
}

export function normalizeCategory(value?: string): CategorySlug {
  const match = catalogCategories.find((category) => category.slug === value);
  return match?.slug || "all";
}

export function normalizeSort(value?: string): SortKey {
  const match = catalogSorts.find((sort) => sort.key === value);
  return match?.key || "featured";
}

export function filterProductsByCategory(products: Product[], category: CategorySlug) {
  if (category === "all") {
    return products;
  }

  return products.filter((product) => getProductCategory(product) === category);
}

export function sortProducts(products: Product[], sort: SortKey) {
  const sorted = [...products];

  if (sort === "price-asc") {
    return sorted.sort((a, b) => a.priceNumber - b.priceNumber);
  }

  if (sort === "price-desc") {
    return sorted.sort((a, b) => b.priceNumber - a.priceNumber);
  }

  if (sort === "name-asc") {
    return sorted.sort((a, b) => a.title.localeCompare(b.title, "uk"));
  }

  return sorted;
}
