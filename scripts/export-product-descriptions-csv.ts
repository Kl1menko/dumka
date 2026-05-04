/**
 * Export product descriptions to CSV for manual translation.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/export-product-descriptions-csv.ts
 *
 * Optional env:
 *   EXPORT_DESCRIPTIONS_CSV_PATH (default: ./exports/product-descriptions-en.csv)
 *
 * Required env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import fs from "node:fs/promises";
import path from "node:path";
import Papa from "papaparse";
import { createClient } from "@supabase/supabase-js";

type ProductRow = {
  id: string;
  handle: string;
  title: string;
  body_html: string;
  body_html_en: string | null;
  published: boolean;
  sort_order: number;
};

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const OUTPUT_PATH =
  process.env.EXPORT_DESCRIPTIONS_CSV_PATH ||
  path.resolve(process.cwd(), "exports/product-descriptions-en.csv");

const supabase = createClient(
  required("NEXT_PUBLIC_SUPABASE_URL"),
  required("SUPABASE_SERVICE_ROLE_KEY")
);

async function main() {
  const { data, error } = await supabase
    .from("products")
    .select("id,handle,title,body_html,body_html_en,published,sort_order")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  const rows = (data ?? []) as ProductRow[];

  const csvRows = rows.map((row) => ({
    id: row.id,
    handle: row.handle,
    title: row.title,
    published: row.published ? "true" : "false",
    body_html_uk: row.body_html || "",
    body_html_en: row.body_html_en || "",
  }));

  const csv = Papa.unparse(csvRows, {
    header: true,
    newline: "\n",
  });

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, csv, "utf8");

  console.log(`Exported ${csvRows.length} products to ${OUTPUT_PATH}`);
  console.log("Fill body_html_en column and run import script.");
}

main().catch((err) => {
  console.error("export-product-descriptions-csv failed:", err);
  process.exit(1);
});

