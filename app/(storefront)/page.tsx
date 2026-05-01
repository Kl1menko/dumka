import { getProducts } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { HomeCategorySlider } from "@/components/HomeCategorySlider";
import { getSiteContent } from "@/content/site";
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
  const categoryImages = [allProducts[1]?.images[0], allProducts[2]?.images[0], allProducts[3]?.images[0]].filter(Boolean);
  const categories = [
    { title: content.categoryTitles.dresses, href: `${localePrefix}/shop?category=dresses`, image: categoryImages[0] || heroImage },
    { title: content.categoryTitles.suits, href: `${localePrefix}/shop?category=suits`, image: categoryImages[1] || heroImage },
    { title: content.categoryTitles.evening, href: `${localePrefix}/shop?category=evening`, image: categoryImages[2] || heroImage },
  ];
  const seasonalNotes = ["Petalia Veil", "Poppy Veil Elegance", "Petal Grace", "Pavera Rubin"];

  return (
    <>
      <section className="relative h-dvh min-h-[680px] w-full overflow-hidden bg-white">
        <img
          src={heroImage}
          alt="DUMKA editorial collection"
          className="absolute inset-0 h-full w-full object-cover object-top opacity-85 md:object-contain md:object-center"
          referrerPolicy="no-referrer"
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
      </section>

      <HomeCategorySlider categories={categories} cta={content.categoryCta} />

      <section className="relative min-h-[78svh] overflow-hidden bg-[#111111] text-white md:min-h-screen">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-80"
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
        <div className="absolute inset-0 bg-[#111111]/35" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#111111]/80 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[78svh] max-w-7xl flex-col justify-end px-4 py-16 md:min-h-screen md:px-8 md:py-24">
          <p className="mb-6 text-xs uppercase text-white/70">{content.promoKicker}</p>
          <h2 className="max-w-4xl font-serif text-5xl font-light uppercase leading-[0.92] md:text-7xl lg:text-8xl">
            {content.promoTitle}
          </h2>
          <div className="mt-8 flex max-w-2xl flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
            <p className="text-base font-light leading-7 text-white/78 md:text-lg md:leading-8">
              {content.promoText}
            </p>
            <a
              href={`${localePrefix}/stories/maky-spring-summer-2026`}
              className="inline-flex min-h-12 shrink-0 items-center border border-white/55 px-7 text-xs uppercase transition duration-500 hover:bg-white hover:text-[#111111]"
            >
              {content.promoCta}
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-28 md:grid-cols-[0.7fr_1.3fr] md:px-8 md:py-36">
        <p className="text-xs uppercase text-[#111111]/55">{content.statementKicker}</p>
        <h2 className="font-serif text-4xl font-light leading-tight md:text-6xl">
          {content.statement}
        </h2>
      </section>

      <section id="collection" className="mx-auto max-w-[1600px] px-4 py-24 md:px-8">
        <div className="mb-20 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="mb-5 text-xs uppercase text-[#111111]/55">{content.collectionKicker}</p>
            <h2 className="font-serif text-4xl font-light uppercase md:text-6xl">{content.collectionTitle}</h2>
          </div>
          <a href="#showroom" className="ghost-button">
            {content.fittingCta}
          </a>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:gap-x-8 md:gap-y-16 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </div>
      </section>

      <section id="lookbook" className="bg-[#111111] py-24 text-white md:py-36">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 md:grid-cols-[1.25fr_0.75fr] md:px-8">
          <div className="relative aspect-[4/5] overflow-hidden bg-white md:aspect-[16/11]">
            <img
              src={allProducts[4]?.images[0] || heroImage}
              alt="DUMKA campaign lookbook"
              className="h-full w-full object-contain opacity-90"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col justify-end pb-4">
            <p className="mb-6 text-xs uppercase text-white/55">{content.lookbookKicker}</p>
            <h2 className="mb-8 font-serif text-4xl font-light leading-tight md:text-6xl">
              {content.lookbookTitle}
            </h2>
            <div className="mb-10 grid grid-cols-2 gap-x-8 gap-y-3 text-xs uppercase text-white/65">
              {seasonalNotes.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <a href="#collection" className="luxury-link self-start text-xs">{content.lookbookCta}</a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-24 md:grid-cols-[0.75fr_1.25fr] md:px-8 md:py-32">
        <div>
          <p className="mb-5 text-xs uppercase text-[#111111]/55">{content.mediaKicker}</p>
          <h2 className="font-serif text-4xl font-light uppercase md:text-6xl">{content.mediaTitle}</h2>
        </div>
        <div className="divide-y divide-[#111111]/10 border-y border-[#111111]/10">
          {content.media.map((item) => (
            <article key={item} className="py-7">
              <h3 className="font-serif text-2xl leading-tight md:text-3xl">{item}</h3>
            </article>
          ))}
        </div>
      </section>

      <section id="showroom" className="border-t border-[#111111]/10 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-4 md:grid-cols-2 md:px-8">
          <div className="relative aspect-[4/5] overflow-hidden bg-white">
            <img
              src={allProducts[5]?.images[0] || heroImage}
              alt="DUMKA showroom fitting"
              className="absolute inset-0 h-full w-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col">
            <p className="mb-6 text-xs uppercase text-[#111111]/55">{content.showroomKicker}</p>
            <h2 className="mb-8 font-serif text-4xl font-light leading-tight md:text-6xl">
              {content.showroomTitle}
            </h2>
            <div className="mb-12 space-y-2 text-sm uppercase text-[#111111]/70">
              {content.address.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>

            <button className="primary-button self-start">
              {content.showroomCta}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
