/**
 * One-time migration: Shopify products.json → Supabase
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/migrate.ts
 *
 * Or set the vars in .env.local first, then:
 *   npx tsx --env-file=.env.local scripts/migrate.ts
 */
import { createClient } from "@supabase/supabase-js";

const SHOPIFY_URL = "https://j06wf9-vp.myshopify.com/products.json";
const BATCH_SIZE = 50;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ShopifyVariant {
  id: number;
  admin_graphql_api_id?: string;
  title: string;
  price: string;
  option1: string | null;
  option2: string | null;
  available?: boolean;
}

interface ShopifyImage {
  src: string;
}

interface ShopifyProduct {
  handle: string;
  title: string;
  body_html: string;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  product_type: string;
  tags: string | string[];
}

async function fetchPage(page: number): Promise<ShopifyProduct[]> {
  const url = `${SHOPIFY_URL}?limit=250&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Shopify returned ${res.status} for page ${page}`);
  const json = await res.json();
  return Array.isArray(json) ? json : json.products ?? [];
}

async function fetchAllProducts(): Promise<ShopifyProduct[]> {
  const all: ShopifyProduct[] = [];
  for (let page = 1; page <= 4; page++) {
    console.log(`Fetching Shopify page ${page}...`);
    const products = await fetchPage(page);
    if (products.length === 0) break;
    all.push(...products);
    console.log(`  Got ${products.length} products (total: ${all.length})`);
    if (products.length < 250) break;
  }
  return all;
}

async function migrate() {
  console.log("=== DUMKA migration: Shopify → Supabase ===\n");

  const shopifyProducts = await fetchAllProducts();
  console.log(`\nTotal products to migrate: ${shopifyProducts.length}\n`);

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < shopifyProducts.length; i += BATCH_SIZE) {
    const batch = shopifyProducts.slice(i, i + BATCH_SIZE);

    for (const sp of batch) {
      const tags = Array.isArray(sp.tags)
        ? sp.tags
        : sp.tags
        ? sp.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [];

      const productRow = {
        handle: sp.handle,
        title: sp.title,
        body_html: sp.body_html ?? "",
        images: sp.images.map((img) => img.src),
        product_type: sp.product_type ?? "",
        tags,
        sort_order: i + batch.indexOf(sp),
        published: true,
      };

      const { data: existingProduct } = await supabase
        .from("products")
        .select("id")
        .eq("handle", sp.handle)
        .single();

      if (existingProduct) {
        console.log(`  [skip] ${sp.handle} already exists`);
        skipped++;
        continue;
      }

      const { data: newProduct, error: productError } = await supabase
        .from("products")
        .insert(productRow)
        .select("id")
        .single();

      if (productError || !newProduct) {
        console.error(`  [error] ${sp.handle}:`, productError?.message);
        errors++;
        continue;
      }

      const variantRows = sp.variants.map((v, idx) => ({
        product_id: newProduct.id,
        shopify_id: v.admin_graphql_api_id ?? `gid://shopify/ProductVariant/${v.id}`,
        title: v.title ?? "",
        price_uah: parseFloat(v.price ?? "0"),
        size: v.option1 ?? "",
        color: v.option2 ?? "",
        available: v.available ?? true,
        sort_order: idx,
      }));

      if (variantRows.length > 0) {
        const { error: variantError } = await supabase
          .from("product_variants")
          .insert(variantRows);

        if (variantError) {
          console.error(`  [error] variants for ${sp.handle}:`, variantError.message);
        }
      }

      console.log(`  [ok] ${sp.handle} (${variantRows.length} variants)`);
      inserted++;
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`  Inserted: ${inserted}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Errors:   ${errors}`);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
