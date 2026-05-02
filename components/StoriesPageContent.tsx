"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
  const [activeFilter, setActiveFilter] = useState(content.filters[0] || "all");
  const [activeYear, setActiveYear] = useState<string>("");
  const storiesBasePath = getStoriesBasePath(locale);

  const filteredStories = useMemo(() => {
    return content.stories.filter((story) => {
      const matchFilter =
        !activeFilter ||
        activeFilter.toLowerCase().includes("all") ||
        story.category.toLowerCase() === activeFilter.toLowerCase();
      const matchYear = !activeYear || story.year === activeYear;
      return matchFilter && matchYear;
    });
  }, [activeFilter, activeYear, content.stories]);

  const visibleStories = filteredStories.length ? filteredStories : content.stories;
  const mainStory = visibleStories[0];
  const supportingStories = visibleStories.slice(1);
  const mainStorySlug = mainStory ? getStorySlug(mainStory) : null;
  const mainStorySourceUrl = mainStory ? getStorySourceUrl(mainStory) : null;

  return (
    <div className="min-h-screen bg-white pt-28 md:pt-36">
      <section className="mx-auto max-w-[1600px] px-4 md:px-8">
        <h1 className="font-serif text-5xl font-light lowercase leading-none md:text-7xl">
          {content.title}
        </h1>

        <div className="mt-10 grid gap-5 border-y border-[#111111]/10 py-5 text-xs uppercase text-[#111111]/65 lg:grid-cols-[1fr_auto] lg:items-center">
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {content.filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={activeFilter === filter ? "text-[#111111]" : "luxury-link"}
              >
                {filter}
              </button>
            ))}
          </nav>
          <nav className="flex flex-wrap gap-x-6 gap-y-3 lg:justify-end">
            <button
              type="button"
              onClick={() => setActiveYear("")}
              className={activeYear ? "luxury-link" : "text-[#111111]"}
            >
              {content.yearsLabel}
            </button>
            {content.years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setActiveYear(year)}
                className={activeYear === year ? "text-[#111111]" : "luxury-link"}
              >
                {year}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {mainStory ? (
      <section className="mx-auto max-w-[1600px] px-4 py-14 md:px-8 md:py-20">
        <article className="grid gap-10 border-b border-[#111111]/10 pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="relative aspect-[3/4] overflow-hidden bg-white">
            <img
              src={mainStory.image}
              alt={mainStory.title}
              className="h-full w-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col justify-end">
            <div className="mb-8 flex flex-wrap gap-x-4 gap-y-2 text-xs uppercase text-[#111111]/55">
              <span>{mainStory.category}</span>
              <span>{mainStory.year}</span>
            </div>
            <h2 className="font-serif text-3xl font-light uppercase leading-tight md:text-4xl lg:text-5xl">
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
      ) : null}

      <section id="stories-grid" className="mx-auto max-w-[1600px] px-4 pb-24 md:px-8 md:pb-32">
        <div className="mb-8 text-xs uppercase text-[#111111]/45">
          {locale === "en"
            ? `${visibleStories.length} stories`
            : `Історій: ${visibleStories.length}`}
        </div>
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
                    className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.015]"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="mt-5 flex gap-3 text-xs uppercase text-[#111111]/55">
                  <span>{story.category}</span>
                  <span>{story.year}</span>
                </div>
                <h3 className="mt-4 font-serif text-xl font-light uppercase leading-tight md:text-2xl">
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
        {supportingStories.length === 0 && mainStory && (
          <div className="border-t border-[#111111]/10 pt-10 text-sm text-[#111111]/55">
            {locale === "en"
              ? "No more stories match the selected filters."
              : "За обраними фільтрами більше історій немає."}
          </div>
        )}
      </section>
    </div>
  );
}
