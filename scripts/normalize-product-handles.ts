/**
 * Normalize product handles (slugs) to latin-only SEO-friendly values.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/normalize-product-handles.ts
 *   npx tsx --env-file=.env.local scripts/normalize-product-handles.ts --apply
 *
 * Required env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";

type ProductRow = {
  id: string;
  handle: string;
  title: string;
};

const APPLY = process.argv.includes("--apply");

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const supabase = createClient(
  required("NEXT_PUBLIC_SUPABASE_URL"),
  required("SUPABASE_SERVICE_ROLE_KEY")
);

const LETTER_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye", ж: "zh", з: "z", и: "y",
  і: "i", ї: "yi", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s",
  т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "yu",
  я: "ya", ъ: "", ы: "y", э: "e", ё: "yo",
};

function transliterate(input: string): string {
  let out = "";
  for (const ch of input.toLowerCase()) {
    if (LETTER_MAP[ch] !== undefined) {
      out += LETTER_MAP[ch];
      continue;
    }
    out += ch;
  }
  return out;
}

function slugify(input: string): string {
  const translit = transliterate(input);
  return translit
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function uniqueSlug(base: string, used: Set<string>): string {
  const cleanBase = base || "product";
  if (!used.has(cleanBase)) {
    used.add(cleanBase);
    return cleanBase;
  }

  let i = 2;
  while (used.has(`${cleanBase}-${i}`)) {
    i++;
  }
  const next = `${cleanBase}-${i}`;
  used.add(next);
  return next;
}

async function main() {
  const { data, error } = await supabase
    .from("products")
    .select("id,handle,title")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  const rows = (data ?? []) as ProductRow[];

  const used = new Set<string>();
  const updates: Array<{ id: string; oldHandle: string; newHandle: string; title: string }> = [];
  let unchanged = 0;

  for (const row of rows) {
    const base = slugify(row.handle || row.title || "");
    const next = uniqueSlug(base, used);
    if (next === row.handle) {
      unchanged++;
      continue;
    }
    updates.push({
      id: row.id,
      oldHandle: row.handle,
      newHandle: next,
      title: row.title,
    });
  }

  console.log(`Mode: ${APPLY ? "APPLY" : "DRY RUN"}`);
  console.log(`Products total: ${rows.length}`);
  console.log(`Unchanged: ${unchanged}`);
  console.log(`To update: ${updates.length}`);
  console.log("Sample updates:");
  for (const item of updates.slice(0, 30)) {
    console.log(`- ${item.oldHandle} -> ${item.newHandle}`);
  }

  if (!APPLY) {
    console.log("Dry run finished. Re-run with --apply to write changes.");
    return;
  }

  let ok = 0;
  let failed = 0;
  for (const item of updates) {
    const { error: updateError } = await supabase
      .from("products")
      .update({ handle: item.newHandle })
      .eq("id", item.id);

    if (updateError) {
      failed++;
      console.error(`Failed: ${item.oldHandle} -> ${item.newHandle} (${updateError.message})`);
      continue;
    }
    ok++;
  }

  console.log(`Apply done. Updated: ${ok}, Failed: ${failed}`);
}

main().catch((err) => {
  console.error("normalize-product-handles failed:", err);
  process.exit(1);
});

