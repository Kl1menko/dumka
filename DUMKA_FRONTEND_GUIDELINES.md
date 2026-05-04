# DUMKA Frontend Guidelines

Цей файл фіксує дизайн-напрям, поточний стан реалізації, внутрішню логіку проєкту і список наступних задач. Його варто читати перед змінами в UI або бізнес-логіці, щоб сайт не скочувався у мас-маркетну візуальну мову.

Джерела бренд-контексту:

- Старий сайт: `https://nadiyadumka.com/`
- Shopify-вітрина: `https://j06wf9-vp.myshopify.com/`
- Актуальний сезонний фокус: колекція `Маки`, весна-літо 2026.
- `GRONO` осінь-зима 2025/26 лишається архівною і медійною згадкою.

---

## 1. Архітектура проєкту

### Route groups

```
app/
  layout.tsx                  ← тільки html/body/fonts/OG metadata, без провайдерів
  (storefront)/
    layout.tsx                ← CartProvider + CurrencyProvider + SiteHeader + SiteFooter
    page.tsx                  ← головна /
    shop/                     ← /shop, /shop/[handle]
    stories/                  ← /stories, /stories/[slug]
    delivery/                 ← /delivery
    returns/                  ← /returns
    en/                       ← /en, /en/shop, /en/stories, /en/delivery, /en/returns
  admin/
    login/page.tsx            ← /admin/login (поза protected layout)
    (protected)/
      layout.tsx              ← auth check → redirect /admin/login якщо немає сесії
      page.tsx                ← /admin
      new/page.tsx            ← /admin/new
      [handle]/page.tsx       ← /admin/[handle] (редагування за URL-параметром)
      edit/page.tsx           ← /admin/edit?handle=... (альтернативний entry point)
  api/                        ← route handlers (checkout, search, rates, admin/upload-image)
```

**Чому так:** `(storefront)/layout.tsx` ізолює SiteHeader/CartProvider від адмінки. `admin/(protected)/layout.tsx` ізолює авторизовані admin-сторінки від login. Скобки в назві групи не впливають на URL.

### Джерело даних

Дані товарів — **Supabase** (`lib/data.ts` читає з таблиць `products` і `product_variants`). Shopify залишається тільки як:
- Джерело для первинної міграції (`scripts/migrate.ts`)
- Checkout endpoint через Storefront API (`app/api/checkout/route.ts`)

Shopify JSON endpoint (`products.json`) більше **не використовується** для вітрини.

---

## 2. Що Вже Зроблено

### Візуальний напрям

- Преміальний quiet luxury стиль: білий фон `#FFFFFF`, чорний текст, багато negative space.
- Типографіка: `Cormorant Garamond` для editorial-заголовків, `Inter` для UI/body.
- Товарні картки: luxury ecommerce / Louis Vuitton reference — чиста product tile area, 2-колонкова mobile-сітка.
- На desktop товарні картки мають hover-зміну зображення.
- `object-fit: cover` на product images.

### Головна сторінка

Файл: `app/(storefront)/page.tsx`

- Hero на весь екран із фокусом на колекцію `Маки`, локальний asset `public/images/hero-maky.jpg`.
- Category cards section: horizontal snap slider на mobile (70vw + progress bar), на desktop — flex justify-center з фіксованою шириною карток (360px/420px/480px md/lg/xl) і пропорцією `aspect-[3/5]`. Фото `object-cover`, картки портретні. Фото беруться з CDN nadiyadumka.com — актуальні URL у `content/site.ts` → `categoryImages`.
- Promo video: `public/videos/maky-promo.mp4`, autoplay muted loop, overlay + CTA на `/stories/maky-spring-summer-2026`.
- Statement block, product grid (перші 6 товарів), категорії, lookbook, медіа, showroom.
- Категорійні плитки ведуть на `/shop?category=...`.
- **Scroll reveal**: `ScrollRevealInit` + `[data-reveal]` на 5 секціях (statement, collection, stories, media, showroom) — плавний fade-up через IntersectionObserver.
- **Media section**: реальні лінки на статті. Три плитки з hover:
  - Ukrainian Fashion Week → `http://fashionweek.ua/uk/news/fw25-26-dumka-pokaz/`
  - Harper's Bazaar UA → `https://harpersbazaar.com.ua/fashion/trends/holovni-trendy-sezonu-osin-zyma-202526-z-podiumiv-ukrainian-fashion-week/`
  - CoolBaba → `https://coolbaba.in.ua/kolekcziya-grono-vid-dumka-by-nadiya-dumka-vytonchena-elegantnist-na-ukrainian-fashion-week/`

### PLP / Каталог

Файли: `app/(storefront)/shop/page.tsx`, `app/(storefront)/shop/CatalogClient.tsx`, `lib/catalog.ts`

- Нормалізація `product_type` у локальні категорії з українськими назвами.
- Категорія визначається з `getProductCategory()` — fuzzy-матч по `productType + title + tags`.
- 252 товари мають `product_type` (English slugs: suits, dresses, blouses, evening wears, vests, tops, shorts, other). Matcher в `catalog.ts` обробляє всі ці варіанти.
- Сортування: рекомендоване, ціна від нижчої, ціна від вищої, назва А-Я.
- Desktop: sticky sidebar. Mobile: bottom sheet drawer.
- Loading skeleton, empty state, error state.

### Header / Navigation

Файл: `components/SiteHeader.tsx`

- Fixed header, прозорий на home до скролу, білий на внутрішніх сторінках.
- Drawer: меню, пошук (debounce 280ms → `/api/search`), кошик.
- Перемикач мов UA/EN, перемикач валюти UAH/USD/EUR з курсом НБУ.
- **Не чіпати drawer-меню без окремого запиту.**

### PDP / Product Detail Page

Файли: `app/(storefront)/shop/[handle]/page.tsx`, `app/(storefront)/shop/[handle]/ProductClient.tsx`

- Snap rail фото на mobile, sticky purchase block на desktop. Фото — `<Image fill>` (next/image).
- Size chips, size guide modal, disabled unavailable sizes.
- Accordions: опис, тканина/догляд, доставка/повернення.
- Sticky bottom add-to-cart bar на mobile.
- Add-to-cart → глобальний кошик → відкривається cart drawer.
- **Wishlist button** у хедері sticky block (серце) — зберігає в localStorage.
- **Related products**: спочатку з того ж `product_type`, потім fallback на інші — до 3.
- **Recently viewed**: секція під Related — зберігає до 6 продуктів у localStorage. З'являється після першого переходу між PDP.

### Cart / Checkout

Файли: `components/CartProvider.tsx`, `app/api/checkout/route.ts`

- Cart у `localStorage` (`dumka-cart-v1`). Той самий товар+розмір → збільшується quantity.
- Checkout: `cartCreate` через Shopify Storefront API → редирект на `checkoutUrl`.
- **`variantId` для checkout = `shopify_id` з таблиці `product_variants`** (Shopify GID формату `gid://shopify/ProductVariant/...`). Supabase UUID не передається в Shopify.
- Потрібен реальний `SHOPIFY_STOREFRONT_ACCESS_TOKEN` у `.env.local` для live checkout.

### Currency / Exchange Rates

Файли: `components/CurrencyProvider.tsx`, `app/api/rates/route.ts`

- UAH/USD/EUR. Ціни конвертуються з UAH через офіційний курс НБУ.
- Курс кешується 1 годину. Обрана валюта зберігається в `localStorage`.

### Wishlist

Файл: `lib/wishlist.ts`, `components/WishlistButton.tsx`

- `useWishlist()` hook — зберігає handles у `localStorage` (`dumka-wishlist-v1`).
- `WishlistButton` — серце SVG, filled при активному стані.
- На **ProductCard**: з'являється при hover (absolute top-right).
- На **PDP**: завжди видиме у хедері sticky block.

### Recently Viewed

Файл: `lib/recently-viewed.ts`

- `useRecentlyViewed(current?)` — при відкритті PDP додає поточний продукт на початок, зберігає до 6 у `localStorage` (`dumka-recently-viewed-v1`).
- Зберігає: `{ handle, title, image, price, priceNumber }`.
- Секція на PDP під Related products — 4 колонки, з'являється лише якщо є попередні переглянуті.

### Scroll Animations

Файл: `components/ScrollRevealInit.tsx`

- Client component, монтується на головній сторінці.
- IntersectionObserver (threshold 0.08) спостерігає за `[data-reveal]` елементами.
- При появі у viewport — додає клас `reveal-visible` → CSS transition: `opacity 0.75s + translateY(28px→0)`.
- Секції з `data-reveal`: statement, collection, stories, media, showroom.

### Stories

Файли: `app/(storefront)/stories/`, `content/stories.ts`

- Editorial index: великий lowercase title, category/year filter, feature story, editorial cards.
- Колекції: Маки 2026, GRONO 2025/26, КАЛИНА 2023, Окрилена Україною 2022, весна-літо 2021.
- Detail pages для кожної колекції з hero, текстом, gallery, related.
- EN aliases через `/en/stories/[slug]`.

### Системні сторінки (Доставка / Повернення)

Файли: `app/(storefront)/delivery/page.tsx`, `app/(storefront)/returns/page.tsx`, `/en/delivery`, `/en/returns`

- Обидві сторінки реалізовані для uk і en локалей.
- `/delivery` — доставка по Україні, міжнародна, оплата, умови повернення в резюме, шоурум.
- `/returns` — окрема детальна сторінка з 4 кроками ініціювання повернення.
- Footer і product accordion посилаються на ці сторінки коректно.

### Admin Panel

Файли:

- `app/admin/login/page.tsx` — login form, поза (protected) layout
- `app/admin/(protected)/layout.tsx` — auth check, темний sidebar з навігацією
- `app/admin/(protected)/page.tsx` — список продуктів з пагінацією
- `app/admin/(protected)/new/page.tsx` — форма створення
- `app/admin/(protected)/[handle]/page.tsx` — форма редагування (по URL сегменту)
- `app/admin/(protected)/edit/page.tsx` — форма редагування (по query `?handle=`)
- `app/admin/(protected)/_components/AdminProductList.tsx` — таблиця продуктів
- `app/admin/(protected)/_components/AdminToolbar.tsx` — пошук + фільтри (client, URL params)
- `app/admin/(protected)/_components/ProductForm.tsx` — форма з upload
- `app/admin/(protected)/loading.tsx` — skeleton
- `lib/actions/products.ts` — server actions: create, update, delete, togglePublished, updateSortOrder, bulkSetPublished, bulkDelete, signOut
- `lib/supabase/admin.ts` — service-role client (bypasses RLS)
- `middleware.ts` — захист `/admin/*`

Реалізовано:

- Login через Supabase email+password. Після успіху — `window.location.href = "/admin"`.
- Список: server-side пошук/фільтр, 50 товарів на сторінку, числова пагінація.
- Toolbar: пошук з debounce 350ms, фільтр по типу, фільтр по статусу — URL params.
- **Таблиця з D&D + bulk actions:**
  - Чекбокс per row + select-all у header.
  - Bulk bar: publish / unpublish / delete для вибраних.
  - Кнопка `#`/`D&D` у header переключає режим: числові inputs ↔ drag handles (@dnd-kit/sortable).
  - У D&D режимі перетягування рядків автоматично оновлює `sort_order` (save вручну).
- Форма продукту: title → auto-slug, body HTML, product_type, tags, image URLs (one-per-line з preview), **image upload до Supabase Storage** (drag-and-drop або file picker, до 10MB, bucket `product-images` створюється автоматично), sort_order, published toggle, варіанти.
- "View on site ↗" з форми редагування.

Важливо:

- `createAdminClient()` (service_role) — тільки для CRUD товарів, bypasses RLS.
- `createClient()` з `lib/supabase/server.ts` — для auth перевірок (layout, signOut).
- Ніколи не використовувати admin client для auth операцій.

### SEO / OG

Файл: `app/layout.tsx`

- `metadataBase: new URL('https://nadiyadumka.com')`.
- `openGraph` + `twitter` metadata на рівні root layout з `hero-maky.jpg` як дефолтним preview.
- На PDP — per-product OG title, description та image.

### next/image

Файл: `next.config.mjs`

- `remotePatterns` для всіх CDN: `cdn.shopify.com`, `*.myshopify.com`, `nadiyadumka.com`, `www.nadiyadumka.com`, `*.supabase.co`.
- Компоненти `ProductCard` і `ProductClient` використовують `<Image fill>` + `sizes` prop.
- `unoptimized` prop на окремих зображеннях де потрібно обійти обмеження CDN.

### Технічна база

- Next.js 15, App Router, React 19, Tailwind v4.
- Supabase (PostgreSQL) — джерело даних для вітрини і адмін.
- Shopify Storefront API — тільки checkout.
- Курси НБУ API — конвертація валют.
- `@dnd-kit/core` + `@dnd-kit/sortable` — drag-and-drop в адмінці.

---

## 3. Що Треба Зробити

### Критично (без цього сайт не готовий до продажів)

1. **Shopify Storefront Access Token** — замінити `MY_SHOPIFY_STOREFRONT_ACCESS_TOKEN` у `.env.local` реальним токеном. Без нього checkout повертає помилку. Токен: Shopify Admin → Settings → Apps → Develop apps → вибрати або створити app → Storefront API → `unauthenticated_read_*` scopes.

2. **Перевірити checkout end-to-end** — після додавання реального токена пройти повний шлях: додати у кошик → checkout → Shopify payment. `shopify_id` вже прокинутий через весь стек (DB → types → CartProvider).

### Низький пріоритет (nice to have)

3. **Media links** — є три реальні статті. Якщо з'являться нові публікації — додавати URL у масив в `app/(storefront)/page.tsx` в секції media tiles.

4. **APP_URL у `.env.local`** — замінити `MY_APP_URL` реальним доменом. Наразі не використовується в коді (`metadataBase` хардкодований), але варто оновити для порядку.

5. **Newsletter** — форма показує success-текст після submit, але імейли нікуди не йдуть. Підключити Mailchimp / Resend / іншого провайдера у `SiteFooter.tsx`.

6. **Wishlist сторінка** — зараз вішліст є, але немає окремої `/wishlist` сторінки зі списком. За потреби — додати route що читає `localStorage`.

7. **Recently viewed на інших сторінках** — наразі тільки на PDP. За потреби показувати на `/shop` або головній.

---

## 4. Як Працюють Дані

### Supabase schema

Таблиці: `products`, `product_variants`. Schema: `supabase/schema.sql`.

RLS: анонімні читають тільки `published = true`. Authenticated (admin) мають повний доступ. Service_role bypasses RLS.

### lib/data.ts

Читає з Supabase через `createClient()` (server, anon key + RLS).

- `getProducts()` — повертає `Product[]` (тільки published).
- `getProductsResult()` — повертає `{ products, error }` для сторінок з explicit error state.
- `getProductByHandle(handle)` — один продукт за handle (тільки published).

### Типи

`lib/types.ts` — `Product` і `ProductVariant`. Variant містить: `id`, `shopifyId?`, `title`, `price`, `priceNumber`, `size`, `color`, `available`.

### localStorage keys

| Key | Що зберігає |
|-----|-------------|
| `dumka-cart-v1` | CartItem[] |
| `dumka-wishlist-v1` | string[] (handles) |
| `dumka-recently-viewed-v1` | RecentProduct[] (handle, title, image, price, priceNumber) |
| `dumka-currency` | "UAH" \| "USD" \| "EUR" |

---

## 5. Як Працюють Ключові Компоненти

### SiteHeader (`components/SiteHeader.tsx`)

Client component. State: `drawer` (menu/search/cart/null), `scrolled`. На home до скролу прозорий. Не чіпати drawer стилі без окремого запиту.

### ProductCard (`components/ProductCard.tsx`)

Client component. `images[0]` — cover, `images[1]` — hover. Ціна через `useCurrency().formatPrice()`. При hover — `WishlistButton` (absolute top-right). Використовує `<Image fill>`. CSS: `.product-tile-*` у `globals.css`.

### AdminProductList (`app/admin/(protected)/_components/AdminProductList.tsx`)

Client component. Стан: `localProducts`, `dirtyHandles`, `selected`, `dndMode`, `bulkWorking`. Без virtualizer (252 рядки — норма для DOM). DnDContext обгортає весь список. Кнопка `#`/`D&D` у header переключає режими введення sort_order.

### AdminToolbar (`app/admin/(protected)/_components/AdminToolbar.tsx`)

Client component. Пошук з debounce 350ms → оновлює URL params → server re-render сторінки з filtered Supabase query.

### ScrollRevealInit (`components/ScrollRevealInit.tsx`)

Client component (null render). Монтується в `page.tsx`. IntersectionObserver назначає `.reveal-visible` на `[data-reveal]` елементи.

### useWishlist (`lib/wishlist.ts`)

Client hook. `toggle(handle)` — додає/прибирає. `isWishlisted(handle)` — перевіряє. Ініціалізується після hydration щоб уникнути SSR mismatch.

### useRecentlyViewed (`lib/recently-viewed.ts`)

Client hook. При виклику з `current: RecentProduct` — додає на початок списку і виключає поточний з результату (щоб не показувати сам себе).

---

## 6. CSS / UI Primitives

Файл: `app/globals.css`

- `.luxury-link` — uppercase hover underline
- `.primary-button` — чорна кнопка
- `.ghost-button` — прозора з рамкою
- `.floating-field` — input із floating label
- `.reveal` — fade-up animation (immediate, для hero елементів)
- `[data-reveal]` + `.reveal-visible` — scroll-triggered fade-up (для секцій)
- `.product-tile-*` — товарні плитки
- `.mobile-product-rail` — приховує scrollbar на mobile rail

Правила:

- Базовий фон **тільки `#FFFFFF`**. Молочний фон не повертати.
- Темні секції — тільки editorial/campaign блоки.
- Кнопки — мінімальний radius.
- Жодних sale-плашок, яскравих badges, агресивних CTA.

---

## 7. Команди

```bash
npm install           # встановлення
npm run dev:clean     # dev server (з очищенням .next)
npm run build:clean   # production build перевірка
npm run clean         # очистити .next cache
npm run migrate       # завантажити товари з Shopify у Supabase (безпечно повторювати)
npx tsx scripts/update-product-types.ts  # оновити product_type в БД (за потреби)
```

**Важливо:** не запускати `next build` поки відкритий `next dev` — обидва пишуть у `.next`.

---

## 8. Git / Deploy

```
Remote: https://github.com/Kl1menko/dumka.git
Branch: main
```

```bash
git add .
git commit -m "description"
git push
```

Перед push: `npm run build:clean`.

---

## 9. Правила для Майбутніх Змін

- Не чіпати drawer-меню без окремого запиту.
- Не повертати молочний фон.
- Не робити мас-маркетні sale-плашки або агресивні CTA.
- Product cards — компактні, чисті, mobile-first.
- PDP — фото першочергові.
- Admin — `createAdminClient()` тільки для CRUD, `createClient()` для auth.
- `variantId` у кошику завжди має бути Shopify GID (`gid://shopify/ProductVariant/...`), не Supabase UUID.
- При додаванні нової логіки — оновити цей файл у секціях 2 і 3.
