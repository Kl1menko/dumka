"use client";

import { memo, useCallback, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  deleteProduct,
  togglePublished,
  updateSortOrder,
  bulkSetPublished,
  bulkDelete,
} from "@/lib/actions/products";

export interface AdminProduct {
  handle: string;
  title: string;
  images: string[];
  product_type: string;
  published: boolean;
  sort_order: number;
  variant_count: number;
  min_price_uah: number;
}

const priceFormatter = new Intl.NumberFormat("uk-UA");

// ── Sortable row ─────────────────────────────────────────────────────────────

interface RowProps {
  product: AdminProduct;
  isDirty: boolean;
  selected: boolean;
  dndMode: boolean;
  onSelect: (handle: string, checked: boolean) => void;
  onOrderChange: (handle: string, value: string) => void;
  onToggle: (handle: string, published: boolean) => void;
  onDelete: (handle: string, title: string) => void;
}

const AdminProductRow = memo(function AdminProductRow({
  product,
  isDirty,
  selected,
  dndMode,
  onSelect,
  onOrderChange,
  onToggle,
  onDelete,
}: RowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: product.handle });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border-b border-[#111]/5 last:border-b-0"
    >
      <div
        className="grid items-center px-0 text-sm hover:bg-[#fafaf9]"
        style={{
          minHeight: "56px",
          gridTemplateColumns: "36px 48px minmax(0,1fr) 112px 112px 64px 72px 96px",
        }}
      >
        {/* Checkbox */}
        <div className="flex items-center justify-center px-2">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(product.handle, e.target.checked)}
            className="h-3.5 w-3.5 cursor-pointer accent-[#111]"
          />
        </div>

        {/* Drag handle / sort order */}
        <div className="px-2 py-2 text-center">
          {dndMode ? (
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab touch-none text-[#111]/30 hover:text-[#111]/60 active:cursor-grabbing"
              title="Перетягнути"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="9" cy="5" r="1.5" /><circle cx="15" cy="5" r="1.5" />
                <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                <circle cx="9" cy="19" r="1.5" /><circle cx="15" cy="19" r="1.5" />
              </svg>
            </button>
          ) : (
            <input
              type="number"
              value={product.sort_order === 0 ? "" : product.sort_order}
              onChange={(e) => onOrderChange(product.handle, e.target.value)}
              className={`w-10 border bg-transparent py-0.5 text-center text-xs focus:outline-none ${
                isDirty
                  ? "border-amber-400 text-amber-700"
                  : "border-[#111]/10 focus:border-[#111]/30"
              }`}
            />
          )}
        </div>

        {/* Title + image */}
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
                className="h-9 w-9 flex-shrink-0 bg-[#f0f0ee] object-cover"
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

        {/* Type */}
        <div className="px-3 py-2">
          {product.product_type ? (
            <span className="inline-block rounded bg-[#111]/5 px-2 py-0.5 text-[11px] text-[#111]/60">
              {product.product_type}
            </span>
          ) : (
            <span className="text-xs text-[#111]/20">—</span>
          )}
        </div>

        {/* Price */}
        <div className="px-3 py-2 text-right text-xs tabular-nums text-[#111]/55">
          {product.min_price_uah > 0 ? (
            priceFormatter.format(product.min_price_uah) + " ₴"
          ) : (
            <span className="text-[#111]/20">—</span>
          )}
        </div>

        {/* Variant count */}
        <div className="px-3 py-2 text-center text-xs text-[#111]/40">{product.variant_count}</div>

        {/* Published toggle */}
        <div className="px-3 py-2 text-center">
          <button
            onClick={() => onToggle(product.handle, !product.published)}
            title={product.published ? "Приховати" : "Опублікувати"}
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

        {/* Actions */}
        <div className="px-3 py-2 text-right">
          <div className="flex items-center justify-end gap-3">
            <Link
              href={`/admin/edit?handle=${encodeURIComponent(product.handle)}`}
              prefetch={false}
              className="text-xs text-[#111]/40 underline-offset-2 hover:text-[#111] hover:underline"
            >
              Редагувати
            </Link>
            <button
              onClick={() => onDelete(product.handle, product.title)}
              className="text-xs text-[#111]/25 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

// ── Main list ─────────────────────────────────────────────────────────────────

export function AdminProductList({ products }: { products: AdminProduct[] }) {
  const [localProducts, setLocalProducts] = useState(products);
  const [dirtyHandles, setDirtyHandles] = useState<Set<string>>(new Set());
  const [savingOrder, setSavingOrder] = useState(false);
  const [dndMode, setDndMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkWorking, setBulkWorking] = useState(false);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // ── Selection ────────────────────────────────────────────────────────────

  const allSelected =
    localProducts.length > 0 && localProducts.every((p) => selected.has(p.handle));
  const someSelected = selected.size > 0;

  function toggleSelectAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(localProducts.map((p) => p.handle)));
    }
  }

  function handleSelect(handle: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      checked ? next.add(handle) : next.delete(handle);
      return next;
    });
  }

  // ── Bulk actions ─────────────────────────────────────────────────────────

  async function handleBulkPublish(pub: boolean) {
    const handles = Array.from(selected);
    if (!handles.length) return;
    setBulkWorking(true);
    await bulkSetPublished(handles, pub);
    setLocalProducts((prev) =>
      prev.map((p) => (selected.has(p.handle) ? { ...p, published: pub } : p))
    );
    setSelected(new Set());
    setBulkWorking(false);
  }

  async function handleBulkDelete() {
    const handles = Array.from(selected);
    if (!handles.length) return;
    if (!confirm(`Видалити ${handles.length} товарів? Цю дію неможливо скасувати.`)) return;
    setBulkWorking(true);
    await bulkDelete(handles);
    setLocalProducts((prev) => prev.filter((p) => !selected.has(p.handle)));
    setSelected(new Set());
    setBulkWorking(false);
  }

  // ── Sort order (number inputs) ────────────────────────────────────────────

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

  // ── Drag-and-drop ─────────────────────────────────────────────────────────

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setLocalProducts((prev) => {
      const from = prev.findIndex((p) => p.handle === active.id);
      const to = prev.findIndex((p) => p.handle === over.id);
      const next = arrayMove(prev, from, to).map((p, i) => ({
        ...p,
        sort_order: i + 1,
      }));
      return next;
    });
    setDirtyHandles(new Set(localProducts.map((p) => p.handle)));
  }

  // ── Toggle published (single) ────────────────────────────────────────────

  const handleToggle = useCallback(
    (handle: string, published: boolean) => {
      startTransition(async () => {
        await togglePublished(handle, published);
        setLocalProducts((prev) =>
          prev.map((p) => (p.handle === handle ? { ...p, published } : p))
        );
      });
    },
    [startTransition]
  );

  const handleDelete = useCallback(
    (handle: string, title: string) => {
      if (!confirm(`Видалити "${title}"? Цю дію неможливо скасувати.`)) return;
      startTransition(async () => {
        await deleteProduct(handle);
        setLocalProducts((prev) => prev.filter((p) => p.handle !== handle));
      });
    },
    [startTransition]
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Save order banner */}
      {dirtyHandles.size > 0 && (
        <div className="mb-3 flex items-center justify-between rounded border border-amber-200 bg-amber-50 px-4 py-2.5">
          <span className="text-xs text-amber-700">
            Незбережений порядок: {dirtyHandles.size} змін
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

      {/* Bulk action bar */}
      {someSelected && (
        <div className="mb-3 flex items-center gap-3 rounded border border-[#111]/8 bg-[#fafaf9] px-4 py-2.5">
          <span className="text-xs text-[#111]/55">{selected.size} вибрано</span>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => handleBulkPublish(true)}
              disabled={bulkWorking}
              className="rounded border border-[#111]/15 px-3 py-1 text-xs text-[#111]/70 hover:border-[#111]/40 hover:text-[#111] disabled:opacity-40"
            >
              Опублікувати
            </button>
            <button
              onClick={() => handleBulkPublish(false)}
              disabled={bulkWorking}
              className="rounded border border-[#111]/15 px-3 py-1 text-xs text-[#111]/70 hover:border-[#111]/40 hover:text-[#111] disabled:opacity-40"
            >
              Приховати
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={bulkWorking}
              className="rounded border border-red-200 px-3 py-1 text-xs text-red-500 hover:bg-red-50 disabled:opacity-40"
            >
              Видалити
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="text-xs text-[#111]/35 hover:text-[#111]"
            >
              Скасувати
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded border border-[#111]/8 bg-white">
        {/* Header */}
        <div
          className="grid items-center border-b border-[#111]/8 text-[10px] uppercase tracking-widest text-[#111]/35"
          style={{
            gridTemplateColumns: "36px 48px minmax(0,1fr) 112px 112px 64px 72px 96px",
          }}
        >
          <div className="flex items-center justify-center px-2 py-2.5">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="h-3.5 w-3.5 cursor-pointer accent-[#111]"
            />
          </div>
          <div className="px-2 py-2.5">
            <button
              onClick={() => {
                setDndMode((v) => !v);
                if (!dndMode) setDirtyHandles(new Set());
              }}
              title={dndMode ? "Перемкнути на числа" : "Перемкнути на D&D"}
              className={`rounded px-1.5 py-0.5 text-[9px] uppercase tracking-widest transition ${
                dndMode
                  ? "bg-[#111] text-white"
                  : "border border-[#111]/15 text-[#111]/40 hover:border-[#111]/40"
              }`}
            >
              {dndMode ? "D&D" : "#"}
            </button>
          </div>
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
          <div className="max-h-[70vh] overflow-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localProducts.map((p) => p.handle)}
                strategy={verticalListSortingStrategy}
              >
                {localProducts.map((product) => (
                  <AdminProductRow
                    key={product.handle}
                    product={product}
                    isDirty={dirtyHandles.has(product.handle)}
                    selected={selected.has(product.handle)}
                    dndMode={dndMode}
                    onSelect={handleSelect}
                    onOrderChange={handleOrderChange}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    </div>
  );
}
