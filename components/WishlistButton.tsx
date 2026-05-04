"use client";

import { useWishlist } from "@/lib/wishlist";

interface Props {
  handle: string;
  className?: string;
}

export function WishlistButton({ handle, className = "" }: Props) {
  const { toggle, isWishlisted } = useWishlist();
  const active = isWishlisted(handle);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(handle);
      }}
      aria-label={active ? "Прибрати з вішліста" : "Додати до вішліста"}
      className={`flex h-8 w-8 items-center justify-center transition-opacity ${className}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={active ? "#111111" : "none"}
        stroke="#111111"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
