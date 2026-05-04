/**
 * Translate product descriptions to English and save into products.body_html_en.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/translate-product-descriptions-en.ts
 *   npx tsx --env-file=.env.local scripts/translate-product-descriptions-en.ts --apply
 *
 * Required env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   OPENAI_API_KEY
 *
 * Optional env:
 *   OPENAI_MODEL (default: gpt-4.1-mini)
 *   TRANSLATE_CONCURRENCY (default: 2)
 */
import { createClient } from "@supabase/supabase-js";

type ProductRow = {
  id: string;
  handle: string;
  title: string;
  body_html: string;
  body_html_en: string | null;
};

const APPLY = process.argv.includes("--apply");
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const CONCURRENCY = Number(process.env.TRANSLATE_CONCURRENCY || 2);

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const supabase = createClient(
  required("NEXT_PUBLIC_SUPABASE_URL"),
  required("SUPABASE_SERVICE_ROLE_KEY")
);
const OPENAI_API_KEY = required("OPENAI_API_KEY");

async function translateToEnglish(text: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You translate ecommerce product descriptions to fluent premium English. Preserve HTML structure and tags exactly when present. Return only translated text.",
        },
        {
          role: "user",
          content: text,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI error (${response.status}): ${errorText}`);
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const translated = payload.choices?.[0]?.message?.content?.trim();
  if (!translated) throw new Error("OpenAI returned empty translation");
  return translated;
}

async function runPool<T>(
  items: T[],
  worker: (item: T, index: number) => Promise<void>,
  concurrency: number
) {
  let cursor = 0;

  async function next() {
    const index = cursor++;
    if (index >= items.length) return;
    await worker(items[index], index);
    await next();
  }

  const workers = Array.from({ length: Math.max(1, concurrency) }, () => next());
  await Promise.all(workers);
}

async function main() {
  console.log(`Mode: ${APPLY ? "APPLY" : "DRY RUN"}`);

  const { data, error } = await supabase
    .from("products")
    .select("id,handle,title,body_html,body_html_en")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed loading products: ${error.message}`);

  const rows = (data ?? []) as ProductRow[];
  const queue = rows.filter(
    (item) => item.body_html.trim().length > 0 && !(item.body_html_en || "").trim()
  );

  console.log(`Products loaded: ${rows.length}`);
  console.log(`Need translation: ${queue.length}`);

  let ok = 0;
  let failed = 0;

  await runPool(
    queue,
    async (item, index) => {
      try {
        const translated = await translateToEnglish(item.body_html);
        if (APPLY) {
          const { error: updateError } = await supabase
            .from("products")
            .update({ body_html_en: translated })
            .eq("id", item.id);
          if (updateError) throw new Error(updateError.message);
        }
        ok++;
        console.log(`[${index + 1}/${queue.length}] ok ${item.handle}`);
      } catch (err) {
        failed++;
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[${index + 1}/${queue.length}] fail ${item.handle}: ${message}`);
      }
    },
    CONCURRENCY
  );

  console.log(`Done. OK: ${ok}, Failed: ${failed}`);
  if (!APPLY) console.log("Dry run only. Re-run with --apply to save translations.");
}

main().catch((err) => {
  console.error("translate-product-descriptions-en failed:", err);
  process.exit(1);
});

