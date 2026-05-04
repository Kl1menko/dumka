import { Product, ProductVariant } from "./types";
import { createPublicServerClient } from "./supabase/public-server";

export interface ProductsResult {
  products: Product[];
  error: string;
}

const CACHE_TTL_MS = 60_000;
let productsCache: { expiresAt: number; value: ProductsResult } | null = null;
let catalogCache: { expiresAt: number; value: ProductsResult } | null = null;

type VariantRow = {
  id: string;
  shopify_id: string | null;
  title: string;
  price_uah: number;
  size: string;
  color: string;
  available: boolean;
  sort_order: number;
};

type ProductRow = {
  handle: string;
  title: string;
  body_html: string;
  body_html_en: string;
  images: string[];
  product_type: string;
  tags: string[];
  sort_order: number;
  published: boolean;
  product_variants: VariantRow[];
};

type CatalogProductRow = {
  handle: string;
  title: string;
  images: string[];
  product_type: string;
  tags: string[];
  sort_order: number;
  published: boolean;
  product_variants: Array<{
    price_uah: number;
  }>;
};

function formatUah(value: number): string {
  return (
    new Intl.NumberFormat("uk-UA", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + " ₴"
  );
}

function mapRow(row: ProductRow): Product {
  const variants: ProductVariant[] = [...(row.product_variants ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((v) => ({
      id: v.id,
      shopifyId: v.shopify_id ?? undefined,
      title: v.title,
      price: formatUah(v.price_uah),
      priceNumber: v.price_uah,
      size: v.size,
      color: v.color,
      available: v.available,
    }));

  const minVariant =
    variants.length > 0
      ? variants.reduce((min, v) =>
          v.priceNumber < min.priceNumber ? v : min
        )
      : null;

  return {
    handle: row.handle,
    title: row.title,
    bodyHtml: row.body_html,
    bodyHtmlEn: row.body_html_en ?? "",
    images: row.images ?? [],
    variants,
    price: minVariant?.price ?? "0 ₴",
    priceNumber: minVariant?.priceNumber ?? 0,
    productType: row.product_type,
    tags: row.tags ?? [],
    sortOrder: row.sort_order,
    published: row.published,
  };
}

export async function getProductsResult(): Promise<ProductsResult> {
  if (productsCache && productsCache.expiresAt > Date.now()) {
    return productsCache.value;
  }

  try {
    const supabase = createPublicServerClient();

    const { data, error } = await supabase
      .from("products")
      .select("*, product_variants(*)")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    const result = { products: (data as ProductRow[]).map(mapRow), error: "" };
    productsCache = { value: result, expiresAt: Date.now() + CACHE_TTL_MS };
    return result;
  } catch (err) {
    console.error("Error reading products:", err);
    return {
      products: [],
      error:
        "Каталог тимчасово недоступний. Спробуйте оновити сторінку або зв'яжіться з шоурумом.",
    };
  }
}

function mapCatalogRow(row: CatalogProductRow): Product {
  const prices = (row.product_variants ?? [])
    .map((variant) => Number(variant.price_uah) || 0)
    .filter((price) => price > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

  return {
    handle: row.handle,
    title: row.title,
    bodyHtml: "",
    images: row.images ?? [],
    variants: [],
    price: formatUah(minPrice),
    priceNumber: minPrice,
    productType: row.product_type,
    tags: row.tags ?? [],
    sortOrder: row.sort_order,
    published: row.published,
  };
}

export async function getCatalogProductsResult(): Promise<ProductsResult> {
  if (catalogCache && catalogCache.expiresAt > Date.now()) {
    return catalogCache.value;
  }

  try {
    const supabase = createPublicServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("handle,title,images,product_type,tags,sort_order,published,product_variants(price_uah)")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    const result = { products: (data as CatalogProductRow[]).map(mapCatalogRow), error: "" };
    catalogCache = { value: result, expiresAt: Date.now() + CACHE_TTL_MS };
    return result;
  } catch (err) {
    console.error("Error reading catalog products:", err);
    return {
      products: [],
      error:
        "Каталог тимчасово недоступний. Спробуйте оновити сторінку або зв'яжіться з шоурумом.",
    };
  }
}

export async function getProducts(): Promise<Product[]> {
  const result = await getProductsResult();
  return result.products;
}

export async function getProductByHandle(
  handle: string
): Promise<Product | undefined> {
  try {
    const supabase = createPublicServerClient();

    const { data, error } = await supabase
      .from("products")
      .select("*, product_variants(*)")
      .eq("handle", handle)
      .eq("published", true)
      .single();

    if (error || !data) return undefined;

    return mapRow(data as ProductRow);
  } catch {
    return undefined;
  }
}
