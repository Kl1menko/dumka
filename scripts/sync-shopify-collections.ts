import { createClient } from "@supabase/supabase-js";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "j06wf9-vp.myshopify.com";
const SHOPIFY_BASE_URL = `https://${SHOPIFY_STORE_DOMAIN}`;
const BATCH_SIZE = 100;
const APPLY = process.argv.includes("--apply");

type ShopifyProduct = {
  id: number;
  handle: string;
};

type ShopifyCollection = {
  id: number;
  handle: string;
  title: string;
};

type SupabaseProduct = {
  id: string;
  handle: string;
  tags: string[] | null;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return (await response.json()) as T;
}

async function fetchAllCollections(): Promise<ShopifyCollection[]> {
  const all: ShopifyCollection[] = [];
  let page = 1;

  while (true) {
    const data = await fetchJson<{ collections?: ShopifyCollection[] }>(
      `${SHOPIFY_BASE_URL}/collections.json?limit=250&page=${page}`
    );
    const items = data.collections ?? [];
    if (items.length === 0) break;
    all.push(...items);
    if (items.length < 250) break;
    page += 1;
  }

  return all;
}

async function fetchCollectionProducts(handle: string): Promise<ShopifyProduct[]> {
  const all: ShopifyProduct[] = [];
  let page = 1;
  const seen = new Set<string>();

  while (true) {
    const data = await fetchJson<{ products?: ShopifyProduct[] }>(
      `${SHOPIFY_BASE_URL}/collections/${encodeURIComponent(handle)}/products.json?limit=250&page=${page}`
    );
    const items = data.products ?? [];
    if (items.length === 0) break;

    const signature = items.map((item) => item.id).join(",");
    if (seen.has(signature)) break;
    seen.add(signature);

    all.push(...items);
    if (items.length < 250) break;
    page += 1;
    if (page > 20) break;
  }

  return all;
}

function sanitizeTagValue(value: string): string {
  return value.trim().toLowerCase();
}

async function main() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase env vars");
  }

  console.log(`Mode: ${APPLY ? "APPLY" : "DRY-RUN"}`);
  console.log("Loading Shopify collections...");
  const collections = await fetchAllCollections();
  console.log(`Collections loaded: ${collections.length}`);

  const productToCollections = new Map<string, Set<string>>();

  for (const collection of collections) {
    const products = await fetchCollectionProducts(collection.handle);
    const tag = `collection:${sanitizeTagValue(collection.handle)}`;
    console.log(`  ${collection.handle}: ${products.length} products`);

    for (const product of products) {
      const key = product.handle?.trim().toLowerCase();
      if (!key) continue;
      const set = productToCollections.get(key) ?? new Set<string>();
      set.add(tag);
      productToCollections.set(key, set);
    }
  }

  const { data: dbProducts, error } = await supabase
    .from("products")
    .select("id, handle, tags");

  if (error) throw error;

  const products = (dbProducts ?? []) as SupabaseProduct[];
  console.log(`Supabase products loaded: ${products.length}`);

  const updates: Array<{ id: string; tags: string[] }> = [];
  let unchanged = 0;
  let withCollections = 0;

  for (const row of products) {
    const existingTags = Array.isArray(row.tags) ? row.tags : [];
    const normalizedExisting = new Set(existingTags.map((t) => t.trim()).filter(Boolean));
    const collectionTags = productToCollections.get(row.handle.trim().toLowerCase()) ?? new Set<string>();

    if (collectionTags.size > 0) withCollections += 1;

    const next = new Set(normalizedExisting);
    for (const tag of collectionTags) next.add(tag);

    const nextTags = Array.from(next);
    const changed =
      nextTags.length !== existingTags.length ||
      nextTags.some((tag) => !existingTags.includes(tag));

    if (!changed) {
      unchanged += 1;
      continue;
    }

    updates.push({ id: row.id, tags: nextTags });
  }

  console.log(`Products matched to >=1 collection: ${withCollections}`);
  console.log(`Products to update: ${updates.length}`);
  console.log(`Products unchanged: ${unchanged}`);

  if (!APPLY) {
    console.log("Dry-run complete. Re-run with --apply to persist updates.");
    return;
  }

  for (let i = 0; i < updates.length; i += BATCH_SIZE) {
    const chunk = updates.slice(i, i + BATCH_SIZE);
    await Promise.all(
      chunk.map((item) =>
        supabase.from("products").update({ tags: item.tags }).eq("id", item.id)
      )
    );
    console.log(`Updated ${Math.min(i + BATCH_SIZE, updates.length)} / ${updates.length}`);
  }

  console.log("Sync complete.");
}

main().catch((err) => {
  console.error("sync-shopify-collections failed:", err);
  process.exit(1);
});
