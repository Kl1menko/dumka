"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

export function ProductClient({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const sizes = Array.from(new Set(product.variants.map((v) => v.size).filter(Boolean)));
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || "");
  const [cartOpen, setCartOpen] = useState(false);
  const fallbackImage =
    "https://cdn.shopify.com/s/files/1/0761/0128/8093/files/8D79654B-A80C-4BD0-903A-FD90FA063B2E.jpg?v=1776442243";
  const images = product.images.length > 0 ? product.images : [fallbackImage];

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
                <img
                  src={img}
                  alt={`${product.title} ${i + 1}`}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-4 right-4 bg-white/90 px-3 py-2 text-[11px] text-[#111111]/70 md:hidden">
                  {i + 1} / {images.length}
                </span>
              </div>
            ))}
          </div>

          <div className="relative w-full px-4 md:px-0 lg:w-2/5">
            <div className="sticky top-32">
              <p className="mb-5 text-xs uppercase text-[#111111]/55">DUMKA made-to-occasion</p>
              <h1 className="mb-4 font-serif text-4xl font-light uppercase leading-tight md:text-5xl">
                {product.title}
              </h1>
              <p className="mb-10 text-lg font-light text-[#111111]/70">{product.price}</p>

              {sizes.length > 0 && (
                <div className="mb-10">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs uppercase text-[#111111]/80">
                      Розмір
                    </span>
                    <button className="text-xs uppercase underline text-[#111111]/50">
                      Розмірна сітка
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`flex h-12 w-12 items-center justify-center border text-sm transition-colors ${
                          selectedSize === size
                            ? "border-[#111111] bg-[#111111] text-white"
                            : "border-[#111111]/20 text-[#111111] hover:border-[#111111]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button className="primary-button mb-12 hidden w-full md:inline-flex" onClick={() => setCartOpen(true)}>
                Додати до кошика
              </button>

              <div className="border-t border-[#111111]/10">
                <details className="group" open>
                  <summary className="flex cursor-pointer list-none items-center justify-between py-6 text-xs font-medium uppercase">
                    <span>Опис</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="pb-6 text-sm font-light leading-7 text-[#111111]/70">
                    {product.bodyHtml ? (
                      <div dangerouslySetInnerHTML={{ __html: product.bodyHtml }} />
                    ) : (
                      <p>Виріб створено з увагою до посадки, силуету та відчуття тканини на тілі.</p>
                    )}
                  </div>
                </details>

                <details className="group border-t border-[#111111]/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-6 text-xs font-medium uppercase">
                    <span>Тканина та догляд</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="pb-6 text-sm font-light leading-7 text-[#111111]/70">
                    <p>Тільки професійна суха чистка. Не прати. Не відбілювати.</p>
                  </div>
                </details>
                
                <details className="group border-t border-[#111111]/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-6 text-xs font-medium uppercase">
                    <span>Доставка та повернення</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="pb-6 text-sm font-light leading-7 text-[#111111]/70">
                    <p>Безкоштовна доставка Новою Поштою по Україні протягом 1-3 днів. Повернення можливе протягом 14 днів з моменту отримання.</p>
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
                <p className="mb-4 text-xs uppercase text-[#111111]/55">Styling</p>
                <h2 className="font-serif text-4xl font-light uppercase">Complete the look</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:gap-8 lg:grid-cols-3">
              {relatedProducts.map((item) => (
                <ProductCard key={item.handle} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#111111]/10 bg-white px-4 py-3 md:hidden">
        <div className="mb-3 flex items-center justify-between gap-4 text-sm">
          <span className="line-clamp-1">{product.title}</span>
          <span className="shrink-0 text-[#111111]/65">{product.price}</span>
        </div>
        <button className="primary-button w-full" onClick={() => setCartOpen(true)}>
          Додати до кошика
        </button>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-[#111111]/35 transition duration-500 ${
          cartOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setCartOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-dvh w-full max-w-md bg-white px-6 py-7 transition duration-700 md:px-10 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-12 flex items-center justify-between text-xs uppercase">
          <span>Додано до кошика</span>
          <button className="luxury-link" onClick={() => setCartOpen(false)}>
            Закрити
          </button>
        </div>
        <div className="flex gap-5 border-b border-[#111111]/10 pb-8">
          <div className="h-32 w-24 shrink-0 bg-white">
            <img src={images[0]} alt={product.title} className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="font-serif text-2xl uppercase">{product.title}</h2>
            <p className="mt-3 text-sm text-[#111111]/65">{product.price}</p>
            {selectedSize && <p className="mt-2 text-xs uppercase text-[#111111]/50">Розмір {selectedSize}</p>}
          </div>
        </div>
        <button className="primary-button mt-8 w-full">Перейти до оформлення</button>
      </aside>
    </div>
  );
}
