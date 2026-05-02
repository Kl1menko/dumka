import Link from "next/link";
import { getCollectionStories, getStoriesContent, StoryItem } from "@/content/stories";
import { Locale } from "@/lib/i18n";

function getStoriesBasePath(locale: Locale) {
  return locale === "en" ? "/en/stories" : "/stories";
}

export function StoryDetailPageContent({
  locale,
  story,
}: {
  locale: Locale;
  story: StoryItem;
}) {
  const content = getStoriesContent(locale);
  const storiesBasePath = getStoriesBasePath(locale);
  const relatedStories = getCollectionStories(locale)
    .filter((item) => item.slug !== story.slug)
    .slice(0, 3);
  const detailBlocks = story.details ?? [];
  const gallery = story.gallery?.length ? story.gallery : [story.image];

  return (
    <article className="min-h-screen bg-white pt-24 md:pt-32">
      <header className="mx-auto max-w-[1700px] px-4 md:px-8">
        <Link href={storiesBasePath} className="luxury-link text-xs uppercase">
          {content.backLabel}
        </Link>

        <div className="mt-8 border-b border-[#111111]/10 pb-12">
          <div className="flex gap-4 text-[11px] uppercase tracking-widest text-[#111111]/45">
            <span>{story.category}</span>
            <span>{story.year}</span>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-16">
            <h1 className="font-serif text-3xl font-light uppercase leading-tight md:text-5xl lg:text-6xl">
              {story.title}
            </h1>
            <p className="text-base font-light leading-8 text-[#111111]/65 md:text-lg md:leading-9">
              {story.excerpt}
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1700px] px-4 py-10 md:px-8 md:py-16">
        <div className="relative aspect-[4/5] overflow-hidden bg-white">
          <img
            src={story.image}
            alt={story.title}
            className="h-full w-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      <section className="border-y border-[#111111]/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="text-xs uppercase text-[#111111]/55">
            {story.category} / {story.year}
          </div>
          <div className="grid gap-6 text-base font-light leading-8 text-[#111111]/75 md:text-lg md:leading-9">
            {story.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {detailBlocks.length ? (
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
            {detailBlocks.map((block) => (
              <section key={block.title} className="border-t border-[#111111]/10 pt-7">
                <h2 className="font-serif text-3xl font-light uppercase leading-tight">
                  {block.title}
                </h2>
                <p className="mt-5 text-sm leading-7 text-[#111111]/65">{block.text}</p>
              </section>
            ))}
          </div>
        </section>
      ) : null}

      <section className="bg-[#0c0c0c] px-4 py-16 text-white md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[1700px] gap-5 md:grid-cols-3">
          {gallery.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className={index === 0 ? "relative aspect-[5/6] bg-white md:col-span-2" : "relative aspect-[4/5] bg-white"}
            >
              <img
                src={image}
                alt={`${story.title} ${index + 1}`}
                className="h-full w-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1700px] px-4 py-20 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[#111111]/10 pb-7">
          <h2 className="font-serif text-3xl font-light lowercase md:text-4xl">
            {content.moreLabel}
          </h2>
          {story.sourceUrl ? (
            <a
              href={story.sourceUrl}
              className="luxury-link text-xs uppercase"
              target="_blank"
              rel="noreferrer"
            >
              {content.sourceLabel}
            </a>
          ) : null}
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {relatedStories.map((item) => (
            <Link key={item.slug} href={`${storiesBasePath}/${item.slug}`} className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-white">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.015]"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-5 flex gap-3 text-xs uppercase text-[#111111]/55">
                <span>{item.category}</span>
                <span>{item.year}</span>
              </div>
              <h3 className="mt-4 font-serif text-xl font-light uppercase leading-tight md:text-2xl">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}
