import type { Metadata } from "next";
import { StoriesPageContent } from "@/components/StoriesPageContent";

export const metadata: Metadata = {
  title: "Stories | DUMKA by Nadiya Dumka",
  description: "Editorial stories from DUMKA by Nadiya Dumka, including the Maky Spring-Summer 2026 collection.",
};

export default function StoriesPage() {
  return <StoriesPageContent locale="uk" />;
}
