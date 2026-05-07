import { Product } from "./types";
import { storiesContent } from "@/content/stories";

export type CollectionFilter = string; // collection handle slug, e.g. "maky-spring-summer-2026"

export interface CollectionOption {
  slug: string;
  labelUk: string;
  labelEn: string;
}

export function getCollectionOptions(): CollectionOption[] {
  const uk = storiesContent.uk.stories as readonly { slug?: string; title: string }[];
  const en = storiesContent.en.stories as readonly { slug?: string; title: string }[];
  return uk
    .filter((s): s is { slug: string; title: string } => typeof s.slug === "string")
    .map((s, i) => {
      const enStory = en.find((e) => e.slug === s.slug);
      return {
        slug: s.slug,
        labelUk: s.title,
        labelEn: enStory?.title || s.title,
      };
    });
}

function getProductCollectionSlugs(product: Product): string[] {
  const slugs: string[] = [];
  for (const tag of product.tags) {
    const normalized = (tag || "").trim().toLowerCase();
    if (!normalized.startsWith("collection:")) continue;
    slugs.push(normalized.slice("collection:".length).trim());
  }
  return slugs;
}

export function filterProductsByCollection(products: Product[], collection: string): Product[] {
  if (!collection) return products;
  return products.filter((p) => getProductCollectionSlugs(p).includes(collection));
}

export function filterProductsByPrice(
  products: Product[],
  min: number | null,
  max: number | null
): Product[] {
  if (min === null && max === null) return products;
  return products.filter((p) => {
    if (min !== null && p.priceNumber < min) return false;
    if (max !== null && p.priceNumber > max) return false;
    return true;
  });
}

export function getPriceRange(products: Product[]): { min: number; max: number } {
  if (!products.length) return { min: 0, max: 100000 };
  const prices = products.map((p) => p.priceNumber).filter((n) => n > 0);
  return {
    min: Math.floor(Math.min(...prices) / 1000) * 1000,
    max: Math.ceil(Math.max(...prices) / 1000) * 1000,
  };
}

export type CategorySlug =
  | "all"
  | "suits"
  | "dresses"
  | "evening"
  | "jackets"
  | "vests"
  | "blouses"
  | "skirts"
  | "trousers"
  | "tops"
  | "shorts"
  | "jumpsuits"
  | "leather"
  | "corsets"
  | "accessories"
  | "sets"
  | "gifts"
  | "other";

export type SortKey = "featured" | "price-asc" | "price-desc" | "name-asc";

export interface CategoryOption {
  slug: CategorySlug;
  labelUk: string;
  labelEn: string;
}

export const catalogCategories: CategoryOption[] = [
  { slug: "all",         labelUk: "Усі",              labelEn: "All" },
  { slug: "suits",       labelUk: "Костюми",           labelEn: "Suits" },
  { slug: "dresses",     labelUk: "Сукні",             labelEn: "Dresses" },
  { slug: "evening",     labelUk: "Вечірній одяг",     labelEn: "Evening wear" },
  { slug: "jackets",     labelUk: "Жакети",            labelEn: "Jackets" },
  { slug: "vests",       labelUk: "Жилети",            labelEn: "Vests" },
  { slug: "blouses",     labelUk: "Блузи",             labelEn: "Blouses" },
  { slug: "skirts",      labelUk: "Спідниці",          labelEn: "Skirts" },
  { slug: "trousers",    labelUk: "Штани",             labelEn: "Trousers" },
  { slug: "tops",        labelUk: "Топи",              labelEn: "Tops" },
  { slug: "shorts",      labelUk: "Шорти",             labelEn: "Shorts" },
  { slug: "jumpsuits",   labelUk: "Комбінезони",       labelEn: "Jumpsuits" },
  { slug: "leather",     labelUk: "Шкіряні вироби",   labelEn: "Leather outfits" },
  { slug: "corsets",     labelUk: "Корсети",           labelEn: "Corsets" },
  { slug: "accessories", labelUk: "Аксесуари",         labelEn: "Accessories" },
  { slug: "sets",        labelUk: "Комплекти",         labelEn: "Sets" },
  { slug: "gifts",       labelUk: "Подарунки",         labelEn: "Gifts" },
  { slug: "other",       labelUk: "Інше",              labelEn: "Other" },
];

export const catalogSorts: { key: SortKey; labelUk: string; labelEn: string }[] = [
  { key: "featured",   labelUk: "Рекомендоване",    labelEn: "Featured" },
  { key: "price-asc",  labelUk: "Ціна: від нижчої", labelEn: "Price: low to high" },
  { key: "price-desc", labelUk: "Ціна: від вищої",  labelEn: "Price: high to low" },
  { key: "name-asc",   labelUk: "Назва: А-Я",       labelEn: "Name: A–Z" },
];

const categoryMatchers: Record<Exclude<CategorySlug, "all" | "other">, string[]> = {
  suits:       ["suit", "suits", "костюм", "костюми"],
  dresses:     ["dress", "dresses", "сукня", "сукні"],
  evening:     ["evening", "evening wear", "evening wears", "вечір"],
  jackets:     ["jacket", "jackets", "жакет", "жакети", "піджак", "піджаки"],
  vests:       ["vest", "vests", "жилет", "жилети"],
  blouses:     ["blouse", "blouses", "блуза", "блузи"],
  skirts:      ["skirt", "skirts", "спідниця", "спідниці"],
  trousers:    ["trouser", "trousers", "pant", "pants", "штани", "брюки"],
  tops:        ["top", "tops", "топ", "топи"],
  shorts:      ["short", "shorts", "шорти"],
  jumpsuits:   ["jumpsuit", "jumpsuits", "комбінезон", "комбінезони"],
  leather:     ["leather", "leather outfit", "leather outfits", "шкіря", "шкіряний", "шкіряні", "шкіра", "екошкір"],
  corsets:     ["corset", "corsets", "корсет", "корсети"],
  accessories: ["accessory", "accessories", "аксесуар", "аксесуари"],
  sets:        ["set", "sets", "комплект", "комплекти", "набір", "набори"],
  gifts:       ["gift", "gifts", "подарунок", "подарунки"],
};

const categoryCollectionHandleMatchers: Record<
  Exclude<CategorySlug, "all" | "other">,
  string[]
> = {
  suits: ["suits"],
  dresses: ["dresses"],
  evening: ["evening-wears"],
  jackets: ["піджаки"],
  vests: ["жилеті", "жилети"],
  blouses: ["blouses"],
  skirts: ["спідниці"],
  trousers: ["штани"],
  tops: ["топи"],
  shorts: ["шорти"],
  jumpsuits: ["комбінезони"],
  leather: ["шкіра"],
  corsets: ["корсети"],
  accessories: ["accessories"],
  sets: ["sets", "комплекти"],
  gifts: ["gifts"],
};

const exactTypeToCategory: Record<string, Exclude<CategorySlug, "all" | "other">> = {
  suits: "suits",
  suit: "suits",
  dresses: "dresses",
  dress: "dresses",
  "evening wear": "evening",
  "evening wears": "evening",
  jackets: "jackets",
  jacket: "jackets",
  vests: "vests",
  vest: "vests",
  blouses: "blouses",
  blouse: "blouses",
  skirts: "skirts",
  skirt: "skirts",
  trousers: "trousers",
  trouser: "trousers",
  pants: "trousers",
  tops: "tops",
  top: "tops",
  shorts: "shorts",
  short: "shorts",
  jumpsuits: "jumpsuits",
  jumpsuit: "jumpsuits",
  "leather outfits": "leather",
  "leather outfit": "leather",
  leather: "leather",
  corsets: "corsets",
  corset: "corsets",
  accessories: "accessories",
  accessory: "accessories",
  sets: "sets",
  set: "sets",
  gifts: "gifts",
  gift: "gifts",
};

export function getProductCategory(product: Product): CategorySlug {
  const categories = getProductCategories(product);
  return categories[0] || "other";
}

function categoryMatchInHaystack(haystack: string, category: Exclude<CategorySlug, "all" | "other">) {
  const terms = categoryMatchers[category] || [];
  return terms.some((term) => haystack.includes(term));
}

function getCollectionHandlesFromTags(tags: string[]) {
  const handles = new Set<string>();
  for (const tag of tags) {
    const normalized = (tag || "").trim().toLowerCase();
    if (!normalized.startsWith("collection:")) continue;
    const handle = normalized.slice("collection:".length).trim();
    if (handle) handles.add(handle);
  }
  return handles;
}

export function getProductCategories(product: Product): CategorySlug[] {
  const productType = product.productType?.trim().toLowerCase() || "";
  const exactTypeCategory = exactTypeToCategory[productType];
  const matches = new Set<CategorySlug>();

  if (exactTypeCategory) {
    matches.add(exactTypeCategory);
  }

  const haystack = [product.productType, product.title, ...product.tags]
    .join(" ")
    .toLowerCase();
  const fullHaystack = [product.productType, product.title, ...product.tags, product.bodyHtml]
    .join(" ")
    .toLowerCase();
  const collectionHandles = getCollectionHandlesFromTags(product.tags);

  for (const [slug, terms] of Object.entries(categoryMatchers)) {
    const typedSlug = slug as Exclude<CategorySlug, "all" | "other">;
    if (terms.some((term) => haystack.includes(term))) {
      matches.add(typedSlug);
    }
  }

  for (const [slug, handles] of Object.entries(categoryCollectionHandleMatchers)) {
    const typedSlug = slug as Exclude<CategorySlug, "all" | "other">;
    if (handles.some((handle) => collectionHandles.has(handle))) {
      matches.add(typedSlug);
    }
  }

  if (categoryMatchInHaystack(fullHaystack, "leather")) {
    matches.add("leather");
  }

  if (matches.size === 0) {
    return ["other"];
  }

  return Array.from(matches);
}

export function getCategoryCounts(products: Product[]) {
  const counts = new Map<CategorySlug, number>();
  counts.set("all", products.length);

  for (const product of products) {
    for (const category of getProductCategories(product)) {
      counts.set(category, (counts.get(category) || 0) + 1);
    }
  }

  return counts;
}

export function normalizeCategory(value?: string): CategorySlug {
  const match = catalogCategories.find((c) => c.slug === value);
  return match?.slug || "all";
}

export function normalizeSort(value?: string): SortKey {
  const match = catalogSorts.find((s) => s.key === value);
  return match?.key || "featured";
}

export function filterProductsByCategory(products: Product[], category: CategorySlug) {
  if (category === "all") return products;
  return products.filter((p) => getProductCategories(p).includes(category));
}

export function sortProducts(products: Product[], sort: SortKey) {
  const sorted = [...products];
  if (sort === "price-asc") return sorted.sort((a, b) => a.priceNumber - b.priceNumber);
  if (sort === "price-desc") return sorted.sort((a, b) => b.priceNumber - a.priceNumber);
  if (sort === "name-asc") return sorted.sort((a, b) => a.title.localeCompare(b.title, "uk"));
  return sorted;
}
