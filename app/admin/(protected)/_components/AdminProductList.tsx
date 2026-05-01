"use client";

import { memo, useCallback, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useVirtualizer } from "@tanstack/react-virtual";
import { deleteProduct, togglePublished, updateSortOrder } from "@/lib/actions/products";

interface AdminProduct {
  handle: string;
  title: string;
  images: string[];
  product_type: string;
  published: boolean;
  sort_order: number;
  variant_count: number;
  min_price_uah: number;
}

interface AdminProductRowProps {
  product: AdminProduct;
  isDirty: boolean;
  top: number;
  onOrderChange: (handle: string, value: string) => void;
  onToggle: (handle: string, published: boolean) => void;
  onDelete: (handle: string, title: string) => void;
}

const ROW_HEIGHT = 56;
const priceFormatter = new Intl.NumberFormat("uk-UA");

const AdminProductRow = memo(function AdminProductRow({
  product,
  isDirty,
  top,
  onOrderChange,
  onToggle,
  onDelete,
}: AdminProductRowProps) {
  return (
    <div
      className="absolute left-0 right-0 border-b border-[#111]/5"
      style={{ transform: `translateY(${top}px)`, height: `${ROW_HEIGHT}px` }}
    >
      <div
        className="grid items-center px-0 text-sm hover:bg-[#fafaf9]"
        style={{
          minHeight: `${ROW_HEIGHT}px`,
          gridTemplateColumns: "56px minmax(0,1fr) 112px 112px 64px 72px 96px",
        }}
      >
        <div className="px-3 py-2 text-center">
          <input
            type="number"
            value={product.sort_order === 0 ? "" : product.sort_order}
            onChange={(e) => onOrderChange(product.handle, e.target.value)}
            className={`w-10 border bg-transparent py-0.5 text-center text-xs focus:outline-none ${
              isDirty ? "border-amber-400 text-amber-700" : "border-[#111]/10 focus:border-[#111]/30"
            }`}
          />
        </div>

        <div className="px-3 py-2">
          <div className="flex items-center gap-3">
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt=""
                width={36}
                height={36}
                loading="lazy"
                decoding="async"
                className="h-9 w-9 flex-shrink-0 object-cover bg-[#f0f0ee]"
              />
            ) : (
              <div className="h-9 w-9 flex-shrink-0 bg-[#f0f0ee]" />
            )}
            <div className="min-w-0">
              <p className="truncate font-medium leading-tight text-[#111]">{product.title}</p>
              <p className="mt-0.5 truncate text-[11px] text-[#111]/35">{product.handle}</p>
            </div>
          </div>
        </div>

        <div className="px-3 py-2">
          {product.product_type ? (
            <span className="inline-block rounded bg-[#111]/5 px-2 py-0.5 text-[11px] text-[#111]/60">
              {product.product_type}
            </span>
          ) : (
            <span className="text-xs text-[#111]/20">—</span>
          )}
        </div>

        <div className="px-3 py-2 text-right text-xs tabular-nums text-[#111]/55">
          {product.min_price_uah > 0 ? (
            priceFormatter.format(product.min_price_uah) + " ₴"
          ) : (
            <span className="text-[#111]/20">—</span>
          )}
        </div>

        <div className="px-3 py-2 text-center text-xs text-[#111]/40">{product.variant_count}</div>

        <div className="px-3 py-2 text-center">
          <button
            onClick={() => onToggle(product.handle, !product.published)}
            title={product.published ? "Опубліковано — натисніть, щоб приховати" : "Приховано — натисніть, щоб опублікувати"}
            className={`relative inline-flex h-5 w-9 items-center rounded-full ${
              product.published ? "bg-[#111]" : "bg-[#111]/15"
            }`}
          >
            <span
              className={`absolute left-[3px] h-3.5 w-3.5 rounded-full bg-white shadow ${
                product.published ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="px-3 py-2 text-right">
          <div className="flex items-center justify-end gap-3">
          <Link
            href={`/admin/edit?handle=${encodeURIComponent(product.handle)}`}
            prefetch={false}
            className="text-xs text-[#111]/40 hover:text-[#111] hover:underline underline-offset-2"
          >
            Редагувати
          </Link>
            <button
              onClick={() => onDelete(product.handle, product.title)}
              className="text-xs text-[#111]/25 hover:text-red-500 disabled:opacity-40"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export function AdminProductList({ products }: { products: AdminProduct[] }) {
  const [localProducts, setLocalProducts] = useState(products);
  const [dirtyHandles, setDirtyHandles] = useState<Set<string>>(new Set());
  const [savingOrder, setSavingOrder] = useState(false);
  const [, startTransition] = useTransition();

  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: localProducts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const handleOrderChange = useCallback((handle: string, value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return;
    setLocalProducts((prev) =>
      prev.map((p) => (p.handle === handle ? { ...p, sort_order: num } : p))
    );
    setDirtyHandles((prev) => new Set(prev).add(handle));
  }, []);

  async function saveOrder() {
    setSavingOrder(true);
    await updateSortOrder(
      localProducts.map((p) => ({ handle: p.handle, sort_order: p.sort_order }))
    );
    setDirtyHandles(new Set());
    setSavingOrder(false);
  }

  const handleToggle = useCallback((handle: string, published: boolean) => {
    startTransition(async () => {
      await togglePublished(handle, published);
      setLocalProducts((prev) =>
        prev.map((p) => (p.handle === handle ? { ...p, published } : p))
      );
    });
  }, [startTransition]);

  const handleDelete = useCallback((handle: string, title: string) => {
    if (!confirm(`Видалити "${title}"? Цю дію неможливо скасувати.`)) return;
    startTransition(async () => {
      await deleteProduct(handle);
      setLocalProducts((prev) => prev.filter((p) => p.handle !== handle));
    });
  }, [startTransition]);

  const hasDirty = dirtyHandles.size > 0;

  return (
    <div>
      {hasDirty && (
        <div className="mb-3 flex items-center justify-between rounded border border-amber-200 bg-amber-50 px-4 py-2.5">
          <span className="text-xs text-amber-700">
            Незбережені зміни порядку: {dirtyHandles.size}
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setLocalProducts(products);
                setDirtyHandles(new Set());
              }}
              className="text-xs text-amber-600 hover:text-amber-800"
            >
              Скасувати
            </button>
            <button
              onClick={saveOrder}
              disabled={savingOrder}
              className="bg-amber-600 px-3 py-1 text-xs text-white hover:bg-amber-700 disabled:opacity-50"
            >
              {savingOrder ? "Зберігаємо…" : "Зберегти порядок"}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded border border-[#111]/8 bg-white">
        <div
          className="grid border-b border-[#111]/8 text-[10px] uppercase tracking-widest text-[#111]/35"
          style={{ gridTemplateColumns: "56px minmax(0,1fr) 112px 112px 64px 72px 96px" }}
        >
          <div className="px-3 py-2.5 text-center">#</div>
          <div className="px-3 py-2.5">Товар</div>
          <div className="px-3 py-2.5">Тип</div>
          <div className="px-3 py-2.5 text-right">Ціна</div>
          <div className="px-3 py-2.5 text-center">Варіанти</div>
          <div className="px-3 py-2.5 text-center">Статус</div>
          <div className="px-3 py-2.5 text-right">Дії</div>
        </div>

        {localProducts.length === 0 ? (
          <div className="px-4 py-16 text-center text-sm text-[#111]/30">Товари не знайдено</div>
        ) : (
          <div ref={parentRef} className="max-h-[68vh] overflow-auto">
            <div
              className="relative w-full"
              style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const product = localProducts[virtualRow.index];
                return (
                  <AdminProductRow
                    key={product.handle}
                    product={product}
                    top={virtualRow.start}
                    isDirty={dirtyHandles.has(product.handle)}
                    onOrderChange={handleOrderChange}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
