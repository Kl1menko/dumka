"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export interface VariantInput {
  id?: string; // existing variant UUID; undefined = new
  title: string;
  price_uah: number;
  size: string;
  color: string;
  available: boolean;
  sort_order: number;
}

export interface ProductInput {
  handle: string;
  title: string;
  body_html: string;
  images: string[];  // ordered list of image URLs
  product_type: string;
  tags: string[];
  sort_order: number;
  published: boolean;
  variants: VariantInput[];
}

function normalizeVariantTitle(v: VariantInput) {
  const parts = [v.size?.trim(), v.color?.trim()].filter(Boolean);
  return parts.length ? parts.join(" / ") : "Default";
}

function sanitizeInput(input: ProductInput): ProductInput {
  const handle = input.handle.trim().toLowerCase();
  const title = input.title.trim();

  const variants = input.variants
    .map((v, i) => ({
      ...v,
      size: v.size.trim(),
      color: v.color.trim(),
      title: (v.title || normalizeVariantTitle(v)).trim(),
      price_uah: Number(v.price_uah) || 0,
      sort_order: i,
    }))
    .filter((v) => v.size || v.color || v.price_uah > 0);

  return {
    ...input,
    handle,
    title,
    body_html: input.body_html.trim(),
    product_type: input.product_type.trim(),
    tags: input.tags.map((tag) => tag.trim()).filter(Boolean),
    images: input.images.map((image) => image.trim()).filter(Boolean),
    sort_order: Number(input.sort_order) || 0,
    variants,
  };
}

function validateInput(input: ProductInput) {
  if (!input.title) throw new Error("Вкажіть назву товару.");
  if (!input.handle) throw new Error("Вкажіть handle товару.");
  if (!/^[a-z0-9-]+$/.test(input.handle)) {
    throw new Error("Handle може містити лише малі латинські літери, цифри та дефіси.");
  }
  if (input.variants.some((variant) => variant.price_uah < 0)) {
    throw new Error("Ціна варіанту не може бути від'ємною.");
  }
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function createProduct(input: ProductInput) {
  const supabase = createAdminClient();
  const normalizedInput = sanitizeInput(input);
  validateInput(normalizedInput);

  const { data: existing } = await supabase
    .from("products")
    .select("id")
    .eq("handle", normalizedInput.handle)
    .maybeSingle();

  if (existing) {
    throw new Error("Товар з таким handle вже існує.");
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      handle: normalizedInput.handle,
      title: normalizedInput.title,
      body_html: normalizedInput.body_html,
      images: normalizedInput.images,
      product_type: normalizedInput.product_type,
      tags: normalizedInput.tags,
      sort_order: normalizedInput.sort_order,
      published: normalizedInput.published,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  if (normalizedInput.variants.length > 0) {
    const variantRows = normalizedInput.variants.map((v, i) => ({
      product_id: product.id,
      title: v.title,
      price_uah: v.price_uah,
      size: v.size,
      color: v.color,
      available: v.available,
      sort_order: i,
    }));

    const { error: varError } = await supabase
      .from("product_variants")
      .insert(variantRows);

    if (varError) throw new Error(varError.message);
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  return { ok: true as const };
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateProduct(
  originalHandle: string,
  input: ProductInput
) {
  const supabase = createAdminClient();
  const normalizedInput = sanitizeInput(input);
  validateInput(normalizedInput);

  if (originalHandle !== normalizedInput.handle) {
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("handle", normalizedInput.handle)
      .maybeSingle();

    if (existing) {
      throw new Error("Товар з таким handle вже існує.");
    }
  }

  const { data: product, error } = await supabase
    .from("products")
    .update({
      handle: normalizedInput.handle,
      title: normalizedInput.title,
      body_html: normalizedInput.body_html,
      images: normalizedInput.images,
      product_type: normalizedInput.product_type,
      tags: normalizedInput.tags,
      sort_order: normalizedInput.sort_order,
      published: normalizedInput.published,
    })
    .eq("handle", originalHandle)
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  // Replace all variants: delete existing, re-insert
  await supabase
    .from("product_variants")
    .delete()
    .eq("product_id", product.id);

  if (normalizedInput.variants.length > 0) {
    const variantRows = normalizedInput.variants.map((v, i) => ({
      product_id: product.id,
      title: v.title,
      price_uah: v.price_uah,
      size: v.size,
      color: v.color,
      available: v.available,
      sort_order: i,
    }));

    const { error: varError } = await supabase
      .from("product_variants")
      .insert(variantRows);

    if (varError) throw new Error(varError.message);
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${normalizedInput.handle}`);
  revalidatePath("/admin");
  return { ok: true as const };
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteProduct(handle: string) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("handle", handle);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
}

// ── Toggle published ──────────────────────────────────────────────────────────

export async function togglePublished(handle: string, published: boolean) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("products")
    .update({ published })
    .eq("handle", handle);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
}

// ── Update sort order ─────────────────────────────────────────────────────────

export async function updateSortOrder(
  updates: { handle: string; sort_order: number }[]
) {
  const supabase = createAdminClient();

  await Promise.all(
    updates.map(({ handle, sort_order }) =>
      supabase.from("products").update({ sort_order }).eq("handle", handle)
    )
  );

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
}

// ── Bulk actions ─────────────────────────────────────────────────────────────

export async function bulkSetPublished(handles: string[], published: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("products")
    .update({ published })
    .in("handle", handles);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
}

export async function bulkDelete(handles: string[]) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("products")
    .delete()
    .in("handle", handles);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
