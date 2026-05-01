import { Product, ProductVariant } from "./types";
import { createClient } from "./supabase/server";

export interface ProductsResult {
  products: Product[];
  error: string;
}

type VariantRow = {
  id: string;
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
  images: string[];
  product_type: string;
  tags: string[];
  sort_order: number;
  published: boolean;
  product_variants: VariantRow[];
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
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*, product_variants(*)")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return { products: (data as ProductRow[]).map(mapRow), error: "" };
  } catch (err) {
    console.error("Error reading products:", err);
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
    const supabase = await createClient();

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
