import { notFound } from "next/navigation";
import { getProducts } from "@/lib/data";
import { ProductClient } from "./ProductClient";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    handle: product.handle,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const products = await getProducts();
  const product = products.find((item) => item.handle === handle);

  if (!product) {
    notFound();
  }

  const relatedProducts = products.filter((item) => item.handle !== handle).slice(0, 3);

  return <ProductClient product={product} relatedProducts={relatedProducts} />;
}
