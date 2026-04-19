import { NextResponse } from "next/server";
import { getProductsResult } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = normalize(searchParams.get("q") || "");

  if (query.length < 2) {
    return NextResponse.json({ products: [] });
  }

  const { products, error } = await getProductsResult();

  if (error) {
    return NextResponse.json({ error }, { status: 503 });
  }

  const results = products
    .filter((product) => {
      const haystack = normalize(
        [
          product.title,
          product.productType,
          product.tags.join(" "),
          stripHtml(product.bodyHtml),
        ].join(" ")
      );

      return haystack.includes(query);
    })
    .slice(0, 8)
    .map((product) => ({
      handle: product.handle,
      title: product.title,
      price: product.price,
      priceNumber: product.priceNumber,
      image: product.images[0] || "",
    }));

  return NextResponse.json({ products: results });
}

function normalize(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ");
}
