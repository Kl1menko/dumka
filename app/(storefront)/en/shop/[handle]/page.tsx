import {
  generateMetadata,
  generateStaticParams,
  ProductPageContent,
} from "../../../shop/[handle]/page";

type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

export { generateMetadata, generateStaticParams };

export default function EnglishProductPage({ params }: ProductPageProps) {
  return ProductPageContent({ params, locale: "en" });
}
