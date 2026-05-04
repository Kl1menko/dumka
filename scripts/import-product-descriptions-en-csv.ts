/**
 * Import translated English product descriptions from CSV into products.body_html_en.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/import-product-descriptions-en-csv.ts
 *
 * Optional env:
 *   IMPORT_DESCRIPTIONS_CSV_PATH (default: ./exports/product-descriptions-en.csv)
 *   IMPORT_DRY_RUN=true|false (default: false)
 *
 * Required env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import fs from "node:fs/promises";
import path from "node:path";
import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";

type CsvRow = {
  id?: string;
  handle?: string;
  body_html_en?: string;
};

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const INPUT_PATH =
  process.env.IMPORT_DESCRIPTIONS_CSV_PATH ||
  path.resolve(process.cwd(), "exports/product-descriptions-en.csv");
const DRY_RUN = (process.env.IMPORT_DRY_RUN || "false").toLowerCase() === "true";

const supabase = createClient(
  required("NEXT_PUBLIC_SUPABASE_URL"),
  required("SUPABASE_SERVICE_ROLE_KEY")
);

async function main() {
  const raw = await fs.readFile(INPUT_PATH, "utf8");
  const parsed = Papa.parse<CsvRow>(raw, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    throw new Error(`CSV parse error: ${parsed.errors[0].message}`);
  }

  const rows = parsed.data;
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of rows) {
    const id = (row.id || "").trim();
    const handle = (row.handle || "").trim();
    const bodyHtmlEn = (row.body_html_en || "").trim();

    if (!id || !handle) {
      skipped++;
      continue;
    }
    if (!bodyHtmlEn) {
      skipped++;
      continue;
    }

    if (DRY_RUN) {
      updated++;
      continue;
    }

    const { error } = await supabase
      .from("products")
      .update({ body_html_en: bodyHtmlEn })
      .eq("id", id)
      .eq("handle", handle);

    if (error) {
      failed++;
      console.error(`Failed for ${handle}: ${error.message}`);
    } else {
      updated++;
    }
  }

  console.log(`CSV rows: ${rows.length}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "APPLY"}`);
}

main().catch((err) => {
  console.error("import-product-descriptions-en-csv failed:", err);
  process.exit(1);
});

