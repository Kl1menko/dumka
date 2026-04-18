"use client";

import Link from "next/link";
import { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const mainImage =
    product.images[0] ||
    "https://cdn.shopify.com/s/files/1/0761/0128/8093/files/8D79654B-A80C-4BD0-903A-FD90FA063B2E.jpg?v=1776442243";
  const hoverImage = product.images[1] || mainImage;

  return (
    <Link 
      href={`/shop/${product.handle}`}
      className="group block"
    >
      <div className="product-tile-media">
        <img
          src={mainImage}
          alt={product.title}
          className="product-tile-image opacity-100 group-hover:opacity-0"
          referrerPolicy="no-referrer"
        />
        <img
          src={hoverImage}
          alt={`${product.title} alternative`}
          className="product-tile-image scale-[1.015] opacity-0 group-hover:scale-100 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        <span className="product-tile-action" aria-hidden="true">+</span>
      </div>

      <div className="px-1 pb-2 sm:px-0">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-[13px] leading-5 text-[#111111] sm:min-h-0 sm:text-sm">
          {product.title}
        </h3>
        <p className="mt-1 text-[12px] leading-5 text-[#111111]/62 sm:text-sm">
          {product.price}
        </p>
      </div>
    </Link>
  );
}
