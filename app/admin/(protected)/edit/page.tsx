import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProductForm } from "../_components/ProductForm";
import type { ProductInput } from "@/lib/actions/products";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ handle?: string }>;
}

export default async function EditProductByQueryPage({ searchParams }: Props) {
  const { handle = "" } = await searchParams;
  const normalizedHandle = handle.trim();

  if (!normalizedHandle) notFound();

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("handle", normalizedHandle)
    .single();

  if (error || !data) notFound();

  const variants = [...(data.product_variants ?? [])]
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((v: any) => ({
      id: v.id,
      title: v.title,
      price_uah: v.price_uah,
      size: v.size,
      color: v.color,
      available: v.available,
      sort_order: v.sort_order,
    }));

  const initialData: ProductInput & { originalHandle: string } = {
    originalHandle: data.handle,
    handle: data.handle,
    title: data.title,
    body_html: data.body_html,
    images: data.images ?? [],
    product_type: data.product_type,
    tags: data.tags ?? [],
    sort_order: data.sort_order,
    published: data.published,
    variants,
  };

  return (
    <div>
      <div className="mb-7 flex items-start justify-between">
        <div>
          <a href="/admin" className="text-xs text-[#111]/40 hover:text-[#111]">
            ← Товари
          </a>
          <h1 className="mt-3 font-serif text-2xl text-[#111]">{data.title}</h1>
          <p className="mt-1 text-xs text-[#111]/35">{data.handle}</p>
        </div>
        {data.published ? (
          <a
            href={`/shop/${encodeURIComponent(data.handle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-xs text-[#111]/40 underline-offset-2 hover:text-[#111] hover:underline"
          >
            Переглянути на сайті ↗
          </a>
        ) : (
          <span className="mt-1 text-xs text-[#111]/25">
            Товар приховано (опублікуйте, щоб переглянути)
          </span>
        )}
      </div>

      <ProductForm initialData={initialData} />
    </div>
  );
}
