import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts, getProductsResult } from "@/lib/data";
import type { Product } from "@/lib/types";
import { ProductClient } from "./ProductClient";
import { Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  return generateMetadataForLocale(params, "uk");
}

export async function generateMetadataForLocale(
  params: Promise<{ handle: string }>,
  locale: Locale
): Promise<Metadata> {
  const { handle } = await params;
  const products = await getProducts();
  const product = findProductByHandle(products, handle);

  if (!product) {
    return {
      title:
        locale === "en"
          ? "Product not found | DUMKA by Nadiya Dumka"
          : "Виріб не знайдено | DUMKA by Nadiya Dumka",
    };
  }

  const sourceDescription =
    locale === "en" && product.bodyHtmlEn?.trim().length
      ? product.bodyHtmlEn
      : product.bodyHtml;
  const description = getProductDescription(sourceDescription, locale);
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

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
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

  if (error || !products.length) {
    notFound();
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

function getProductDescription(bodyHtml: string, locale: Locale) {
  const fallback =
    locale === "en"
      ? "DUMKA by Nadiya Dumka: premium womenswear, Lviv showroom, and personalized fittings."
      : "DUMKA by Nadiya Dumka: преміальний жіночий одяг, шоурум у Львові та індивідуальна примірка.";
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
