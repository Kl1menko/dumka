"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { useCurrency } from "@/components/CurrencyProvider";
import { CurrencyCode } from "@/lib/currency";
import { getLocaleFromPathname, localizePath } from "@/lib/i18n";

type Drawer = "menu" | "search" | null;

interface SearchResult {
  handle: string;
  title: string;
  price: string;
  priceNumber: number;
  image: string;
}

export function SiteHeader() {
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const {
    items,
    itemCount,
    subtotal,
    isCartOpen,
    checkoutLoading,
    checkoutError,
    openCart,
    closeCart,
    checkout,
    updateQuantity,
    removeItem,
  } = useCart();
  const { currency, rateDate, setCurrency, formatPrice } = useCurrency();
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isEnglish = locale === "en";
  const isHome = pathname === "/" || pathname === "/en";
  const homeHref = isEnglish ? "/en" : "/";
  const solidHeader = scrolled || !isHome;
  const overlayOpen = Boolean(drawer) || isCartOpen;
  const oppositeLocaleHref = localizePath(pathname, isEnglish ? "uk" : "en");

  function closeDrawers() {
    setDrawer(null);
    setCurrencyMenuOpen(false);
    closeCart();
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (drawer !== "search") {
      return;
    }

    const query = searchQuery.trim();
    if (query.length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      setSearchError("");
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setSearchLoading(true);
      setSearchError("");

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Пошук тимчасово недоступний.");
        }

        setSearchResults(Array.isArray(payload.products) ? payload.products : []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setSearchError(
          error instanceof Error ? error.message : "Пошук тимчасово недоступний."
        );
      } finally {
        setSearchLoading(false);
      }
    }, 280);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [drawer, searchQuery]);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 grid grid-cols-3 items-center px-4 py-4 text-xs uppercase transition duration-700 md:px-8 ${
          solidHeader
            ? "border-b border-[#111111]/10 bg-white text-[#111111]"
            : "text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.22)]"
        }`}
      >
        <div className="flex items-center gap-5">
          <button className="luxury-link" onClick={() => setDrawer("menu")}>
            {isEnglish ? "Menu" : "Меню"}
          </button>
          <button className="hidden luxury-link sm:block" onClick={() => setDrawer("search")}>
            {isEnglish ? "Search" : "Пошук"}
          </button>
        </div>

        <Link href={homeHref} className="justify-self-center text-center leading-none">
          <span className="font-serif text-3xl font-light uppercase md:text-4xl">Dumka</span>
          <span className="mt-1 block text-[10px] normal-case opacity-80">by Nadiya Dumka</span>
        </Link>

        <div className="flex items-center justify-end gap-5">
          <Link className="hidden luxury-link sm:block" href={oppositeLocaleHref}>
            {isEnglish ? "UA" : "EN"}
          </Link>
          <div className="relative hidden sm:block">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full border border-current/35 text-[11px] uppercase transition hover:bg-current hover:text-white"
              aria-label={isEnglish ? "Select currency" : "Обрати валюту"}
              onClick={() => setCurrencyMenuOpen((open) => !open)}
            >
              {currency === "UAH" ? "₴" : currency === "USD" ? "$" : "€"}
            </button>
            <div
              className={`absolute right-0 top-10 w-40 border border-[#111111]/10 bg-white p-2 text-[#111111] shadow-xl transition ${
                currencyMenuOpen
                  ? "pointer-events-auto translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0"
              }`}
            >
              <CurrencySwitcher
                activeCurrency={currency}
                onSelect={(nextCurrency) => {
                  setCurrency(nextCurrency);
                  setCurrencyMenuOpen(false);
                }}
              />
              <p className="mt-3 px-1 text-[10px] leading-4 text-[#111111]/45">
                {isEnglish ? "NBU" : "НБУ"}: {rateDate}
              </p>
            </div>
          </div>
          <button
            className="luxury-link"
            onClick={() => {
              setDrawer(null);
              openCart();
            }}
          >
            {isEnglish ? "Cart" : "Кошик"} ({itemCount})
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-[#111111]/35 transition duration-500 ${
          overlayOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawers}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-white px-6 py-7 text-[#111111] shadow-2xl transition duration-700 md:px-10 ${
          drawer ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-6 shrink-0 flex items-center justify-between text-xs uppercase">
          <span>{drawer === "search" ? (isEnglish ? "Search" : "Пошук") : (isEnglish ? "Navigation" : "Навігація")}</span>
          <button className="luxury-link" onClick={() => setDrawer(null)}>
            {isEnglish ? "Close" : "Закрити"}
          </button>
        </div>

        {drawer === "menu" && (
          <div className="min-h-0 flex-1 overflow-y-auto pb-8">
          <div className="grid gap-12">
            <nav className="flex flex-col gap-6 font-serif text-4xl uppercase">
              <Link href={homeHref} onClick={() => setDrawer(null)}>
                {isEnglish ? "Home" : "Головна"}
              </Link>
              <Link href={`${isEnglish ? "/en" : ""}/#collection`} onClick={() => setDrawer(null)}>
                {isEnglish ? "Maky" : "Маки"}
              </Link>
              <Link href={`${isEnglish ? "/en" : ""}/#lookbook`} onClick={() => setDrawer(null)}>
                Lookbook
              </Link>
              <Link href={`${isEnglish ? "/en" : ""}/#showroom`} onClick={() => setDrawer(null)}>
                {isEnglish ? "Showroom" : "Шоурум"}
              </Link>
              <Link href={`${isEnglish ? "/en" : ""}/stories`} onClick={() => setDrawer(null)}>
                Stories
              </Link>
            </nav>
            <div className="grid grid-cols-2 gap-8 border-t border-[#111111]/10 pt-8 text-xs uppercase text-[#111111]/60">
              <div className="space-y-4">
                <p className="text-[#111111]">{isEnglish ? "Catalog" : "Каталог"}</p>
                <Link className="block luxury-link" href={`${isEnglish ? "/en" : ""}/shop`} onClick={() => setDrawer(null)}>{isEnglish ? "All products" : "Усі товари"}</Link>
                <Link className="block luxury-link" href={`${isEnglish ? "/en" : ""}/shop?category=suits`} onClick={() => setDrawer(null)}>{isEnglish ? "Suits" : "Костюми"}</Link>
                <Link className="block luxury-link" href={`${isEnglish ? "/en" : ""}/shop?category=dresses`} onClick={() => setDrawer(null)}>{isEnglish ? "Dresses" : "Сукні"}</Link>
                <Link className="block luxury-link" href={`${isEnglish ? "/en" : ""}/shop?category=evening`} onClick={() => setDrawer(null)}>{isEnglish ? "Evening wear" : "Вечірній одяг"}</Link>
                <Link className="block luxury-link" href={`${isEnglish ? "/en" : ""}/shop?category=blouses`} onClick={() => setDrawer(null)}>{isEnglish ? "Blouses" : "Блузи"}</Link>
                <Link className="block luxury-link" href={`${isEnglish ? "/en" : ""}/shop?category=vests`} onClick={() => setDrawer(null)}>{isEnglish ? "Vests" : "Жилети"}</Link>
                <Link className="block luxury-link" href={`${isEnglish ? "/en" : ""}/shop?category=tops`} onClick={() => setDrawer(null)}>{isEnglish ? "Tops" : "Топи"}</Link>
                <Link className="block luxury-link" href={`${isEnglish ? "/en" : ""}/shop?category=shorts`} onClick={() => setDrawer(null)}>{isEnglish ? "Shorts" : "Шорти"}</Link>
              </div>
              <div className="space-y-4">
                <p className="text-[#111111]">{isEnglish ? "Collections" : "Колекції"}</p>
                <Link className="block luxury-link" href={`${isEnglish ? "/en" : ""}/stories/maky-spring-summer-2026`} onClick={() => setDrawer(null)}>{isEnglish ? "Maky 2026" : "Маки 2026"}</Link>
                <Link className="block luxury-link" href={`${isEnglish ? "/en" : ""}/stories/grono-fall-winter-2025`} onClick={() => setDrawer(null)}>{isEnglish ? "Grono 2025/26" : "Гроно 2025/26"}</Link>
                <Link className="block luxury-link" href={`${isEnglish ? "/en" : ""}/stories/kalyna-2023`} onClick={() => setDrawer(null)}>{isEnglish ? "Kalyna 2023" : "Калина 2023"}</Link>
                <Link className="block luxury-link" href={`${isEnglish ? "/en" : ""}/stories/inspired-by-ukraine-2022`} onClick={() => setDrawer(null)}>{isEnglish ? "Inspired by Ukraine" : "Окрилена Україною"}</Link>
              </div>
            </div>
            <div className="border-t border-[#111111]/10 pt-8">
              <p className="mb-4 text-xs uppercase text-[#111111]/55">
                {isEnglish ? "Currency" : "Валюта"}
              </p>
              <CurrencySwitcher activeCurrency={currency} onSelect={setCurrency} />
              <p className="mt-4 text-[11px] leading-5 text-[#111111]/45">
                {isEnglish ? "NBU official rate" : "Офіційний курс НБУ"}: {rateDate}
              </p>
            </div>
          </div>
          </div>
        )}

        {drawer === "search" && (
          <form
            className="min-h-0 flex-1 overflow-y-auto pb-8 space-y-10"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="floating-field">
              <input
                autoFocus
                placeholder=" "
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <span>{isEnglish ? "What are you looking for?" : "Що шукаєте?"}</span>
            </label>

            <div className="border-y border-[#111111]/10">
              {searchQuery.trim().length < 2 && (
                <p className="py-7 text-sm leading-7 text-[#111111]/60">
                  {isEnglish ? "Enter at least two letters to search the catalog." : "Введіть щонайменше дві літери, щоб знайти виріб у каталозі."}
                </p>
              )}

              {searchLoading && (
                <p className="py-7 text-sm leading-7 text-[#111111]/60">
                  {isEnglish ? "Searching the catalog..." : "Шукаємо в каталозі..."}
                </p>
              )}

              {searchError && (
                <p className="py-7 text-sm leading-7 text-[#9f1d1d]">
                  {searchError}
                </p>
              )}

              {!searchLoading &&
                !searchError &&
                searchQuery.trim().length >= 2 &&
                searchResults.length === 0 && (
                  <p className="py-7 text-sm leading-7 text-[#111111]/60">
                    {isEnglish ? "No results. Try another query or open the full catalog." : "Нічого не знайдено. Спробуйте інший запит або перегляньте весь каталог."}
                  </p>
                )}

              {!searchLoading &&
                !searchError &&
                searchResults.map((product) => (
                  <Link
                    key={product.handle}
                    href={`${isEnglish ? "/en" : ""}/shop/${product.handle}`}
                    className="flex gap-5 border-b border-[#111111]/10 py-5 last:border-b-0"
                    onClick={() => setDrawer(null)}
                  >
                    <div className="h-28 w-20 shrink-0 bg-white">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-full w-full border border-[#111111]/10" />
                      )}
                    </div>
                    <div className="min-w-0 pt-1">
                      <p className="font-serif text-2xl uppercase leading-tight">
                        {product.title}
                      </p>
                      <p className="mt-2 text-xs uppercase text-[#111111]/50">
                        {formatPrice(product.priceNumber)}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>

            <Link className="primary-button w-full" href={`${isEnglish ? "/en" : ""}/shop`} onClick={() => setDrawer(null)}>
              {isEnglish ? "Full catalog" : "Весь каталог"}
            </Link>
          </form>
        )}

      </aside>

      <aside
        className={`fixed right-0 top-0 z-50 h-dvh w-full max-w-md bg-white px-6 py-7 text-[#111111] shadow-2xl transition duration-700 md:px-10 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-10 flex items-center justify-between text-xs uppercase">
          <span>{isEnglish ? "Cart" : "Кошик"}</span>
          <button className="luxury-link" onClick={closeCart}>
            {isEnglish ? "Close" : "Закрити"}
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex h-[calc(100%-80px)] flex-col justify-between">
            <p className="max-w-sm text-sm leading-7 text-[#111111]/65">
              {isEnglish ? "Your cart is empty. Add a piece and it will appear here without opening a separate page." : "Кошик порожній. Додайте виріб до замовлення, і він з'явиться тут без переходу на окрему сторінку."}
            </p>
            <Link className="primary-button w-full" href={`${isEnglish ? "/en" : ""}/shop`} onClick={closeCart}>
              {isEnglish ? "Open catalog" : "До каталогу"}
            </Link>
          </div>
        ) : (
          <div className="flex h-[calc(100%-72px)] flex-col">
            <div className="mobile-product-rail flex-1 overflow-y-auto border-y border-[#111111]/10">
              {items.map((item) => (
                <div key={item.id} className="flex gap-5 border-b border-[#111111]/10 py-6 last:border-b-0">
                  <Link
                    href={`${isEnglish ? "/en" : ""}/shop/${item.handle}`}
                    className="h-32 w-24 shrink-0 bg-white"
                    onClick={closeCart}
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full border border-[#111111]/10" />
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`${isEnglish ? "/en" : ""}/shop/${item.handle}`}
                      className="font-serif text-2xl uppercase leading-tight"
                      onClick={closeCart}
                    >
                      {item.title}
                    </Link>
                    <div className="mt-3 space-y-1 text-xs uppercase text-[#111111]/50">
                      {(item.size || item.color) && (
                        <p>
                          {isEnglish ? "Variant" : "Варіант"}{" "}
                          {[item.size, item.color].filter(Boolean).join(" / ")}
                        </p>
                      )}
                      <p>{formatPrice(item.priceNumber)}</p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-5">
                      <div className="flex h-9 items-center border border-[#111111]/15">
                        <button
                          className="h-full w-9 text-sm"
                          aria-label={isEnglish ? "Decrease quantity" : "Зменшити кількість"}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs">{item.quantity}</span>
                        <button
                          className="h-full w-9 text-sm"
                          aria-label={isEnglish ? "Increase quantity" : "Збільшити кількість"}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="luxury-link text-[11px] uppercase text-[#111111]/55"
                        onClick={() => removeItem(item.id)}
                      >
                        {isEnglish ? "Remove" : "Прибрати"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <div className="mb-5 flex items-center justify-between text-sm uppercase">
                <span>{isEnglish ? "Subtotal" : "Разом"}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <button
                className="primary-button w-full disabled:bg-[#111111]/25"
                disabled={checkoutLoading}
                onClick={checkout}
              >
                {checkoutLoading
                  ? isEnglish ? "Preparing checkout" : "Готуємо оформлення"
                  : isEnglish ? "Proceed to checkout" : "Перейти до оформлення"}
              </button>
              {checkoutError ? (
                <p className="mt-4 text-xs leading-5 text-[#9f1d1d]">
                  {checkoutError}
                </p>
              ) : (
                <p className="mt-4 text-xs leading-5 text-[#111111]/50">
                  {isEnglish ? "Checkout opens on Shopify's secure page." : "Оформлення відкриється на захищеній сторінці Shopify."}
                </p>
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

function CurrencySwitcher({
  activeCurrency,
  onSelect,
}: {
  activeCurrency: CurrencyCode;
  onSelect: (currency: CurrencyCode) => void;
}) {
  const currencies: CurrencyCode[] = ["UAH", "USD", "EUR"];

  return (
    <div className="grid grid-cols-3 gap-2">
      {currencies.map((item) => (
        <button
          key={item}
          className={`min-h-10 border text-xs uppercase transition ${
            activeCurrency === item
              ? "border-[#111111] bg-[#111111] text-white"
              : "border-[#111111]/15 text-[#111111] hover:border-[#111111]/45"
          }`}
          onClick={() => onSelect(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
