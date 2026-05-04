/**
 * Updates product_type for all products that currently have an empty product_type.
 * Uses the same matching logic as lib/catalog.ts — checks title and tags.
 * Run: npx tsx scripts/update-product-types.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, serviceKey);

const categoryMatchers: Record<string, { terms: string[]; label: string }> = {
  dresses:     { terms: ["dress", "dresses", "сукня", "сукні", "сукн"],            label: "Сукні" },
  suits:       { terms: ["suit", "suits", "костюм", "костюми"],                    label: "Костюми" },
  blouses:     { terms: ["blouse", "blouses", "блуза", "блузи", "блуз"],           label: "Блузи" },
  evening:     { terms: ["evening", "вечірн"],                                     label: "Вечірній одяг" },
  vests:       { terms: ["vest", "vests", "жилет", "жилети"],                      label: "Жилети" },
  tops:        { terms: ["top", "tops", "топ", "топи"],                            label: "Топи" },
  shorts:      { terms: ["short", "shorts", "шорти"],                              label: "Шорти" },
  jumpsuits:   { terms: ["jumpsuit", "jumpsuits", "комбінезон", "комбінезони"],    label: "Комбінезони" },
  accessories: { terms: ["accessory", "accessories", "аксесуар", "аксесуари"],    label: "Аксесуари" },
  gifts:       { terms: ["gift", "gifts", "подарунок", "подарунки"],              label: "Подарунки" },
};

function detectType(title: string, tags: string[]): string {
  const haystack = [title, ...tags].join(" ").toLowerCase();
  for (const { terms, label } of Object.values(categoryMatchers)) {
    if (terms.some((t) => haystack.includes(t))) return label;
  }
  return "";
}

async function main() {
  const { data, error } = await supabase
    .from("products")
    .select("handle, title, tags, product_type")
    .eq("product_type", "");

  if (error) { console.error("Fetch error:", error.message); process.exit(1); }

  console.log(`Found ${data.length} products with empty product_type`);

  let updated = 0;
  let skipped = 0;

  for (const row of data) {
    const label = detectType(row.title, row.tags ?? []);
    if (!label) { skipped++; continue; }

    const { error: upErr } = await supabase
      .from("products")
      .update({ product_type: label })
      .eq("handle", row.handle);

    if (upErr) {
      console.error(`  ✗ ${row.handle}: ${upErr.message}`);
    } else {
      console.log(`  ✓ ${row.handle} → ${label}`);
      updated++;
    }
  }

  console.log(`\nDone. Updated: ${updated}, no match: ${skipped}`);
}

main();
