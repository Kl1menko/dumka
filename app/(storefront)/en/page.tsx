import type { Metadata } from "next";
import { HomePageContent } from "../page";

export const metadata: Metadata = {
  title: "DUMKA by Nadiya Dumka | Maky 2026",
  description: "Premium womenswear, Lviv showroom, and the Maky Spring-Summer 2026 collection.",
};

export default function EnglishHomePage() {
  return HomePageContent({ locale: "en" });
}
