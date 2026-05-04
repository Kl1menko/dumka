import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoryDetailPageContent } from "@/components/StoryDetailPageContent";
import { getStoryBySlug, getStorySlugs } from "@/content/stories";

type StoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getStorySlugs("uk").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug("uk", slug);

  if (!story) {
    return {
      title: "Історії | DUMKA by Nadiya Dumka",
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

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = getStoryBySlug("uk", slug);

  if (!story) {
    notFound();
  }

  return <StoryDetailPageContent locale="uk" story={story} />;
}
