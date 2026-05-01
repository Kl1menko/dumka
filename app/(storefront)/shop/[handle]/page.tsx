import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts, getProductsResult } from "@/lib/data";
import type { Product } from "@/lib/types";
import { ProductClient } from "./ProductClient";
import { Locale } from "@/lib/i18n";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    handle: product.handle,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const products = await getProducts();
  const product = findProductByHandle(products, handle);

  if (!product) {
    return {
      title: "Виріб не знайдено | DUMKA by Nadiya Dumka",
    };
  }

  const description = getProductDescription(product.bodyHtml);
  const image = product.images[0];

  return {
    title: `${product.title} | DUMKA by Nadiya Dumka`,
    description,
    openGraph: {
      title: `${product.title} | DUMKA by Nadiya Dumka`,
      description,
      images: image ? [{ url: image, alt: product.title }] : undefined,
      type: "website",
    },
  };
}

export default function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  return ProductPageContent({ params, locale: "uk" });
}

export async function ProductPageContent({
  params,
  locale = "uk",
}: {
  params: Promise<{ handle: string }>;
  locale?: Locale;
}) {
  const { handle } = await params;
  const { products, error } = await getProductsResult();

  if (error) {
    throw new Error(error);
  }

  const product = findProductByHandle(products, handle);

  if (!product) {
    notFound();
  }

  const normalizedType = product.productType.trim().toLowerCase();
  const relatedByType = normalizedType
    ? products.filter(
        (item) =>
          item.handle !== handle && item.productType.trim().toLowerCase() === normalizedType
      )
    : [];

  const fallbackProducts = products.filter(
    (item) =>
      item.handle !== handle && !relatedByType.some((related) => related.handle === item.handle)
  );

  const relatedProducts = [...relatedByType, ...fallbackProducts].slice(0, 3);

  return <ProductClient locale={locale} product={product} relatedProducts={relatedProducts} />;
}

function getProductDescription(bodyHtml: string) {
  const fallback =
    "DUMKA by Nadiya Dumka: преміальний жіночий одяг, шоурум у Львові та індивідуальна примірка.";
  const plainText = bodyHtml
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return plainText ? plainText.slice(0, 155) : fallback;
}

function normalizeHandle(value: string) {
  return value.trim().normalize("NFC").toLowerCase();
}

function findProductByHandle(products: Product[], rawHandle: string) {
  const candidates = [rawHandle];

  try {
    const decoded = decodeURIComponent(rawHandle);
    if (decoded !== rawHandle) candidates.push(decoded);
  } catch {
    // ignore malformed URI sequences, fallback to raw value
  }

  const normalizedCandidates = new Set(candidates.map(normalizeHandle));

  return products.find((item) =>
    normalizedCandidates.has(normalizeHandle(item.handle))
  );
}
