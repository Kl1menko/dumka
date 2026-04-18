"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Drawer = "menu" | "search" | "cart" | null;

export function SiteHeader() {
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const solidHeader = scrolled || !isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            Меню
          </button>
          <button className="hidden luxury-link sm:block" onClick={() => setDrawer("search")}>
            Пошук
          </button>
        </div>

        <Link href="/" className="justify-self-center text-center leading-none">
          <span className="font-serif text-3xl font-light uppercase md:text-4xl">Dumka</span>
          <span className="mt-1 block text-[10px] normal-case opacity-80">by Nadiya Dumka</span>
        </Link>

        <div className="flex items-center justify-end gap-5">
          <button className="hidden luxury-link sm:block">UA</button>
          <button className="luxury-link" onClick={() => setDrawer("cart")}>
            Кошик (0)
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-[#111111]/35 transition duration-500 ${
          drawer ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setDrawer(null)}
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-dvh w-full max-w-md bg-white px-6 py-7 text-[#111111] shadow-2xl transition duration-700 md:px-10 ${
          drawer ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-14 flex items-center justify-between text-xs uppercase">
          <span>{drawer === "search" ? "Пошук" : drawer === "cart" ? "Кошик" : "Навігація"}</span>
          <button className="luxury-link" onClick={() => setDrawer(null)}>
            Закрити
          </button>
        </div>

        {drawer === "menu" && (
          <div className="grid gap-12">
            <nav className="flex flex-col gap-6 font-serif text-4xl uppercase">
              <Link href="/" onClick={() => setDrawer(null)}>
                Головна
              </Link>
              <a href="#collection" onClick={() => setDrawer(null)}>
                Маки
              </a>
              <a href="#lookbook" onClick={() => setDrawer(null)}>
                Lookbook
              </a>
              <a href="#showroom" onClick={() => setDrawer(null)}>
                Шоурум
              </a>
            </nav>
            <div className="grid grid-cols-2 gap-8 border-t border-[#111111]/10 pt-8 text-xs uppercase text-[#111111]/60">
              <div className="space-y-4">
                <p className="text-[#111111]">Каталог</p>
                <a className="block luxury-link" href="#collection" onClick={() => setDrawer(null)}>Костюми</a>
                <a className="block luxury-link" href="#collection" onClick={() => setDrawer(null)}>Сукні</a>
                <a className="block luxury-link" href="#collection" onClick={() => setDrawer(null)}>Вечірній одяг</a>
                <a className="block luxury-link" href="#collection" onClick={() => setDrawer(null)}>Блузи</a>
                <a className="block luxury-link" href="#collection" onClick={() => setDrawer(null)}>Жилети</a>
                <a className="block luxury-link" href="#collection" onClick={() => setDrawer(null)}>Топи</a>
                <a className="block luxury-link" href="#collection" onClick={() => setDrawer(null)}>Шорти</a>
              </div>
              <div className="space-y-4">
                <p className="text-[#111111]">Колекції</p>
                <a className="block luxury-link" href="#lookbook" onClick={() => setDrawer(null)}>Маки 2026</a>
                <a className="block luxury-link" href="#lookbook" onClick={() => setDrawer(null)}>Гроно 2025/26</a>
                <a className="block luxury-link" href="#lookbook" onClick={() => setDrawer(null)}>Калина 2023</a>
                <a className="block luxury-link" href="#lookbook" onClick={() => setDrawer(null)}>Окрилена Україною</a>
              </div>
            </div>
          </div>
        )}

        {drawer === "search" && (
          <form className="space-y-10">
            <label className="floating-field">
              <input placeholder=" " />
              <span>Що шукаєте?</span>
            </label>
            <button className="primary-button w-full">Шукати</button>
          </form>
        )}

        {drawer === "cart" && (
          <div className="flex h-[calc(100%-80px)] flex-col justify-between">
            <p className="max-w-sm text-sm leading-7 text-[#111111]/65">
              Кошик порожній. Додайте виріб до замовлення, і він з'явиться тут без переходу на
              окрему сторінку.
            </p>
            <button className="primary-button w-full">Перейти до оформлення</button>
          </div>
        )}
      </aside>
    </>
  );
}
