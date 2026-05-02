import { Locale } from "@/lib/i18n";

export type StoryItem = {
  slug?: string;
  category: string;
  year: string;
  title: string;
  image: string;
  excerpt: string;
  body: readonly string[];
  details?: readonly {
    title: string;
    text: string;
  }[];
  gallery?: readonly string[];
  sourceUrl?: string;
};

type StoriesLocaleContent = {
  title: string;
  signUp: string;
  filters: readonly string[];
  yearsLabel: string;
  readLabel: string;
  sourceLabel: string;
  backLabel: string;
  moreLabel: string;
  years: readonly string[];
  stories: readonly StoryItem[];
};

export const storiesContent = {
  uk: {
    title: "stories",
    signUp: "Sign-Up",
    filters: ["All Stories", "Колекції", "Символ", "Craft"],
    yearsLabel: "All Years",
    readLabel: "Читати історію",
    sourceLabel: "Відкрити колекцію",
    backLabel: "Назад до stories",
    moreLabel: "Інші колекції",
    years: ["2026", "2025", "2023", "2022", "2021"],
    stories: [
      {
        slug: "maky-spring-summer-2026",
        category: "Колекції",
        year: "2026",
        title: "Колекція весна-літо 2026 “МАКИ”",
        image: "https://www.nadiyadumka.com/cdn/shop/files/d_lb_i-42.jpg?v=1775111044",
        excerpt:
          "Колекція про відродження, жіночність і силу, що розквітає навіть після найскладніших сезонів. У центрі — символ маку: пам'ять, краса та ніжна незламність.",
        body: [
          "Це мистецтво, у якому кожен образ несе в собі відлуння серця нації.",
          "Колекція “МАКИ” — це присвята. Не часу. Не трендам. А людям.",
          "Це одяг для жінки, яка пам'ятає. Яка відчуває. Яка несе в собі більше, ніж красу.",
          "У цій колекції мак — не про втрату. Він про життя, яке продовжується. Про любов, що сильніша за тишу. Про пам'ять, яка ніколи не зникає.",
        ],
        details: [
          {
            title: "Пам'ять, що живе в кожній деталі",
            text: "Силуети — стримані, вивірені, глибокі. Піджаки, корсети, сукні, спідниці та блузи створені так, щоб підкреслити внутрішню силу жінки — її витримку, гідність і світло, яке не згасає навіть у темряві.",
          },
          {
            title: "Символ маку",
            text: "Ключовий елемент колекції — мак. Не як декоративний мотив, а як жива пам'ять. Кожен пелюсток, створений вручну — це історія.",
          },
          {
            title: "Аксесуари як продовження сенсу",
            text: "Коміри, баски, пояси й декоративні елементи обрамлюють образ, як рамка оберігає картину — тихо, але з глибоким значенням.",
          },
          {
            title: "Тканини, що тримають емоцію",
            text: "Оксамит, органза, сатин, мереживо і структуровані костюмні тканини формують не лише силует, а й відчуття.",
          },
        ],
        gallery: [
          "https://www.nadiyadumka.com/cdn/shop/files/d_lb_i-42.jpg?v=1775111044",
          "https://cdn.shopify.com/s/files/1/0761/0128/8093/files/d_lb_i-132.jpg?v=1776528884",
          "https://cdn.shopify.com/s/files/1/0761/0128/8093/files/8894BFF2-9092-44EF-8B8D-CEBFCE127414.jpg?v=1776547996",
        ],
      },
      {
        slug: "grono-autumn-winter-2025-26",
        category: "Колекції",
        year: "2025",
        title: "Колекція осінь-зима 2025/26 “GRONO”",
        image: "https://www.nadiyadumka.com/cdn/shop/files/dumka-fall-winter_2025.jpg?v=1774473552",
        excerpt:
          "Колекція «Grono» — це історія про класику, елегантність та вишукану красу, здатну розкрити внутрішню силу та благородство кожної жінки. Це не просто одяг, а мистецтво створення образу.",
        body: [
          "Силуетні піджаки, сукні, спідниці та блузи створені для стриманої розкоші, гармонії форм і тонкого відчуття стилю.",
          "Ключовий елемент колекції — виноградне гроно як символ єдності, родинних зв'язків і життєвої енергії.",
          "Оксамит, кашемір і сатин додають виробам шляхетності, комфорту та відчуття культурної тяглості.",
        ],
        details: [
          {
            title: "Елегантність і аристократизм",
            text: "Силуетні піджаки, сукні, спідниці та блузи створені для жінок, які цінують стриману розкіш, гармонію форм і тонке відчуття стилю.",
          },
          {
            title: "Символ виноградного грона",
            text: "Сакральний орнамент переносить українську спадщину в контекст сучасної моди, додаючи кожному виробу глибокого змісту.",
          },
          {
            title: "Розкішні тканини",
            text: "Преміальні матеріали — оксамит, кашемір і сатин — працюють на шляхетність, комфорт і м'яку силу образу.",
          },
        ],
        gallery: [
          "https://www.nadiyadumka.com/cdn/shop/files/dumka-fall-winter_2025.jpg?v=1774473552",
        ],
        sourceUrl: "https://nadiyadumka.com/kolektsiia-osin-zyma-2025-26-grono/",
      },
      {
        category: "Craft",
        year: "2026",
        title: "Пам'ять, що живе в кожній деталі",
        image: "https://cdn.shopify.com/s/files/1/0761/0128/8093/files/d_lb_i-132.jpg?v=1776528884",
        excerpt:
          "Силуети — стримані, вивірені, глибокі. Піджаки, корсети, сукні, спідниці та блузи підкреслюють внутрішню силу жінки.",
        body: [
          "Кожен образ створений, щоб говорити про витримку, гідність і світло, яке не згасає навіть у темряві.",
        ],
      },
      {
        category: "Символ",
        year: "2026",
        title: "Мак як знак шани й незламності",
        image: "https://cdn.shopify.com/s/files/1/0761/0128/8093/files/8894BFF2-9092-44EF-8B8D-CEBFCE127414.jpg?v=1776547996",
        excerpt:
          "Ключовий елемент колекції — мак. Не як декоративний мотив, а як жива пам'ять.",
        body: [
          "Кожен пелюсток, створений вручну — це історія. Авторський принт — це дотик до тих, кого вже немає, але чия присутність назавжди залишилась у нас.",
        ],
      },
      {
        category: "Матеріали",
        year: "2026",
        title: "Тканини, що тримають емоцію",
        image: "https://cdn.shopify.com/s/files/1/0761/0128/8093/files/C5DBD9FF-F84E-4B59-BC15-7E2187C9744D.jpg?v=1776463365",
        excerpt:
          "Оксамит, органза, сатин, мереживо і структуровані костюмні тканини формують не лише силует, а й відчуття.",
        body: [
          "Вони передають глибину, м'якість і водночас силу — як саме життя.",
          "Коміри, баски, пояси й декоративні елементи стають символами, які обрамлюють образ, як рамка оберігає картину.",
        ],
      },
      {
        slug: "kalyna-spring-summer-2023",
        category: "Колекції",
        year: "2023",
        title: "Колекція весна-літо 2023 “КАЛИНА”",
        image: "https://www.nadiyadumka.com/cdn/shop/files/dumka-spring-summer-2023.jpg?v=1774472844",
        excerpt:
          "Вражає глибокою символікою та естетичною майстерністю. Калина символізує життєву силу, єдність та непереможність — і уособлює стійкість жінок, які підтримують одна одну.",
        body: [
          "Колекція поєднує символізм української культури з вишуканими тканинами та авторським принтом.",
          "Кожен образ передає жіночність, силу й пам'ять про тих, хто віддав життя за незалежність України.",
        ],
        details: [
          {
            title: "Калина як оберіг",
            text: "Калина в українській культурі є символом життєвої сили, єдності та незламності, а в колекції вона уособлює жіночу підтримку й стійкість.",
          },
          {
            title: "Авторська вишивка",
            text: "Кожен елемент є не лише декоративним, а й потужним знаком пам'яті, краси, жіночності та сили.",
          },
        ],
        gallery: [
          "https://www.nadiyadumka.com/cdn/shop/files/dumka-spring-summer-2023.jpg?v=1774472844",
        ],
        sourceUrl: "https://nadiyadumka.com/kolekcziya-vesna-lito-2023-kalyna/",
      },
      {
        slug: "okrylena-ukrainoyu-spring-summer-2022",
        category: "Колекції",
        year: "2022",
        title: "Колекція весна-літо 2022 “Окрилена Україною”",
        image: "https://www.nadiyadumka.com/cdn/shop/files/dumka-spring-summer-2022.webp?v=1774472628",
        excerpt:
          "Відображає дух українського народу, любов до рідної землі та незламну віру в перемогу. Кожен елемент — символ натхненної любові до України.",
        body: [
          "У кожному образі присутні крила — символи віри, свободи та сили рухатися вперед.",
          "Патріотичні кольори й енергія колекції говорять про надію, гідність і спільну мету.",
        ],
        details: [
          {
            title: "Окрилена любов до України",
            text: "Колекція відображає глибоку прив'язаність до рідної землі та нескорену віру в перемогу.",
          },
          {
            title: "Крила як символ свободи",
            text: "Крила підносять до високих ідеалів і нагадують про силу боротьби за незалежність та цілісність держави.",
          },
        ],
        gallery: [
          "https://www.nadiyadumka.com/cdn/shop/files/dumka-spring-summer-2022.webp?v=1774472628",
        ],
        sourceUrl: "https://nadiyadumka.com/kolekcziya-vesna-lito-2022-okrylena-ukrayinoyu/",
      },
      {
        slug: "spring-summer-2021",
        category: "Колекції",
        year: "2021",
        title: "Колекція весна-літо 2021",
        image: "https://www.nadiyadumka.com/cdn/shop/files/dumka-spring-summer-2021.jpg?v=1774472275",
        excerpt:
          "Аристократична весняно-літня колекція, присвячена 150-річчю Лесі Українки.",
        body: [
          "Колекція звертається до спадщини видатної української поетеси та працює з образом гідної, освіченої, внутрішньо сильної жінки.",
          "Лінія продовжує мову бренду: стримана розкіш, українська культурна пам'ять і точна силуетність.",
        ],
        details: [
          {
            title: "Присвята Лесі Українці",
            text: "Колекція присвячена 150-річчю Лесі Українки та звертається до її творчої сили, інтелектуальної свободи й аристократичної гідності.",
          },
          {
            title: "Стримана розкіш",
            text: "Образи продовжують мову бренду через чисті силуети, культурну пам'ять і відчуття внутрішньої опори.",
          },
        ],
        gallery: [
          "https://www.nadiyadumka.com/cdn/shop/files/dumka-spring-summer-2021.jpg?v=1774472275",
        ],
        sourceUrl: "https://nadiyadumka.com/kolekcziya-vesna-lito-2021/",
      },
    ],
  },
  en: {
    title: "stories",
    signUp: "Sign-Up",
    filters: ["All Stories", "Collections", "Symbol", "Craft"],
    yearsLabel: "All Years",
    readLabel: "Read story",
    sourceLabel: "Open collection",
    backLabel: "Back to stories",
    moreLabel: "More collections",
    years: ["2026", "2025", "2023", "2022", "2021"],
    stories: [
      {
        slug: "maky-spring-summer-2026",
        category: "Collections",
        year: "2026",
        title: "Spring-Summer 2026 Collection “MAKY”",
        image: "https://www.nadiyadumka.com/cdn/shop/files/d_lb_i-42.jpg?v=1775111044",
        excerpt:
          "The Maky collection is a story of memory, strength, and love without an end. It is not simply clothing, but a form of silence that speaks louder than words.",
        body: [
          "It is art in which every look carries the echo of a nation's heart.",
          "The Maky collection is a dedication. Not to time. Not to trends. To people.",
          "It is clothing for a woman who remembers. Who feels. Who carries more than beauty.",
          "In this collection, the poppy is not about loss. It is about life continuing, love stronger than silence, and memory that never disappears.",
        ],
        details: [
          {
            title: "Memory Living In Every Detail",
            text: "Restrained, precise, and deep silhouettes. Jackets, corsets, dresses, skirts, and blouses are created to emphasize a woman's inner strength, endurance, dignity, and light.",
          },
          {
            title: "The Poppy Symbol",
            text: "The key element of the collection is the poppy. Not as decoration, but as living memory. Each handmade petal is a story.",
          },
          {
            title: "Accessories With Meaning",
            text: "Collars, basques, belts, and decorative elements frame the look like a frame protects a painting — quietly, but with deep meaning.",
          },
          {
            title: "Fabrics That Hold Emotion",
            text: "Velvet, organza, satin, lace, and structured suiting fabrics form not only a silhouette, but a feeling.",
          },
        ],
        gallery: [
          "https://www.nadiyadumka.com/cdn/shop/files/d_lb_i-42.jpg?v=1775111044",
          "https://cdn.shopify.com/s/files/1/0761/0128/8093/files/d_lb_i-132.jpg?v=1776528884",
          "https://cdn.shopify.com/s/files/1/0761/0128/8093/files/8894BFF2-9092-44EF-8B8D-CEBFCE127414.jpg?v=1776547996",
        ],
      },
      {
        slug: "grono-autumn-winter-2025-26",
        category: "Collections",
        year: "2025",
        title: "Autumn-Winter 2025/26 Collection “GRONO”",
        image: "https://www.nadiyadumka.com/cdn/shop/files/dumka-fall-winter_2025.jpg?v=1774473552",
        excerpt:
          "A story of classic elegance and refined beauty, revealing the inner strength and nobility of a woman.",
        body: [
          "Tailored jackets, dresses, skirts, and blouses are shaped around restrained luxury, balanced form, and a precise sense of style.",
          "The grape cluster becomes a symbol of unity, family bonds, and vital energy.",
          "Velvet, cashmere, and satin bring nobility, comfort, and cultural continuity to the collection.",
        ],
        details: [
          {
            title: "Elegance And Aristocracy",
            text: "Tailored jackets, dresses, skirts, and blouses are created for women who value restrained luxury, harmony of form, and a refined sense of style.",
          },
          {
            title: "The Grape Cluster Symbol",
            text: "This sacred ornament brings Ukrainian heritage into the context of contemporary fashion and gives each piece deeper meaning.",
          },
          {
            title: "Luxurious Fabrics",
            text: "Premium velvet, cashmere, and satin bring nobility, comfort, and quiet strength to the look.",
          },
        ],
        gallery: [
          "https://www.nadiyadumka.com/cdn/shop/files/dumka-fall-winter_2025.jpg?v=1774473552",
        ],
        sourceUrl: "https://nadiyadumka.com/kolektsiia-osin-zyma-2025-26-grono/",
      },
      {
        category: "Craft",
        year: "2026",
        title: "Memory Living In Every Detail",
        image: "https://cdn.shopify.com/s/files/1/0761/0128/8093/files/d_lb_i-132.jpg?v=1776528884",
        excerpt:
          "Restrained, precise, and deep silhouettes. Jackets, corsets, dresses, skirts, and blouses emphasize inner strength.",
        body: [
          "Each look is shaped around endurance, dignity, and a light that does not fade even in darkness.",
        ],
      },
      {
        category: "Symbol",
        year: "2026",
        title: "The Poppy As Honor And Resilience",
        image: "https://cdn.shopify.com/s/files/1/0761/0128/8093/files/8894BFF2-9092-44EF-8B8D-CEBFCE127414.jpg?v=1776547996",
        excerpt:
          "The key element of the collection is the poppy, not as decoration, but as living memory.",
        body: [
          "Each handmade petal is a story. The signature print is a touch to those who are no longer here, but whose presence remains with us forever.",
        ],
      },
      {
        category: "Materials",
        year: "2026",
        title: "Fabrics That Hold Emotion",
        image: "https://cdn.shopify.com/s/files/1/0761/0128/8093/files/C5DBD9FF-F84E-4B59-BC15-7E2187C9744D.jpg?v=1776463365",
        excerpt:
          "Velvet, organza, satin, lace, and structured suiting fabrics form not only a silhouette, but a feeling.",
        body: [
          "They carry depth, softness, and strength at once, like life itself.",
          "Collars, basques, belts, and decorative elements become symbols that frame the look like a frame protects a painting.",
        ],
      },
      {
        slug: "kalyna-spring-summer-2023",
        category: "Collections",
        year: "2023",
        title: "Spring-Summer 2023 Collection “KALYNA”",
        image: "https://www.nadiyadumka.com/cdn/shop/files/dumka-spring-summer-2023.jpg?v=1774472844",
        excerpt:
          "Kalyna appears as a symbol of life force, unity, and resilience, while signature embroidery works like a protective ornament.",
        body: [
          "The collection connects Ukrainian cultural symbolism with refined fabrics and a signature print.",
          "Each look carries femininity, strength, and remembrance for those who gave their lives for Ukraine's independence.",
        ],
        details: [
          {
            title: "Kalyna As A Talisman",
            text: "In Ukrainian culture, kalyna symbolizes life force, unity, and resilience. In the collection, it embodies feminine support and endurance.",
          },
          {
            title: "Signature Embroidery",
            text: "Each element is not merely decorative, but a powerful sign of memory, beauty, femininity, and strength.",
          },
        ],
        gallery: [
          "https://www.nadiyadumka.com/cdn/shop/files/dumka-spring-summer-2023.jpg?v=1774472844",
        ],
        sourceUrl: "https://nadiyadumka.com/kolekcziya-vesna-lito-2023-kalyna/",
      },
      {
        slug: "okrylena-ukrainoyu-spring-summer-2022",
        category: "Collections",
        year: "2022",
        title: "Spring-Summer 2022 Collection “Inspired By Ukraine”",
        image: "https://www.nadiyadumka.com/cdn/shop/files/dumka-spring-summer-2022.webp?v=1774472628",
        excerpt:
          "A collection about the spirit of the Ukrainian people, love for native land, and unbroken faith in victory.",
        body: [
          "Wings appear throughout the looks as symbols of faith, freedom, and the strength to keep moving forward.",
          "Patriotic colors and emotional energy speak about hope, dignity, and a shared purpose.",
        ],
        details: [
          {
            title: "Inspired By Love For Ukraine",
            text: "The collection reflects deep attachment to native land and unbroken faith in victory.",
          },
          {
            title: "Wings As Freedom",
            text: "Wings lift the looks toward high ideals and speak of the strength to fight for independence and integrity.",
          },
        ],
        gallery: [
          "https://www.nadiyadumka.com/cdn/shop/files/dumka-spring-summer-2022.webp?v=1774472628",
        ],
        sourceUrl: "https://nadiyadumka.com/kolekcziya-vesna-lito-2022-okrylena-ukrayinoyu/",
      },
      {
        slug: "spring-summer-2021",
        category: "Collections",
        year: "2021",
        title: "Spring-Summer 2021 Collection",
        image: "https://www.nadiyadumka.com/cdn/shop/files/dumka-spring-summer-2021.jpg?v=1774472275",
        excerpt:
          "An aristocratic spring-summer collection dedicated to the 150th anniversary of Lesya Ukrainka.",
        body: [
          "The collection turns to the legacy of the Ukrainian poet and the image of a dignified, educated, inwardly strong woman.",
          "It continues the brand language of restrained luxury, Ukrainian cultural memory, and precise silhouette.",
        ],
        details: [
          {
            title: "A Dedication To Lesya Ukrainka",
            text: "The collection is dedicated to the 150th anniversary of Lesya Ukrainka and turns to her creative force, intellectual freedom, and aristocratic dignity.",
          },
          {
            title: "Restrained Luxury",
            text: "The looks continue the brand language through clean silhouettes, cultural memory, and a sense of inner composure.",
          },
        ],
        gallery: [
          "https://www.nadiyadumka.com/cdn/shop/files/dumka-spring-summer-2021.jpg?v=1774472275",
        ],
        sourceUrl: "https://nadiyadumka.com/kolekcziya-vesna-lito-2021/",
      },
    ],
  },
} as const satisfies Record<Locale, StoriesLocaleContent>;

function hasStorySlug(story: StoryItem): story is StoryItem & { slug: string } {
  return typeof story.slug === "string";
}

export function getStoriesContent(locale: Locale) {
  return storiesContent[locale];
}

export function getStoryBySlug(locale: Locale, slug: string): StoryItem | undefined {
  const stories = storiesContent[locale].stories as readonly StoryItem[];

  return stories.filter(hasStorySlug).find((story) => story.slug === slug);
}

export function getStorySlugs(locale: Locale): string[] {
  const stories = storiesContent[locale].stories as readonly StoryItem[];

  return stories.filter(hasStorySlug).map((story) => story.slug);
}

export function getCollectionStories(locale: Locale): (StoryItem & { slug: string })[] {
  const collectionCategory = locale === "uk" ? "Колекції" : "Collections";
  const stories = storiesContent[locale].stories as readonly StoryItem[];

  return stories
    .filter(hasStorySlug)
    .filter((story) => story.category === collectionCategory);
}
