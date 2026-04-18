import { getProducts } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  const allProducts = await getProducts();
  const products = allProducts.slice(0, 6);
  const heroImage =
    allProducts[0]?.images[0] ||
    "https://cdn.shopify.com/s/files/1/0761/0128/8093/files/8D79654B-A80C-4BD0-903A-FD90FA063B2E.jpg?v=1776442243";
  const categoryImages = [allProducts[1]?.images[0], allProducts[2]?.images[0], allProducts[3]?.images[0]].filter(Boolean);
  const categories = [
    { title: "Сукні", image: categoryImages[0] || heroImage },
    { title: "Костюми", image: categoryImages[1] || heroImage },
    { title: "Вечірній одяг", image: categoryImages[2] || heroImage },
  ];
  const seasonalNotes = ["Petalia Veil", "Poppy Veil Elegance", "Petal Grace", "Pavera Rubin"];
  const media = [
    "Головні тренди сезону осінь-зима 2025/26 з подіумів Ukrainian Fashion Week",
    "Колекція GRONO від DUMKA by Nadiya Dumka",
    "FW25-26: DUMKA показ",
  ];

  return (
    <>
      <section className="relative h-dvh min-h-[680px] w-full overflow-hidden bg-[#111111]">
        <img
          src={heroImage}
          alt="DUMKA editorial collection"
          className="absolute inset-0 h-full w-full object-cover opacity-85"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-[#111111]/25" />

        <div className="absolute inset-x-0 bottom-12 mx-auto flex max-w-7xl flex-col items-start px-4 text-white md:bottom-16 md:px-8">
          <p className="reveal mb-6 text-xs uppercase opacity-85">Весна / Літо 2026</p>
          <h1 className="reveal max-w-4xl font-serif text-6xl font-light uppercase leading-[0.9] md:text-8xl lg:text-9xl">
            Маки
          </h1>
          <a href="#collection" className="reveal mt-10 inline-flex min-h-12 items-center border border-white/55 px-7 text-xs uppercase transition duration-500 hover:bg-white hover:text-[#111111]">
            Відкрити колекцію
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-28 md:grid-cols-[0.7fr_1.3fr] md:px-8 md:py-36">
        <p className="text-xs uppercase text-[#111111]/55">DUMKA by Nadiya Dumka</p>
        <h2 className="font-serif text-4xl font-light leading-tight md:text-6xl">
          Нова колекція «Маки» збирає м'якість пелюстки й силу лінії в образи для
          літа, вечора та подій, де важлива присутність.
        </h2>
      </section>

      <section id="collection" className="mx-auto max-w-[1600px] px-4 py-24 md:px-8">
        <div className="mb-20 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="mb-5 text-xs uppercase text-[#111111]/55">Curated edit</p>
            <h2 className="font-serif text-4xl font-light uppercase md:text-6xl">Весна - літо 2026</h2>
          </div>
          <a href="#showroom" className="ghost-button">
            Записатися на примірку
          </a>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:gap-x-8 md:gap-y-16 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-24 md:grid-cols-3 md:px-8">
        {categories.map((category, index) => (
          <a
            href="#collection"
            key={category.title}
            className={`group block ${index === 1 ? "md:mt-24" : ""}`}
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-white">
              <img
                src={category.image}
                alt={category.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="mt-5 font-serif text-3xl uppercase">{category.title}</h3>
          </a>
        ))}
      </section>

      <section id="lookbook" className="bg-[#111111] py-24 text-white md:py-36">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 md:grid-cols-[1.25fr_0.75fr] md:px-8">
          <div className="relative aspect-[4/5] overflow-hidden md:aspect-[16/11]">
            <img
              src={allProducts[4]?.images[0] || heroImage}
              alt="DUMKA campaign lookbook"
              className="h-full w-full object-cover opacity-90"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col justify-end pb-4">
            <p className="mb-6 text-xs uppercase text-white/55">New collection / Spring-Summer 2026</p>
            <h2 className="mb-8 font-serif text-4xl font-light leading-tight md:text-6xl">
              Макова тема переходить у чисті силуети, напругу червоного акценту та
              спокійну архітектуру вечірнього одягу.
            </h2>
            <div className="mb-10 grid grid-cols-2 gap-x-8 gap-y-3 text-xs uppercase text-white/65">
              {seasonalNotes.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <a href="#collection" className="luxury-link self-start text-xs">Дивитися образи</a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-24 md:grid-cols-[0.75fr_1.25fr] md:px-8 md:py-32">
        <div>
          <p className="mb-5 text-xs uppercase text-[#111111]/55">Медіа</p>
          <h2 className="font-serif text-4xl font-light uppercase md:text-6xl">Прес-центр</h2>
        </div>
        <div className="divide-y divide-[#111111]/10 border-y border-[#111111]/10">
          {media.map((item) => (
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
            <p className="mb-6 text-xs uppercase text-[#111111]/55">Офлайн бутик</p>
            <h2 className="mb-8 font-serif text-4xl font-light leading-tight md:text-6xl">
              Примірка у флагманському просторі DUMKA у Львові.
            </h2>
            <div className="mb-12 space-y-2 text-sm uppercase text-[#111111]/70">
              <p>Вул. Шпитальна, 1</p>
              <p>Львів</p>
              <p>ТЦ "Магнус", 3-й поверх</p>
              <p>+38 (067) 757-01-21</p>
            </div>

            <button className="primary-button self-start">
              Запланувати візит
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
