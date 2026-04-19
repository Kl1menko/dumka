import Link from "next/link";
import { getStoriesContent } from "@/content/stories";
import { Locale } from "@/lib/i18n";

function getStoriesBasePath(locale: Locale) {
  return locale === "en" ? "/en/stories" : "/stories";
}

function getStorySourceUrl(story: unknown) {
  if (
    typeof story === "object" &&
    story !== null &&
    "sourceUrl" in story &&
    typeof story.sourceUrl === "string"
  ) {
    return story.sourceUrl;
  }

  return null;
}

function getStorySlug(story: unknown) {
  if (
    typeof story === "object" &&
    story !== null &&
    "slug" in story &&
    typeof story.slug === "string"
  ) {
    return story.slug;
  }

  return null;
}

export function StoriesPageContent({ locale }: { locale: Locale }) {
  const content = getStoriesContent(locale);
  const mainStory = content.stories[0];
  const supportingStories = content.stories.slice(1);
  const storiesBasePath = getStoriesBasePath(locale);
  const mainStorySlug = getStorySlug(mainStory);
  const mainStorySourceUrl = getStorySourceUrl(mainStory);

  return (
    <div className="min-h-screen bg-white pt-28 md:pt-36">
      <section className="mx-auto max-w-[1600px] px-4 md:px-8">
        <h1 className="font-serif text-6xl font-light lowercase leading-none md:text-8xl">
          {content.title}
        </h1>

        <div className="mt-10 grid gap-5 border-y border-[#111111]/10 py-5 text-xs uppercase text-[#111111]/65 lg:grid-cols-[1fr_auto] lg:items-center">
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {content.filters.map((filter, index) => (
              <a
                key={filter}
                href="#stories-grid"
                className={index === 0 ? "text-[#111111]" : "luxury-link"}
              >
                {filter}
              </a>
            ))}
          </nav>
          <nav className="flex flex-wrap gap-x-6 gap-y-3 lg:justify-end">
            <span className="text-[#111111]">{content.yearsLabel}</span>
            {content.years.map((year) => (
              <a key={year} href="#stories-grid" className="luxury-link">
                {year}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-14 md:px-8 md:py-20">
        <article className="grid gap-10 border-b border-[#111111]/10 pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="relative aspect-[16/10] overflow-hidden bg-white">
            <img
              src={mainStory.image}
              alt={mainStory.title}
              className="h-full w-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col justify-end">
            <div className="mb-8 flex flex-wrap gap-x-4 gap-y-2 text-xs uppercase text-[#111111]/55">
              <span>{mainStory.category}</span>
              <span>{mainStory.year}</span>
            </div>
            <h2 className="font-serif text-4xl font-light uppercase leading-tight md:text-6xl">
              {mainStory.title}
            </h2>
            <p className="mt-8 max-w-xl text-lg font-light leading-8 text-[#111111]/70">
              {mainStory.excerpt}
            </p>
            {mainStorySlug ? (
              <Link
                href={`${storiesBasePath}/${mainStorySlug}`}
                className="luxury-link mt-8 w-fit text-xs uppercase"
              >
                {content.readLabel}
              </Link>
            ) : mainStorySourceUrl ? (
              <a
                href={mainStorySourceUrl}
                className="luxury-link mt-8 w-fit text-xs uppercase"
                target="_blank"
                rel="noreferrer"
              >
                {content.sourceLabel}
              </a>
            ) : null}
          </div>
        </article>
      </section>

      <section id="stories-grid" className="mx-auto max-w-[1600px] px-4 pb-24 md:px-8 md:pb-32">
        <div className="grid gap-8 md:grid-cols-3">
          {supportingStories.map((story) => {
            const storySlug = getStorySlug(story);
            const storySourceUrl = getStorySourceUrl(story);

            return (
              <article key={story.title} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-white">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="h-full w-full object-contain transition duration-700 group-hover:scale-[1.015]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="mt-5 flex gap-3 text-xs uppercase text-[#111111]/55">
                  <span>{story.category}</span>
                  <span>{story.year}</span>
                </div>
                <h3 className="mt-4 font-serif text-3xl font-light uppercase leading-tight">
                  {story.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#111111]/65">
                  {story.excerpt}
                </p>
                {storySlug ? (
                  <Link
                    href={`${storiesBasePath}/${storySlug}`}
                    className="luxury-link mt-5 inline-flex text-xs uppercase"
                  >
                    {content.readLabel}
                  </Link>
                ) : storySourceUrl ? (
                  <a
                    href={storySourceUrl}
                    className="luxury-link mt-5 inline-flex text-xs uppercase"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {content.sourceLabel}
                  </a>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[#111111]/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-8 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="text-xs uppercase text-[#111111]/55">{mainStory.category}</p>
            <h2 className="mt-5 font-serif text-4xl font-light uppercase leading-tight md:text-5xl">
              {mainStory.title}
            </h2>
          </div>
          <div className="grid gap-7 text-xl font-light leading-9 text-[#111111]/72">
            {mainStory.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {supportingStories.map((story) => {
            const storySlug = getStorySlug(story);
            const storySourceUrl = getStorySourceUrl(story);

            return (
              <article key={`${story.title}-body`} className="border-t border-[#111111]/10 pt-7">
                <p className="mb-4 text-xs uppercase text-[#111111]/55">{story.category}</p>
                <h3 className="font-serif text-3xl font-light uppercase leading-tight">
                  {story.title}
                </h3>
                <div className="mt-6 grid gap-4 text-sm leading-7 text-[#111111]/65">
                  {story.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {storySlug ? (
                  <Link
                    href={`${storiesBasePath}/${storySlug}`}
                    className="luxury-link mt-6 inline-flex text-xs uppercase"
                  >
                    {content.readLabel}
                  </Link>
                ) : storySourceUrl ? (
                  <a
                    href={storySourceUrl}
                    className="luxury-link mt-6 inline-flex text-xs uppercase"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {content.sourceLabel}
                  </a>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
