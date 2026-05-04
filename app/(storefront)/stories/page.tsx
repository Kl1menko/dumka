import type { Metadata } from "next";
import { StoriesPageContent } from "@/components/StoriesPageContent";

export const metadata: Metadata = {
  title: "Історії | DUMKA by Nadiya Dumka",
  description: "Редакційні історії DUMKA by Nadiya Dumka, зокрема колекція «Маки» весна-літо 2026.",
};

export default function StoriesPage() {
  return <StoriesPageContent locale="uk" />;
}
