import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
  const { data, error } = await sb.from("products").select("handle, title, product_type").limit(500);
  if (error) { console.error(error); return; }
  const counts: Record<string, number> = {};
  for (const r of data) counts[r.product_type || "(empty)"] = (counts[r.product_type || "(empty)"] || 0) + 1;
  console.log("product_type distribution:", JSON.stringify(counts, null, 2));
  console.log("Total:", data.length);
  const empty = data.filter((r) => !r.product_type);
  if (empty.length) console.log("Empty samples:", empty.slice(0, 5).map((r) => `${r.handle}: ${r.title}`));
}
main();
