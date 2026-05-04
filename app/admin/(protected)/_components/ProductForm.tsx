"use client";

import { useState, useTransition } from "react";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  type ProductInput,
  type VariantInput,
} from "@/lib/actions/products";
import { catalogCategories } from "@/lib/catalog";

interface Props {
  initialData?: ProductInput & { originalHandle: string };
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const emptyVariant = (): VariantInput => ({
  title: "",
  price_uah: 0,
  size: "",
  color: "",
  available: true,
  sort_order: 0,
});

export function ProductForm({ initialData }: Props) {
  const isEdit = !!initialData;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [handle, setHandle] = useState(initialData?.handle ?? "");
  const [handleManual, setHandleManual] = useState(isEdit);
  const [bodyHtml, setBodyHtml] = useState(initialData?.body_html ?? "");
  const [bodyHtmlEn, setBodyHtmlEn] = useState(initialData?.body_html_en ?? "");
  const [productType, setProductType] = useState(initialData?.product_type ?? "");
  const [tagsRaw, setTagsRaw] = useState((initialData?.tags ?? []).join(", "));
  const [imagesRaw, setImagesRaw] = useState((initialData?.images ?? []).join("\n"));
  const [sortOrder, setSortOrder] = useState(initialData?.sort_order ?? 0);
  const [published, setPublished] = useState(initialData?.published ?? true);
  const [variants, setVariants] = useState<VariantInput[]>(
    initialData?.variants?.length ? initialData.variants : [emptyVariant()]
  );

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!handleManual) setHandle(slugify(val));
  }

  function addVariant() {
    setVariants((prev) => [...prev, { ...emptyVariant(), sort_order: prev.length }]);
  }

  function duplicateVariant(i: number) {
    setVariants((prev) => {
      const source = prev[i];
      if (!source) return prev;
      const copy = { ...source, id: undefined, sort_order: i + 1 };
      const next = [...prev];
      next.splice(i + 1, 0, copy);
      return next.map((item, idx) => ({ ...item, sort_order: idx }));
    });
  }

  function moveVariant(i: number, direction: -1 | 1) {
    setVariants((prev) => {
      const nextIndex = i + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(i, 1);
      next.splice(nextIndex, 0, item);
      return next.map((variant, idx) => ({ ...variant, sort_order: idx }));
    });
  }

  function removeVariant(i: number) {
    setVariants((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateVariant(i: number, field: keyof VariantInput, value: string | number | boolean) {
    setVariants((prev) =>
      prev.map((v, idx) => (idx === i ? { ...v, [field]: value } : v))
    );
  }

  function buildVariantTitle(v: VariantInput): string {
    const parts = [v.size, v.color].filter(Boolean);
    return parts.length ? parts.join(" / ") : "Default";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const images = imagesRaw
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    const normalizedHandle = handle.trim().toLowerCase();
    if (!title.trim()) {
      setError("Вкажіть назву товару.");
      return;
    }
    if (!normalizedHandle) {
      setError("Вкажіть handle товару.");
      return;
    }
    if (!/^[a-z0-9-]+$/.test(normalizedHandle)) {
      setError("Handle може містити лише малі латинські літери, цифри та дефіси.");
      return;
    }
    if (variants.length === 0) {
      setError("Додайте хоча б один варіант товару.");
      return;
    }

    const payload: ProductInput = {
      handle: normalizedHandle,
      title: title.trim(),
      body_html: bodyHtml,
      body_html_en: bodyHtmlEn,
      product_type: productType,
      tags,
      images,
      sort_order: sortOrder,
      published,
      variants: variants.map((v, i) => ({
        ...v,
        title: buildVariantTitle(v),
        sort_order: i,
      })),
    };

    startTransition(async () => {
      try {
        if (isEdit) {
          await updateProduct(initialData!.originalHandle, payload);
        } else {
          await createProduct(payload);
        }
        window.location.href = "/admin";
      } catch (err: any) {
        setError(err.message ?? "Сталася помилка");
      }
    });
  }

  function handleDeleteProduct() {
    if (!isEdit || !initialData) return;
    if (!confirm(`Видалити товар "${initialData.title}"? Цю дію неможливо скасувати.`)) {
      return;
    }

    setError("");
    startTransition(async () => {
      try {
        await deleteProduct(initialData.originalHandle);
        window.location.href = "/admin";
      } catch (err: any) {
        setError(err.message ?? "Не вдалося видалити товар");
      }
    });
  }

  async function handleUploadImages(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploadError("");
    setUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.urls || !Array.isArray(payload.urls)) {
        throw new Error(payload?.error || "Не вдалося завантажити зображення.");
      }

      const uploadedUrls = payload.urls.map((url: string) => url.trim()).filter(Boolean);
      if (uploadedUrls.length === 0) {
        throw new Error("Сервер не повернув URL зображень.");
      }

      setImagesRaw((prev) => {
        const existing = prev
          .split("\n")
          .map((u) => u.trim())
          .filter(Boolean);
        return [...existing, ...uploadedUrls].join("\n");
      });
    } catch (err: any) {
      setUploadError(err?.message || "Помилка завантаження зображень.");
    } finally {
      setUploading(false);
    }
  }

  const fieldCls =
    "w-full border border-[#111]/12 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#111]/35";
  const labelCls = "mb-1.5 block text-[10px] uppercase tracking-widest text-[#111]/45";

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl space-y-8">
      {/* Basic info */}
      <section className="rounded border border-[#111]/8 bg-white p-6">
        <h2 className="mb-5 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
          Основна інформація
        </h2>

        <div className="space-y-4">
          <div>
            <label className={labelCls}>Назва *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className={fieldCls}
            />
          </div>

          <div>
            <label className={labelCls}>Handle (URL slug) *</label>
            <input
              type="text"
              value={handle}
              onChange={(e) => {
                setHandle(e.target.value);
                setHandleManual(true);
              }}
              required
              pattern="[a-z0-9-]+"
              title="Лише малі латинські літери, цифри та дефіси"
              className={fieldCls}
            />
            <p className="mt-1 text-[10px] text-[#111]/30">
              /shop/{handle.trim().toLowerCase() || "…"} — лише малі літери та дефіси
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Категорія</label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className={fieldCls}
              >
                <option value="">— оберіть категорію —</option>
                {catalogCategories
                  .filter((c) => c.slug !== "all" && c.slug !== "other")
                  .map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.labelUk} / {c.labelEn}
                    </option>
                  ))}
                <option value="other">Інше / Other</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Порядок сортування</label>
              <input
                type="number"
                value={sortOrder === 0 ? "" : sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                className={fieldCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Теги</label>
            <input
              type="text"
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              placeholder="сукня, вечірня, новинка"
              className={fieldCls}
            />
            <p className="mt-1 text-[10px] text-[#111]/30">Через кому</p>
          </div>

          <div>
            <label className={labelCls}>Опис (HTML або звичайний текст)</label>
            <textarea
              value={bodyHtml}
              onChange={(e) => setBodyHtml(e.target.value)}
              rows={5}
              className={fieldCls + " resize-y font-mono text-xs"}
            />
          </div>

          <div>
            <label className={labelCls}>Опис EN (HTML або звичайний текст)</label>
            <textarea
              value={bodyHtmlEn}
              onChange={(e) => setBodyHtmlEn(e.target.value)}
              rows={5}
              className={fieldCls + " resize-y font-mono text-xs"}
            />
            <p className="mt-1 text-[10px] text-[#111]/30">
              Для англомовної версії. Якщо порожньо, використовується основний опис.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className={labelCls + " mb-0"}>Опубліковано</label>
            <button
              type="button"
              onClick={() => setPublished((p) => !p)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                published ? "bg-[#111]" : "bg-[#111]/20"
              }`}
            >
              <span
                className={`block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform mx-[3px] ${
                  published ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-xs text-[#111]/40">{published ? "Видно на сайті" : "Приховано"}</span>
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="rounded border border-[#111]/8 bg-white p-6">
        <h2 className="mb-5 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
          Зображення
        </h2>
        <div className="mb-4">
          <label className={labelCls}>Завантажити фото/відео</label>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center border border-[#111]/12 bg-white px-4 py-2 text-xs uppercase tracking-widest text-[#111]/70 transition hover:border-[#111]/35">
              {uploading ? "Завантаження…" : "Обрати файли"}
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                className="hidden"
                onChange={(e) => {
                  const selected = e.target.files;
                  void handleUploadImages(selected);
                  e.currentTarget.value = "";
                }}
              />
            </label>
            <span className="text-[10px] text-[#111]/35">
              Підтримуються зображення до 10MB кожне
            </span>
          </div>
          {uploadError && (
            <p className="mt-2 text-xs text-red-600">{uploadError}</p>
          )}
        </div>

        <label className={labelCls}>URL зображень (по одному на рядок)</label>
        <textarea
          value={imagesRaw}
          onChange={(e) => setImagesRaw(e.target.value)}
          rows={6}
          placeholder={"https://cdn.shopify.com/…\nhttps://cdn.shopify.com/…"}
          className={fieldCls + " resize-y font-mono text-xs"}
        />
        <p className="mt-2 text-[10px] text-[#111]/30">Перший URL — обкладинка товару</p>

        {/* Preview */}
        {imagesRaw.trim() && (
          <div className="mt-4 flex flex-wrap gap-2">
            {imagesRaw
              .split("\n")
              .map((u) => u.trim())
              .filter(Boolean)
              .slice(0, 6)
              .map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="h-16 w-16 object-cover bg-[#f0f0ee]"
                  onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                />
              ))}
          </div>
        )}
      </section>

      {/* Variants */}
      <section className="rounded border border-[#111]/8 bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
            Варіанти ({variants.length})
          </h2>
          <button
            type="button"
            onClick={addVariant}
            className="text-xs text-[#111]/50 underline-offset-2 hover:text-[#111] hover:underline"
          >
            + Додати варіант
          </button>
        </div>

        <div className="space-y-3">
          {variants.map((v, i) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-3 border-b border-[#111]/5 pb-3 md:grid-cols-[minmax(170px,1fr)_minmax(210px,1fr)_minmax(130px,160px)_minmax(120px,140px)_auto]"
            >
              <div>
                <label className={labelCls}>Розмір</label>
                <input
                  type="text"
                  value={v.size}
                  onChange={(e) => updateVariant(i, "size", e.target.value)}
                  placeholder="S, M, L, 36, …"
                  className={fieldCls}
                />
              </div>
              <div>
                <label className={labelCls}>Колір</label>
                <input
                  type="text"
                  value={v.color}
                  onChange={(e) => updateVariant(i, "color", e.target.value)}
                  placeholder="Чорний, Білий, …"
                  className={fieldCls}
                />
              </div>
              <div>
                <label className={labelCls}>Ціна (UAH)</label>
                <input
                  type="number"
                  value={v.price_uah === 0 ? "" : v.price_uah}
                  min={0}
                  step={1}
                  onChange={(e) => updateVariant(i, "price_uah", parseFloat(e.target.value) || 0)}
                  className={fieldCls}
                />
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <label className={labelCls}>В наявності</label>
                <button
                  type="button"
                  onClick={() => updateVariant(i, "available", !v.available)}
                  className={`h-5 w-9 rounded-full transition-colors ${
                    v.available ? "bg-[#111]" : "bg-[#111]/20"
                  }`}
                >
                  <span
                    className={`block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform mx-[3px] ${
                      v.available ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-end pb-0.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveVariant(i, -1)}
                    disabled={i === 0}
                    className="text-xs text-[#111]/35 disabled:opacity-25"
                    title="Перемістити вище"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveVariant(i, 1)}
                    disabled={i === variants.length - 1}
                    className="text-xs text-[#111]/35 disabled:opacity-25"
                    title="Перемістити нижче"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicateVariant(i)}
                    className="text-xs text-[#111]/45 hover:text-[#111]"
                    title="Дублювати варіант"
                  >
                    Дубл
                  </button>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(i)}
                      className="text-xs text-red-400 hover:text-red-600"
                      title="Видалити варіант"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#111] px-8 py-3 text-xs uppercase tracking-widest text-white transition hover:bg-[#333] disabled:opacity-50"
        >
          {isPending ? "Зберігаємо…" : isEdit ? "Зберегти зміни" : "Створити товар"}
        </button>
        <a
          href="/admin"
          className="text-sm text-[#111]/40 hover:text-[#111]"
        >
          Скасувати
        </a>
        {isEdit && (
          <button
            type="button"
            onClick={handleDeleteProduct}
            disabled={isPending}
            className="ml-auto text-sm text-red-500 hover:text-red-700 disabled:opacity-40"
          >
            Видалити товар
          </button>
        )}
      </div>
    </form>
  );
}
