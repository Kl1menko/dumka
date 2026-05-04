"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { WishlistButton } from "@/components/WishlistButton";
import { useCart } from "@/components/CartProvider";
import { useCurrency } from "@/components/CurrencyProvider";
import { useRecentlyViewed, type RecentProduct } from "@/lib/recently-viewed";
import { getSiteContent } from "@/content/site";
import { Locale } from "@/lib/i18n";

export function ProductClient({
  locale,
  product,
  relatedProducts,
}: {
  locale: Locale;
  product: Product;
  relatedProducts: Product[];
}) {
  const content = getSiteContent(locale).product;
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const { formatPrice } = useCurrency();
  const colorOptions = Array.from(
    new Set(
      product.variants
        .map((variant) => variant.color?.trim())
        .filter((color): color is string => Boolean(color))
    )
  );
  const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0] ?? "");

  const filteredVariants =
    selectedColor.length > 0
      ? product.variants.filter((variant) => variant.color === selectedColor)
      : product.variants;

  const sizeOptions = Array.from(
    filteredVariants
      .filter((variant) => variant.size)
      .reduce((options, variant) => {
        const current = options.get(variant.size);
        options.set(variant.size, {
          size: variant.size,
          available: Boolean(current?.available || variant.available),
        });
        return options;
      }, new Map<string, { size: string; available: boolean }>())
      .values()
  );
  const firstAvailableSize = sizeOptions.find((option) => option.available)?.size;
  const [selectedSize, setSelectedSize] = useState<string>(
    firstAvailableSize || sizeOptions[0]?.size || ""
  );
  const { addProduct } = useCart();
  const currentAsRecent: RecentProduct = {
    handle: product.handle,
    title: product.title,
    image: product.images[0] || "",
    price: product.price,
    priceNumber: product.priceNumber,
  };
  const { items: recentItems } = useRecentlyViewed(currentAsRecent);

  const fallbackImage =
    "https://cdn.shopify.com/s/files/1/0761/0128/8093/files/8D79654B-A80C-4BD0-903A-FD90FA063B2E.jpg?v=1776442243";
  const images = product.images.length > 0 ? product.images : [fallbackImage];
  const selectedVariant =
    filteredVariants.find((variant) => variant.size === selectedSize) ||
    filteredVariants[0] ||
    product.variants[0];
  const selectedSizeAvailable =
    sizeOptions.length > 0
      ? Boolean(sizeOptions.find((option) => option.size === selectedSize)?.available)
      : filteredVariants.some((variant) => variant.available) || filteredVariants.length === 0;
  const canAddToCart = selectedSizeAvailable;

  function handleAddToCart() {
    if (!canAddToCart) {
      return;
    }

    addProduct(product, selectedSize, selectedColor);
  }

  const hasHtmlDescription = /<[^>]+>/.test(product.bodyHtml);

  return (
    <div className="min-h-screen pb-28 pt-20 md:pb-16 md:pt-28">
      <div className="mx-auto max-w-[1500px] px-0 md:px-8">
        <div className="relative flex flex-col gap-10 lg:flex-row lg:gap-24">
          <div className="mobile-product-rail flex w-full snap-x snap-mandatory gap-2 overflow-x-auto px-0 md:block md:space-y-8 md:overflow-visible lg:w-3/5">
            {images.map((img, i) => (
              <div
                key={img}
                className="relative aspect-[4/5] w-[86vw] shrink-0 snap-center overflow-hidden bg-white first:ml-4 last:mr-4 md:ml-0 md:mr-0 md:w-full"
              >
                <Image
                  src={img}
                  alt={`${product.title} ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 86vw, 60vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                  unoptimized
                  priority={i === 0}
                />
                <span className="absolute bottom-4 right-4 bg-white/90 px-3 py-2 text-[11px] text-[#111111]/70 md:hidden">
                  {i + 1} / {images.length}
                </span>
              </div>
            ))}
          </div>

          <div className="relative w-full px-4 md:px-0 lg:w-2/5">
            <div className="sticky top-32">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs uppercase text-[#111111]/55">{content.kicker}</p>
                <WishlistButton
                  handle={product.handle}
                  title={product.title}
                  image={product.images[0] || ""}
                  price={product.price}
                  priceNumber={product.priceNumber}
                />
              </div>
              <h1 className="mb-4 font-serif text-4xl font-light uppercase leading-tight md:text-5xl">
                {product.title}
              </h1>
              <p className="mb-10 text-lg font-light text-[#111111]/70">
                {formatPrice(selectedVariant?.priceNumber ?? product.priceNumber)}
              </p>

              {colorOptions.length > 1 && (
                <div className="mb-8">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs uppercase text-[#111111]/80">
                      {locale === "uk" ? "Колір" : "Color"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        aria-pressed={selectedColor === color}
                        onClick={() => {
                          setSelectedColor(color);
                          const variantsInColor = product.variants.filter((v) => v.color === color);
                          const sizesInColor = Array.from(
                            variantsInColor
                              .filter((v) => v.size)
                              .reduce((options, variant) => {
                                const current = options.get(variant.size);
                                options.set(variant.size, {
                                  size: variant.size,
                                  available: Boolean(current?.available || variant.available),
                                });
                                return options;
                              }, new Map<string, { size: string; available: boolean }>())
                              .values()
                          );
                          const nextSize =
                            sizesInColor.find((option) => option.available)?.size ||
                            sizesInColor[0]?.size ||
                            "";
                          setSelectedSize(nextSize);
                        }}
                        className={`h-12 border px-4 text-xs uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] ${
                          selectedColor === color
                            ? "border-[#111111] bg-[#111111] text-white"
                            : "border-[#111111]/20 text-[#111111] hover:border-[#111111]"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sizeOptions.length > 0 && (
                <div className="mb-10">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs uppercase text-[#111111]/80">
                      {content.size}
                    </span>
                    <button
                      className="text-xs uppercase underline text-[#111111]/50"
                      onClick={() => setSizeGuideOpen(true)}
                    >
                      {content.sizeGuide}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map(({ size, available }) => (
                      <button
                        key={size}
                        disabled={!available}
                        aria-pressed={selectedSize === size}
                        onClick={() => setSelectedSize(size)}
                        className={`flex h-12 w-12 items-center justify-center border text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] ${
                          selectedSize === size
                            ? "border-[#111111] bg-[#111111] text-white"
                            : "border-[#111111]/20 text-[#111111] hover:border-[#111111]"
                        } ${!available ? "cursor-not-allowed text-[#111111]/25 line-through hover:border-[#111111]/20" : ""}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-xs uppercase text-[#111111]/50">
                    {selectedSizeAvailable
                      ? selectedVariant?.available === false
                        ? content.someUnavailable
                        : content.available
                      : content.unavailable}
                  </p>
                </div>
              )}

              <button
                className="primary-button mb-12 hidden w-full disabled:bg-[#111111]/25 md:inline-flex"
                disabled={!canAddToCart}
                onClick={handleAddToCart}
              >
                {canAddToCart ? content.addToCart : content.unavailable}
              </button>

              <div className="border-t border-[#111111]/10">
                <details className="group" open>
                  <summary className="flex cursor-pointer list-none items-center justify-between py-6 text-xs font-medium uppercase">
                    <span>{content.description}</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="pb-6 text-sm font-light leading-7 text-[#111111]/70">
                    {product.bodyHtml ? (
                      hasHtmlDescription ? (
                        <div dangerouslySetInnerHTML={{ __html: product.bodyHtml }} />
                      ) : (
                        <div className="whitespace-pre-line">{product.bodyHtml}</div>
                      )
                    ) : (
                      <p>{content.descriptionFallback}</p>
                    )}
                  </div>
                </details>

                <details className="group border-t border-[#111111]/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-6 text-xs font-medium uppercase">
                    <span>{content.care}</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="pb-6 text-sm font-light leading-7 text-[#111111]/70">
                    <p>{content.careText}</p>
                  </div>
                </details>
                
                <details className="group border-t border-[#111111]/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-6 text-xs font-medium uppercase">
                    <span>{content.delivery}</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="pb-6 text-sm font-light leading-7 text-[#111111]/70">
                    <p>{content.deliveryText}</p>
                  </div>
                </details>
              </div>

            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="px-4 pt-24 md:px-0 md:pt-28">
            <div className="mb-12 flex items-end justify-between gap-8">
              <div>
                <p className="mb-4 text-xs uppercase text-[#111111]/55">{content.styling}</p>
                <h2 className="font-serif text-4xl font-light uppercase">{content.related}</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:gap-8 lg:grid-cols-3">
              {relatedProducts.map((item) => (
                <ProductCard key={item.handle} product={item} />
              ))}
            </div>
          </section>
        )}

        {recentItems.length > 0 && (
          <section className="px-4 pt-20 md:px-0 md:pt-24">
            <div className="mb-10 border-t border-[#111111]/10 pt-10">
              <p className="mb-3 text-xs uppercase text-[#111111]/45">
                {locale === "en" ? "Recently viewed" : "Нещодавно переглянуті"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:gap-8 lg:grid-cols-4">
              {recentItems.slice(0, 4).map((item) => (
                <a key={item.handle} href={`/shop/${item.handle}`} className="group block">
                  <div className="product-tile-media">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="product-tile-image opacity-100"
                        unoptimized
                      />
                    )}
                  </div>
                  <p className="line-clamp-2 text-[13px] leading-5 text-[#111111]">{item.title}</p>
                  <p className="mt-1 text-[12px] text-[#111111]/62">{item.price}</p>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#111111]/10 bg-white px-4 py-3 md:hidden">
        <div className="mb-3 flex items-center justify-between gap-4 text-sm">
          <span className="line-clamp-1">{product.title}</span>
          <span className="shrink-0 text-[#111111]/65">
            {formatPrice(selectedVariant?.priceNumber ?? product.priceNumber)}
          </span>
        </div>
        <button
          className="primary-button w-full disabled:bg-[#111111]/25"
          disabled={!canAddToCart}
          onClick={handleAddToCart}
        >
          {canAddToCart ? content.addToCart : content.unavailable}
        </button>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-[#111111]/35 transition duration-500 ${
          sizeGuideOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setSizeGuideOpen(false)}
      />
      <aside
        className={`fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 bg-white px-5 py-6 text-[#111111] shadow-2xl transition duration-500 md:px-8 md:py-8 ${
          sizeGuideOpen
            ? "pointer-events-auto -translate-y-1/2 opacity-100"
            : "pointer-events-none -translate-y-[46%] opacity-0"
        }`}
        aria-hidden={!sizeGuideOpen}
        aria-modal="true"
        role="dialog"
      >
        <div className="mb-8 flex items-center justify-between gap-6 text-xs uppercase">
          <span>{content.sizeGuide}</span>
          <button className="luxury-link" onClick={() => setSizeGuideOpen(false)}>
            {content.close}
          </button>
        </div>

        <p className="mb-7 max-w-xl text-sm leading-7 text-[#111111]/65">
          {content.sizeGuideText}
        </p>

        <div className="overflow-x-auto border-y border-[#111111]/10">
          <table className="w-full min-w-[520px] text-left text-xs">
            <thead className="uppercase text-[#111111]/55">
              <tr className="border-b border-[#111111]/10">
                <th className="py-4 font-normal">{content.sizeTable.size}</th>
                <th className="py-4 font-normal">{content.sizeTable.bust}</th>
                <th className="py-4 font-normal">{content.sizeTable.waist}</th>
                <th className="py-4 font-normal">{content.sizeTable.hips}</th>
              </tr>
            </thead>
            <tbody className="text-[#111111]/75">
              {[
                ["XS", "82-86", "62-66", "88-92"],
                ["S", "86-90", "66-70", "92-96"],
                ["M", "90-94", "70-74", "96-100"],
                ["L", "94-100", "74-80", "100-106"],
                ["XL", "100-106", "80-86", "106-112"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-[#111111]/10 last:border-b-0">
                  {row.map((cell) => (
                    <td key={cell} className="py-4">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-7 grid gap-2 text-xs uppercase leading-5 text-[#111111]/50 sm:grid-cols-3">
          {content.sizeNotes.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </aside>
    </div>
  );
}
