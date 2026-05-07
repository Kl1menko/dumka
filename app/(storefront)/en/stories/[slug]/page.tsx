import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryDetailPageContent } from "@/components/StoryDetailPageContent";
import { getStoryBySlug, getStorySlugs } from "@/content/stories";
import { getProducts } from "@/lib/data";
import { Product } from "@/lib/types";

type StoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getStorySlugs("en").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug("en", slug);

  if (!story) {
    return {
      title: "Stories | DUMKA by Nadiya Dumka",
    };
  }

  return {
    title: `${story.title} | DUMKA by Nadiya Dumka`,
    description: story.excerpt,
    openGraph: {
      title: story.title,
      description: story.excerpt,
      images: [story.image],
    },
  };
}

function filterProductsByKeywords(products: Product[], keywords: readonly string[]): Product[] {
  const normalized = keywords.map((k) => k.toLowerCase());
  return products.filter((p) =>
    normalized.some((kw) => p.title.toLowerCase().includes(kw))
  );
}

export default async function EnglishStoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = getStoryBySlug("en", slug);

  if (!story) {
    notFound();
  }

  let collectionProducts: Product[] = [];
  if (story.productKeywords?.length) {
    const all = await getProducts();
    collectionProducts = filterProductsByKeywords(all, story.productKeywords);
  }

  return <StoryDetailPageContent locale="en" story={story} collectionProducts={collectionProducts} />;
}
