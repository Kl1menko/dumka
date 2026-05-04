import Link from "next/link";

export const metadata = {
  title: "Сторінку не знайдено | DUMKA by Nadiya Dumka",
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <p className="mb-6 text-xs uppercase tracking-widest text-[#111111]/40">404</p>
      <h1 className="mb-4 font-serif text-4xl font-light uppercase md:text-6xl">
        Сторінку не знайдено
      </h1>
      <p className="mb-12 max-w-sm text-sm leading-7 text-[#111111]/55">
        Можливо, посилання застаріло або сторінку було видалено.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/" className="primary-button px-8">
          На головну
        </Link>
        <Link href="/shop" className="ghost-button px-8">
          Каталог
        </Link>
      </div>
    </div>
  );
}
