/**
 * Upload product images from Supabase (Shopify-origin URLs) to external CDN
 * and optionally replace product image URLs in Supabase.
 *
 * Usage:
 *   tsx --env-file=.env.local scripts/migrate-shopify-images-to-cdn.ts
 *   tsx --env-file=.env.local scripts/migrate-shopify-images-to-cdn.ts --apply
 *
 * Required env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   CDN_UPLOAD_URL              (e.g. https://cdn.kllo.com.ua/api/upload.php)
 *   CDN_API_KEY
 */
import { createClient } from "@supabase/supabase-js";

type ProductRow = {
  id: string;
  handle: string;
  images: string[] | null;
};

const APPLY = process.argv.includes("--apply");
const CONCURRENCY = Number(process.env.CDN_UPLOAD_CONCURRENCY || 4);
const MAX_RETRIES = Number(process.env.CDN_UPLOAD_RETRIES || 4);

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const SUPABASE_URL = required("NEXT_PUBLIC_SUPABASE_URL");
const SUPABASE_SERVICE_KEY = required("SUPABASE_SERVICE_ROLE_KEY");
const CDN_UPLOAD_URL = required("CDN_UPLOAD_URL");
const CDN_API_KEY = required("CDN_API_KEY");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function normalizeFilename(input: string): string {
  const sanitized = input.replace(/[^a-zA-Z0-9._-]+/g, "-");
  return sanitized.slice(0, 180) || `image-${Date.now()}.jpg`;
}

async function uploadToCdn(imageUrl: string, fallbackName: string): Promise<string> {
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error(`Image download failed (${imageResponse.status}) for ${imageUrl}`);
  }

  const contentType = imageResponse.headers.get("content-type") || "application/octet-stream";
  const bytes = await imageResponse.arrayBuffer();

  const srcName = (() => {
    try {
      const pathname = new URL(imageUrl).pathname;
      const tail = pathname.split("/").pop() || fallbackName;
      return normalizeFilename(tail);
    } catch {
      return normalizeFilename(fallbackName);
    }
  })();

  const file = new File([bytes], srcName, { type: contentType });
  const form = new FormData();
  form.append("image", file, srcName);

  const uploadResponse = await fetchWithRetry(
    () =>
      fetch(CDN_UPLOAD_URL, {
        method: "POST",
        headers: { "X-API-Key": CDN_API_KEY },
        body: form,
      }),
    MAX_RETRIES
  );

  const text = await uploadResponse.text();
  if (!uploadResponse.ok) {
    throw new Error(`CDN upload failed (${uploadResponse.status}): ${text}`);
  }

  let parsed: unknown = null;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = text;
  }

  if (typeof parsed === "string") {
    const raw = parsed.trim();
    if (/^https?:\/\//i.test(raw)) return raw;
  }

  if (parsed && typeof parsed === "object") {
    const data = parsed as Record<string, unknown>;
    const candidates = [data.url, data.file_url, data.path, data.location];
    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim().length > 0) {
        if (/^https?:\/\//i.test(candidate)) return candidate;
        try {
          return new URL(candidate, CDN_UPLOAD_URL).toString();
        } catch {
          return candidate;
        }
      }
    }

    const images = data.images;
    if (images && typeof images === "object") {
      const img = images as Record<string, unknown>;
      const original = img.original;
      if (original && typeof original === "object") {
        const originalUrl = (original as Record<string, unknown>).url;
        if (typeof originalUrl === "string" && originalUrl.trim().length > 0) {
          try {
            return new URL(originalUrl, CDN_UPLOAD_URL).toString();
          } catch {
            return originalUrl;
          }
        }
      }
    }
  }

  throw new Error(`Upload succeeded but CDN response URL not found: ${text}`);
}

async function fetchWithRetry(
  run: () => Promise<Response>,
  retries: number
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await run();
      if (response.ok) return response;

      if (!shouldRetryStatus(response.status) || attempt === retries) {
        return response;
      }
    } catch (error) {
      lastError = error;
      if (attempt === retries) throw error;
    }

    await sleep(getBackoffMs(attempt));
  }

  throw lastError instanceof Error ? lastError : new Error("Upload failed after retries");
}

function shouldRetryStatus(status: number): boolean {
  return status === 429 || (status >= 500 && status <= 599);
}

function getBackoffMs(attempt: number): number {
  const base = 600;
  const jitter = Math.floor(Math.random() * 250);
  return base * Math.pow(2, attempt) + jitter;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runPool<T, R>(
  items: T[],
  worker: (item: T, index: number) => Promise<R>,
  concurrency: number
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function next(): Promise<void> {
    const index = cursor++;
    if (index >= items.length) return;
    results[index] = await worker(items[index], index);
    await next();
  }

  const workers = Array.from({ length: Math.max(1, concurrency) }, () => next());
  await Promise.all(workers);
  return results;
}

async function main() {
  console.log(`Mode: ${APPLY ? "APPLY (writes to Supabase)" : "DRY RUN (no DB writes)"}`);

  const { data, error } = await supabase
    .from("products")
    .select("id,handle,images")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed loading products: ${error.message}`);

  const products = (data ?? []) as ProductRow[];
  console.log(`Products loaded: ${products.length}`);

  const jobs: Array<{ productId: string; handle: string; oldUrl: string; fallbackName: string }> = [];
  for (const product of products) {
    const images = product.images ?? [];
    for (let idx = 0; idx < images.length; idx++) {
      const oldUrl = images[idx];
      if (!oldUrl) continue;
      jobs.push({
        productId: product.id,
        handle: product.handle,
        oldUrl,
        fallbackName: `${product.handle}-${idx + 1}.jpg`,
      });
    }
  }

  console.log(`Images to upload: ${jobs.length}`);

  const mapped = new Map<string, string>();
  let ok = 0;
  let failed = 0;

  await runPool(
    jobs,
    async (job, index) => {
      try {
        if (mapped.has(job.oldUrl)) {
          ok++;
          return;
        }
        const newUrl = await uploadToCdn(job.oldUrl, job.fallbackName);
        mapped.set(job.oldUrl, newUrl);
        ok++;
        console.log(`[${index + 1}/${jobs.length}] ok ${job.handle}`);
      } catch (err) {
        failed++;
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[${index + 1}/${jobs.length}] fail ${job.handle}: ${message}`);
      }
    },
    CONCURRENCY
  );

  console.log(`Upload done. OK: ${ok}, Failed: ${failed}, Unique mapped: ${mapped.size}`);

  const updates: Array<{ id: string; handle: string; images: string[] }> = [];
  for (const product of products) {
    const original = product.images ?? [];
    const nextImages = original.map((url) => mapped.get(url) || url);
    updates.push({ id: product.id, handle: product.handle, images: nextImages });
  }

  if (APPLY) {
    for (const item of updates) {
      const { error: updateError } = await supabase
        .from("products")
        .update({ images: item.images })
        .eq("id", item.id);
      if (updateError) {
        console.error(`Update failed for ${item.handle}: ${updateError.message}`);
      }
    }
    console.log("Supabase image URLs updated.");
  } else {
    console.log("Dry run finished. Re-run with --apply to update Supabase.");
  }
}

main().catch((err) => {
  console.error("migrate-shopify-images-to-cdn failed:", err);
  process.exit(1);
});
