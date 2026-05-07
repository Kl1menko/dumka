export const revalidate = 60;

import Image from "next/image";
import { getProducts } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { HomeCategorySlider } from "@/components/HomeCategorySlider";
import { getSiteContent } from "@/content/site";
import { ScrollRevealInit } from "@/components/ScrollRevealInit";
import { Locale } from "@/lib/i18n";

export default function HomePage() {
  return HomePageContent({ locale: "uk" });
}

export async function HomePageContent({ locale = "uk" }: { locale?: Locale }) {
  const content = getSiteContent(locale).home;
  const localePrefix = locale === "en" ? "/en" : "";
  const allProducts = await getProducts();
  const products = allProducts.slice(0, 6);
  const heroImage = "/images/hero-maky.jpg";
  const promoVideo = "/videos/maky-promo.mp4";
  const categories = [
    { title: content.categoryTitles.dresses, href: `${localePrefix}/shop?category=dresses`, image: content.categoryImages.dresses },
    { title: content.categoryTitles.suits, href: `${localePrefix}/shop?category=suits`, image: content.categoryImages.suits },
    { title: content.categoryTitles.evening, href: `${localePrefix}/shop?category=evening`, image: content.categoryImages.evening },
  ];
  const seasonalNotes = ["Petalia Veil", "Poppy Veil Elegance", "Petal Grace", "Pavera Rubin"];
  return (
    <>
      <ScrollRevealInit />
      <section className="relative h-dvh min-h-[680px] w-full overflow-hidden bg-white">
        <Image
          src={heroImage}
          alt="DUMKA editorial collection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-85"
        />
        <div className="absolute inset-0 bg-[#111111]/25" />

        <div className="absolute inset-x-0 bottom-12 mx-auto flex max-w-7xl flex-col items-start px-4 text-white md:bottom-16 md:px-8">
          <p className="reveal mb-6 text-xs uppercase opacity-85">{content.heroKicker}</p>
          <h1 className="reveal max-w-4xl font-serif text-6xl font-light uppercase leading-[0.9] md:text-8xl lg:text-9xl">
            {content.heroTitle}
          </h1>
          <a href="#collection" className="reveal mt-10 inline-flex min-h-12 items-center border border-white/55 px-7 text-xs uppercase transition duration-500 hover:bg-white hover:text-[#111111]">
            {content.heroCta}
          </a>
        </div>

        <div className="absolute bottom-10 right-8 hidden flex-col items-center gap-3 text-white md:flex">
          <span className="text-[10px] uppercase tracking-[0.2em] opacity-55" style={{ writingMode: "vertical-rl" }}>
            {locale === "en" ? "Scroll" : "Гортай"}
          </span>
          <span className="h-12 w-px bg-white/30 relative overflow-hidden">
            <span className="absolute inset-x-0 top-0 h-full w-full animate-[scroll-line_1.8s_ease-in-out_infinite] bg-white" />
          </span>
        </div>
      </section>

      <HomeCategorySlider categories={categories} cta={content.categoryCta} />

      <section className="relative min-h-[78svh] overflow-hidden bg-[#111111] md:min-h-screen">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-90"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroImage}
          aria-hidden="true"
        >
          <source src={promoVideo} type="video/mp4" />
        </video>
      </section>

      <div className="overflow-hidden border-y border-[#111111]/8 py-4 select-none" aria-hidden="true">
        <div className="flex w-max animate-[marquee_22s_linear_infinite]">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8 pr-8 text-[11px] uppercase tracking-[0.22em] text-[#111111]/40">
              {["DUMKA by Nadiya Dumka", "·", locale === "en" ? "Spring — Summer 2026" : "Весна — Літо 2026", "·", locale === "en" ? "Maky Collection" : "Колекція Маки", "·", locale === "en" ? "Lviv, Ukraine" : "Львів, Україна", "·", locale === "en" ? "Made in Ukraine" : "Виготовлено в Україні", "·"].map((word, j) => (
                <span key={j}>{word}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <section id="collection" className="mx-auto max-w-[1600px] px-4 py-24 md:px-8">
        <div className="mb-20 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <h2 className="font-serif text-4xl font-light uppercase md:text-6xl">{content.collectionTitle}</h2>
          </div>
          <a href="#showroom" className="ghost-button">
            {content.fittingCta}
          </a>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:gap-x-8 md:gap-y-16 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.handle} product={product} locale={locale} />
          ))}
        </div>

        <div className="mt-16 flex justify-center border-t border-[#111111]/8 pt-12">
          <a href={`${localePrefix}/shop`} className="ghost-button px-12 py-4 text-xs">
            {locale === "en" ? "View full catalog" : "Весь каталог"}
          </a>
        </div>
      </section>

      <section id="lookbook" className="bg-[#111111] py-16 text-white md:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 md:grid-cols-2 md:gap-16 md:px-8">
          <div className="relative aspect-[3/4] overflow-hidden bg-white md:max-h-[640px]">
            <img
              src={allProducts[4]?.images[0] || heroImage}
              alt="DUMKA campaign lookbook"
              className="h-full w-full object-cover object-top opacity-90"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col gap-6">
            <p className="text-xs uppercase text-white/55">{content.lookbookKicker}</p>
            <h2 className="font-serif text-3xl font-light leading-snug md:text-4xl lg:text-5xl">
              {content.lookbookTitle}
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs uppercase text-white/50">
              {seasonalNotes.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <a href="#collection" className="luxury-link w-fit text-xs">{content.lookbookCta}</a>
          </div>
        </div>
      </section>

      <section data-reveal className="border-t border-[#111111]/10 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-12 flex items-center justify-between gap-8">
            <p className="text-xs uppercase text-[#111111]/45"></p>
            <h2 className="font-serif text-3xl font-light uppercase md:text-4xl">{content.mediaTitle}</h2>
          </div>

          <div className="grid grid-cols-1 gap-px border border-[#111111]/8 bg-[#111111]/8 sm:grid-cols-3">
            {[
              { name: "Ukrainian Fashion Week", issue: "FW 2025/26", href: "http://fashionweek.ua/uk/news/fw25-26-dumka-pokaz/" },
              { name: "Harper's Bazaar UA", issue: "FW 2025/26", href: "https://harpersbazaar.com.ua/fashion/trends/holovni-trendy-sezonu-osin-zyma-202526-z-podiumiv-ukrainian-fashion-week/" },
              { name: "CoolBaba", issue: "FW 2025/26", href: "https://coolbaba.in.ua/kolekcziya-grono-vid-dumka-by-nadiya-dumka-vytonchena-elegantnist-na-ukrainian-fashion-week/" },
            ].map(({ name, issue, href }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center gap-2 bg-white px-6 py-10 text-center transition hover:bg-[#fafaf9]"
              >
                <span className="text-sm font-light uppercase tracking-wider text-[#111111]/80 transition group-hover:text-[#111111]">{name}</span>
                <span className="text-[10px] uppercase tracking-widest text-[#111111]/30">{issue}</span>
              </a>
            ))}
          </div>

          <div className="mt-10 border border-[#111111]/8 px-8 py-10 md:px-14 md:py-14">
            <p className="font-serif text-2xl font-light leading-relaxed text-[#111111]/75 md:text-3xl">
              &ldquo;{content.media[0]}&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-4">
              <span className="h-px w-8 bg-[#111111]/25" />
              <a
                href="https://harpersbazaar.com.ua/fashion/trends/holovni-trendy-sezonu-osin-zyma-202526-z-podiumiv-ukrainian-fashion-week/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs uppercase tracking-widest text-[#111111]/40 transition hover:text-[#111111]/70"
              >
                Harper's Bazaar UA, 2025/26
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="showroom" className="border-t border-[#111111]/10 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 md:grid-cols-2 md:px-8">
          <div className="relative aspect-[4/5] overflow-hidden bg-white">
            <img
              src={allProducts[5]?.images[0] || heroImage}
              alt="DUMKA showroom fitting"
              className="absolute inset-0 h-full w-full object-cover object-top grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="mb-8 font-serif text-4xl font-light leading-tight md:text-6xl">
              {content.showroomTitle}
            </h2>
            <div className="mb-12 space-y-2 text-sm uppercase text-[#111111]/70">
              {content.address.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>

            <a href="tel:+380677570121" className="primary-button self-start">
              {content.showroomCta}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
