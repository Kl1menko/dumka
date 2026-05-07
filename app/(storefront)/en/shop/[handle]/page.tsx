import {
  generateMetadataForLocale,
  ProductPageContent,
} from "../../../shop/[handle]/page";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  return generateMetadataForLocale(params, "en");
}

export default function EnglishProductPage({ params }: ProductPageProps) {
  return ProductPageContent({ params, locale: "en" });
}
