"use client";

import { useEffect, useRef, useState } from "react";

type HomeCategory = {
  title: string;
  href: string;
  image: string;
};

export function HomeCategorySlider({
  categories,
  cta,
}: {
  categories: HomeCategory[];
  cta: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const updateProgress = () => {
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      setProgress(maxScroll > 0 ? scroller.scrollLeft / maxScroll : 0);
    };

    updateProgress();
    scroller.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      scroller.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <section className="overflow-hidden bg-white py-3 md:px-6 md:py-6">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => (
          <a
            href={category.href}
            key={category.title}
            className="group relative block min-h-[520px] min-w-[84vw] snap-center overflow-hidden bg-[#111111] md:min-h-[680px] md:min-w-0"
          >
            <img
              src={category.image}
              alt={category.title}
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-[1.025]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/55 via-[#111111]/5 to-transparent" />
            <div className="absolute inset-x-6 bottom-10 flex flex-col items-center text-center text-white md:bottom-14">
              <h2 className="font-serif text-3xl font-semibold uppercase tracking-[0.04em] md:text-4xl">
                {category.title}
              </h2>
              <span className="mt-7 border-b border-white/70 pb-1 text-xs uppercase tracking-[0.22em] text-white/85 transition duration-500 group-hover:border-white group-hover:text-white">
                {cta}
              </span>
            </div>
          </a>
        ))}
      </div>

      <div className="mx-auto mt-4 h-px w-28 bg-[#111111]/18 md:hidden">
        <div
          className="h-px bg-[#111111] transition-transform duration-150"
          style={{
            width: `${100 / categories.length}%`,
            transform: `translateX(${progress * (categories.length - 1) * 100}%)`,
          }}
        />
      </div>
    </section>
  );
}
