import { createAdminClient } from "@/lib/supabase/admin";
import { AdminProductList } from "./_components/AdminProductList";
import { AdminToolbar } from "./_components/AdminToolbar";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

interface SearchParams {
  q?: string;
  type?: string;
  status?: string;
  page?: string;
}

interface ProductRow {
  id: string;
  handle: string;
  title: string;
  images: string[] | null;
  product_type: string;
  published: boolean;
  sort_order: number;
}

function buildUrl(base: Record<string, string>) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(base)) {
    if (v) p.set(k, v);
  }
  const qs = p.toString();
  return `/admin${qs ? `?${qs}` : ""}`;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q = "", type = "", status = "", page = "1" } = await searchParams;
  const pageNum = Math.max(1, parseInt(page) || 1);
  const offset = (pageNum - 1) * PAGE_SIZE;

  const supabase = createAdminClient();

  let filteredQuery = supabase
    .from("products")
    .select(
      "id, handle, title, images, product_type, published, sort_order",
      { count: "exact" }
    )
    .order("sort_order", { ascending: true })
    .range(offset, offset + PAGE_SIZE - 1);

  if (q) filteredQuery = filteredQuery.ilike("title", `%${q}%`);
  if (type) filteredQuery = filteredQuery.eq("product_type", type);
  if (status === "published") filteredQuery = filteredQuery.eq("published", true);
  if (status === "hidden") filteredQuery = filteredQuery.eq("published", false);

  const [
    { data, error, count: filteredCount },
    { count: totalCount },
    { data: typesData },
  ] = await Promise.all([
    filteredQuery,
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("product_type").neq("product_type", ""),
  ]);

  if (error) {
    return (
      <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        Не вдалося завантажити товари: {error.message}
      </div>
    );
  }

  const allTypes = [
    ...new Set(
      (typesData ?? []).map((r: any) => r.product_type).filter(Boolean)
    ),
  ].sort() as string[];

  const matchCount = filteredCount ?? 0;
  const grandTotal = totalCount ?? 0;
  const totalPages = Math.ceil(matchCount / PAGE_SIZE);
  const hasFilters = !!(q || type || status);

  const productRows = (data ?? []) as ProductRow[];
  const productIds = productRows.map((row) => row.id);

  const { data: variantsData } =
    productIds.length > 0
      ? await supabase
          .from("product_variants")
          .select("product_id, price_uah")
          .in("product_id", productIds)
      : { data: [] as { product_id: string; price_uah: number }[] };

  const variantStats = new Map<string, { count: number; min: number }>();
  for (const variant of variantsData ?? []) {
    const current = variantStats.get(variant.product_id);
    if (!current) {
      variantStats.set(variant.product_id, { count: 1, min: Number(variant.price_uah) || 0 });
      continue;
    }

    current.count += 1;
    current.min = Math.min(current.min, Number(variant.price_uah) || 0);
    variantStats.set(variant.product_id, current);
  }

  const products = productRows.map((row) => {
    const stats = variantStats.get(row.id);
    return {
      handle: row.handle,
      title: row.title,
      images: row.images ?? [],
      product_type: row.product_type,
      published: row.published,
      sort_order: row.sort_order,
      variant_count: stats?.count ?? 0,
      min_price_uah: stats?.min ?? 0,
    };
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-[#111]">Товари</h1>
          <p className="mt-0.5 text-xs text-[#111]/40">
            {hasFilters ? `${matchCount} з ${grandTotal}` : `Усього: ${grandTotal}`}
          </p>
        </div>
        <a
          href="/admin/new"
          className="bg-[#111] px-5 py-2.5 text-xs uppercase tracking-widest text-white transition hover:bg-[#333]"
        >
          + Додати товар
        </a>
      </div>

      <AdminToolbar
        allTypes={allTypes}
        currentSearch={q}
        currentType={type}
        currentStatus={status}
        matchCount={matchCount}
        grandTotal={grandTotal}
      />

      <AdminProductList products={products} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between text-xs text-[#111]/45">
          <span>Сторінка {pageNum} з {totalPages}</span>
          <div className="flex gap-1">
            {pageNum > 1 && (
              <a
                href={buildUrl({ q, type, status, page: String(pageNum - 1) })}
                className="border border-[#111]/12 bg-white px-3 py-2 hover:bg-[#f5f5f3]"
              >
                ← Назад
              </a>
            )}
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = i + 1;
              return (
                <a
                  key={p}
                  href={buildUrl({ q, type, status, page: String(p) })}
                  className={`border px-3 py-2 ${
                    p === pageNum
                      ? "border-[#111] bg-[#111] text-white"
                      : "border-[#111]/12 bg-white hover:bg-[#f5f5f3]"
                  }`}
                >
                  {p}
                </a>
              );
            })}
            {totalPages > 7 && pageNum < totalPages && (
              <>
                {pageNum < totalPages - 3 && <span className="px-1 py-2">…</span>}
                <a
                  href={buildUrl({ q, type, status, page: String(totalPages) })}
                  className="border border-[#111]/12 bg-white px-3 py-2 hover:bg-[#f5f5f3]"
                >
                  {totalPages}
                </a>
              </>
            )}
            {pageNum < totalPages && (
              <a
                href={buildUrl({ q, type, status, page: String(pageNum + 1) })}
                className="border border-[#111]/12 bg-white px-3 py-2 hover:bg-[#f5f5f3]"
              >
                Далі →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
