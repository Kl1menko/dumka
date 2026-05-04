export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { ShopPageContent } from "../../shop/page";

type ShopPageProps = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Catalog | DUMKA by Nadiya Dumka",
  description: "The DUMKA catalog: dresses, suits, eveningwear, and gifts from the Lviv showroom.",
};

export default function EnglishShopPage({ searchParams }: ShopPageProps) {
  return ShopPageContent({ searchParams, locale: "en" });
}
