import {
  generateStaticParams,
  generateMetadataForLocale,
  ProductPageContent,
} from "../../../shop/[handle]/page";
import type { Metadata } from "next";

type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

export { generateStaticParams };

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
