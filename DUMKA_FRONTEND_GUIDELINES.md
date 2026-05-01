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
  layout.tsx                  ← тільки html/body/fonts, без провайдерів
  (storefront)/
    layout.tsx                ← CartProvider + CurrencyProvider + SiteHeader + SiteFooter
    page.tsx                  ← головна /
    shop/                     ← /shop, /shop/[handle]
    stories/                  ← /stories, /stories/[slug]
    en/                       ← /en, /en/shop, /en/stories
  admin/
    login/page.tsx            ← /admin/login (поза protected layout)
    (protected)/
      layout.tsx              ← auth check → redirect /admin/login якщо немає сесії
      page.tsx                ← /admin
      new/page.tsx            ← /admin/new
      [handle]/page.tsx       ← /admin/[handle]
  api/                        ← route handlers (checkout, search, rates)
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
- `object-fit: contain` на product images — виріб вміщається повністю без crop.

### Головна сторінка

Файл: `app/(storefront)/page.tsx`

- Hero на весь екран із фокусом на колекцію `Маки`, локальний asset `public/images/hero-maky.jpg`.
- Category cards section: horizontal snap slider на mobile (84vw + progress bar), 3-column grid на desktop.
- Promo video: `public/videos/maky-promo.mp4`, autoplay muted loop, overlay + CTA на `/stories/maky-spring-summer-2026`.
- Statement block, product grid (перші 6 товарів), категорії, lookbook, медіа, showroom.
- Категорійні плитки ведуть на `/shop?category=...`.

### PLP / Каталог

Файли: `app/(storefront)/shop/page.tsx`, `app/(storefront)/shop/CatalogClient.tsx`, `lib/catalog.ts`

- Нормалізація `product_type` у локальні категорії з українськими назвами.
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

- Snap rail фото на mobile, sticky purchase block на desktop.
- Size chips, size guide modal, disabled unavailable sizes.
- Accordions: опис, тканина/догляд, доставка/повернення.
- Sticky bottom add-to-cart bar на mobile.
- Add-to-cart → глобальний кошик → відкривається cart drawer.
- Related products block (перші 3 інші).

### Cart / Checkout

Файли: `components/CartProvider.tsx`, `app/api/checkout/route.ts`

- Cart у `localStorage` (`dumka-cart-v1`). Той самий товар+розмір → збільшується quantity.
- Checkout: `cartCreate` через Shopify Storefront API → редирект на `checkoutUrl`.
- Потрібен реальний `SHOPIFY_STOREFRONT_ACCESS_TOKEN` у `.env.local` для live checkout.

### Currency / Exchange Rates

Файли: `components/CurrencyProvider.tsx`, `app/api/rates/route.ts`

- UAH/USD/EUR. Ціни конвертуються з UAH через офіційний курс НБУ.
- Курс кешується 1 годину. Обрана валюта зберігається в `localStorage`.

### Stories

Файли: `app/(storefront)/stories/`, `content/stories.ts`

- Editorial index: великий lowercase title, category/year filter, feature story, editorial cards.
- Колекції: Маки 2026, GRONO 2025/26, КАЛИНА 2023, Окрилена Україною 2022, весна-літо 2021.
- Detail pages для кожної колекції з hero, текстом, gallery, related.
- EN aliases через `/en/stories/[slug]`.

### Admin Panel

Файли:

- `app/admin/login/page.tsx` — login form, поза (protected) layout
- `app/admin/(protected)/layout.tsx` — auth check, темний sidebar з навігацією
- `app/admin/(protected)/page.tsx` — список продуктів з пагінацією
- `app/admin/(protected)/new/page.tsx` — форма створення
- `app/admin/(protected)/[handle]/page.tsx` — форма редагування
- `app/admin/(protected)/_components/AdminProductList.tsx` — таблиця продуктів
- `app/admin/(protected)/_components/AdminToolbar.tsx` — пошук + фільтри (client, URL params)
- `app/admin/(protected)/loading.tsx` — skeleton
- `lib/actions/products.ts` — server actions: create, update, delete, togglePublished, updateSortOrder, signOut
- `lib/supabase/admin.ts` — service-role client (bypasses RLS)
- `middleware.ts` — захист `/admin/*`

Реалізовано:

- Login через Supabase email+password. Після успіху — `window.location.href = "/admin"` (full reload для session cookie).
- Список: server-side пошук/фільтр (Supabase `.ilike`/`.eq`), 50 товарів на сторінку, числова пагінація.
- Toolbar: пошук з debounce 350ms, фільтр по типу, фільтр по статусу — всі через URL params (`?q=&type=&status=&page=`).
- Таблиця: sort_order inline input (бейдж жовтіє при зміні, з'являється Save order banner), toggle published, Edit лінк, Delete з confirm.
- Форма продукту: title → auto-slug, body HTML, product_type, tags, image URLs (one-per-line з preview), sort_order, published toggle, варіанти (size / color / price_uah / available).
- "View on site ↗" з форми редагування.
- Після збереження — `window.location.href = "/admin"` (навігація через full reload).
- signOut використовує session-based `createClient()`, не admin client.

Важливо:

- `createAdminClient()` (service_role) — тільки для CRUD товарів, bypasses RLS.
- `createClient()` з `lib/supabase/server.ts` — для auth перевірок (layout, signOut).
- Ніколи не використовувати admin client для auth операцій.

### Технічна база

- Next.js 15, App Router, React 19, Tailwind v4.
- Supabase (PostgreSQL) — джерело даних для вітрини і адмін.
- Shopify Storefront API — тільки checkout.
- Курси НБУ API — конвертація валют.

---

## 3. Що Треба Зробити

### Критично (без цього сайт не готовий до продажів)

1. **Shopify Storefront Access Token** — замінити `MY_SHOPIFY_STOREFRONT_ACCESS_TOKEN` у `.env.local` реальним токеном. Без нього checkout повертає помилку. Токен: Shopify Admin → Settings → Apps → Develop apps → вибрати або створити app → Storefront API → `unauthenticated_read_*` scopes.

2. **product_type для 252 товарів** — після міграції з Shopify усі `product_type` порожні. Потрібно або масово проставити через SQL в Supabase, або через адмінку вручну. Без цього фільтри у каталозі `/shop?category=...` не працюють коректно.

### Важливо (функціонал магазину)

3. **Системні сторінки** — delivery, returns, contacts/showroom, media. Зараз footer посилається на них, але сторінок немає (404).

4. **Image upload в адмінці** — зараз треба вставляти URL вручну. Краще додати upload до Supabase Storage або Cloudinary, щоб адмін міг завантажувати фото напряму.

5. **Перевірити checkout end-to-end** — після додавання реального токена пройти повний шлях: додати у кошик → checkout → Shopify payment.

### Середній пріоритет (покращення UX)

6. **Drag-and-drop сортування в адмінці** — зараз sort_order редагується числами. Drag-and-drop через `@dnd-kit/core` або `react-beautiful-dnd` був би зручнішим для переупорядкування 252 товарів.

7. **Bulk actions в адмінці** — чекбокси для вибору кількох товарів → bulk publish/unpublish/delete. Зараз тільки поодинці.

8. **Related products за логікою** — зараз перші 3 інші товари. Краще показувати товари з того ж `product_type`.

9. **APP_URL у `.env.local`** — замінити `MY_APP_URL` реальним доменом (потрібно для Open Graph метаданих).

### Низький пріоритет (nice to have)

10. **Wishlist** — зберігати в `localStorage`, кнопка на product card і PDP.

11. **Recently viewed** — останні 6 переглянутих товарів у блоці на PDP або в окремій сторінці.

12. **Scroll animations** — fade-up reveal на секціях головної. CSS-based через `IntersectionObserver` або Framer Motion.

13. **next/image оптимізація** — додати Shopify CDN домени в `next.config.mjs` → `remotePatterns`, перейти з `<img>` на `<Image>`.

14. **Media links** — реальні посилання на статті в Stories і footer.

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

`lib/types.ts` — `Product` і `ProductVariant`. Variant містить: `id`, `title`, `price`, `priceNumber`, `size`, `color`, `available`.

---

## 5. Як Працюють Ключові Компоненти

### SiteHeader (`components/SiteHeader.tsx`)

Client component. State: `drawer` (menu/search/cart/null), `scrolled`. На home до скролу прозорий. Не чіпати drawer стилі без окремого запиту.

### ProductCard (`components/ProductCard.tsx`)

Client component. `images[0]` — cover, `images[1]` — hover. Ціна через `useCurrency().formatPrice()`. CSS: `.product-tile-*` у `globals.css`.

### AdminToolbar (`app/admin/(protected)/_components/AdminToolbar.tsx`)

Client component. Пошук з debounce 350ms → оновлює URL params → server re-render сторінки з filtered Supabase query.

---

## 6. CSS / UI Primitives

Файл: `app/globals.css`

- `.luxury-link` — uppercase hover underline
- `.primary-button` — чорна кнопка
- `.ghost-button` — прозора з рамкою
- `.floating-field` — input із floating label
- `.reveal` — fade-up animation
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
npm install          # встановлення
npm run dev:clean    # dev server (з очищенням .next)
npm run build:clean  # production build перевірка
npm run clean        # очистити .next cache
npm run migrate      # завантажити товари з Shopify у Supabase (безпечно повторювати)
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
- При додаванні нової логіки — оновити цей файл у секціях 2 і 3.
