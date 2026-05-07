"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname } from "@/lib/i18n";
import { Product } from "@/lib/types";

const CART_STORAGE_KEY = "dumka-cart-v1";

export interface CartItem {
  id: string;
  variantId: string;
  handle: string;
  title: string;
  image: string;
  size: string;
  color?: string;
  price: string;
  priceNumber: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  subtotalLabel: string;
  isCartOpen: boolean;
  checkoutLoading: boolean;
  checkoutError: string;
  addProduct: (product: Product, size?: string, color?: string) => void;
  checkout: () => Promise<void>;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isEnglish = getLocaleFromPathname(pathname ?? "") === "en";
  const checkoutErrorMsg = isEnglish ? "Failed to proceed to checkout." : "Не вдалося перейти до оформлення.";
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!stored) {
        setHydrated(true);
        return;
      }

      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setItems(parsed.filter(isCartItem));
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.priceNumber * item.quantity, 0);
  const subtotalLabel = formatPrice(subtotal);

  const value = useMemo<CartContextValue>(() => {
    function addProduct(product: Product, size = "", color = "") {
      const selectedVariant =
        product.variants.find(
          (variant) =>
            (size ? variant.size === size : true) &&
            (color ? variant.color === color : true)
        ) ||
        product.variants.find((variant) => (size ? variant.size === size : true)) ||
        product.variants[0];
      const normalizedSize = size || selectedVariant?.size || "";
      const normalizedColor = color || selectedVariant?.color || "";
      const supabaseId = selectedVariant?.id || "";
      const variantId = selectedVariant?.shopifyId || supabaseId;
      const id = `${product.handle}:${supabaseId || `${normalizedSize}:${normalizedColor}` || "default"}`;

      setItems((currentItems) => {
        const existingItem = currentItems.find((item) => item.id === id);

        if (existingItem) {
          return currentItems.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }

        const nextItem: CartItem = {
          id,
          variantId,
          handle: product.handle,
          title: product.title,
          image: product.images[0] || "",
          size: normalizedSize,
          color: normalizedColor,
          price: selectedVariant?.price || product.price,
          priceNumber: selectedVariant?.priceNumber || product.priceNumber,
          quantity: 1,
        };

        return [...currentItems, nextItem];
      });

      setIsCartOpen(true);
      setCheckoutError("");
    }

    async function checkout() {
      if (items.length === 0 || checkoutLoading) {
        return;
      }

      setCheckoutLoading(true);
      setCheckoutError("");

      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
            })),
          }),
        });
        const payload = await response.json();

        if (!response.ok || !payload.checkoutUrl) {
          throw new Error(payload.error || checkoutErrorMsg);
        }

        window.location.href = payload.checkoutUrl;
      } catch (error) {
        setCheckoutError(
          error instanceof Error
            ? error.message
            : checkoutErrorMsg
        );
      } finally {
        setCheckoutLoading(false);
      }
    }

    function updateQuantity(id: string, quantity: number) {
      setItems((currentItems) => {
        if (quantity <= 0) {
          return currentItems.filter((item) => item.id !== id);
        }

        return currentItems.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
      });
    }

    function removeItem(id: string) {
      setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    }

    function clearCart() {
      setItems([]);
    }

    return {
      items,
      itemCount,
      subtotal,
      subtotalLabel,
      isCartOpen,
      checkoutLoading,
      checkoutError,
      addProduct,
      checkout,
      updateQuantity,
      removeItem,
      clearCart,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
    };
  }, [checkoutError, checkoutLoading, isCartOpen, itemCount, items, subtotal, subtotalLabel]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}

function formatPrice(value: number) {
  return `${new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)} ₴`;
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as CartItem;
  return (
    typeof item.id === "string" &&
    typeof item.variantId === "string" &&
    typeof item.handle === "string" &&
    typeof item.title === "string" &&
    (typeof item.color === "string" || typeof item.color === "undefined") &&
    typeof item.price === "string" &&
    typeof item.priceNumber === "number" &&
    typeof item.quantity === "number"
  );
}
