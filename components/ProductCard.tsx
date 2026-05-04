"use client";

import Link from "next/link";
import { Product } from "@/lib/types";
import { useCurrency } from "@/components/CurrencyProvider";
import { WishlistButton } from "@/components/WishlistButton";
import { Locale } from "@/lib/i18n";
import { localizeProductTitle } from "@/lib/product-title";

const FALLBACK =
  "https://cdn.shopify.com/s/files/1/0761/0128/8093/files/8D79654B-A80C-4BD0-903A-FD90FA063B2E.jpg?v=1776442243";

export function ProductCard({
  product,
  locale = "uk",
}: {
  product: Product;
  locale?: Locale;
}) {
  const { formatPrice } = useCurrency();
  const localePrefix = locale === "en" ? "/en" : "";
  const mainImage = product.images[0] || FALLBACK;
  const hoverImage = product.images[1] || mainImage;
  const displayTitle = localizeProductTitle(product.title, locale);

  return (
    <Link href={`${localePrefix}/shop/${product.handle}`} className="group block">
      <div className="product-tile-media">
        <img
          src={mainImage}
          alt={displayTitle}
          className="product-tile-image opacity-100 group-hover:opacity-0"
          referrerPolicy="no-referrer"
        />
        <img
          src={hoverImage}
          alt=""
          aria-hidden="true"
          loading="eager"
          className="product-tile-image opacity-0 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        <span className="product-tile-action" aria-hidden="true">+</span>
        <WishlistButton
          handle={product.handle}
          title={displayTitle}
          image={product.images[0] || ""}
          price={product.price}
          priceNumber={product.priceNumber}
          className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>

      <div className="px-1 pb-2 sm:px-0">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-[13px] leading-5 text-[#111111] sm:min-h-0 sm:text-sm">
          {displayTitle}
        </h3>
        <p className="mt-1 text-[12px] leading-5 text-[#111111]/62 sm:text-sm">
          {formatPrice(product.priceNumber)}
        </p>
      </div>
    </Link>
  );
}
