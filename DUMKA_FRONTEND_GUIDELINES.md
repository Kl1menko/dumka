# DUMKA Frontend Guidelines

Цей файл фіксує дизайн-напрям, поточний стан реалізації, внутрішню логіку проєкту і список наступних задач. Його варто читати перед змінами в UI або бізнес-логіці, щоб сайт не скочувався у мас-маркетну візуальну мову.

Джерела бренд-контексту:

- Старий сайт: `https://nadiyadumka.com/`
- Shopify-вітрина: `https://j06wf9-vp.myshopify.com/`
- Актуальний сезонний фокус на 2026-04-18: колекція `Маки`, весна-літо 2026.
- `GRONO` осінь-зима 2025/26 лишається архівною і медійною згадкою.

## 1. Що Вже Зроблено

### Візуальний напрям

- Задано преміальний quiet luxury стиль: чистий білий фон, чорний текст, багато negative space.
- Основний фон усіх сторінок переведено на чистий білий `#FFFFFF`.
- Відмовились від молочного/перлинного фону як базового кольору сторінок.
- Типографіка побудована на парі `Cormorant Garamond` для editorial-заголовків і `Inter` для UI/body.
- Товарні картки перероблені за логікою luxury ecommerce / Louis Vuitton reference: чиста product tile area, компактна назва, ціна, 2-колонкова mobile-сітка.
- На desktop товарні картки мають hover-зміну зображення.
- Product images у картках мають вміщатися повністю через `object-fit: contain`, без crop.

### Головна сторінка

Файл: `app/page.tsx`

Реалізовано:

- Hero на весь екран із фокусом на колекцію `Маки`.
- Hero image береться з локального asset `public/images/hero-maky.jpg`.
- На desktop hero image використовує `object-contain`, щоб модель не обрізалась; секція лишається `h-dvh`.
- Hero section background має бути `bg-white`, щоб поля від `object-contain` не виглядали сірими.
- Category cards section стоїть між hero і promo video: великі image cards у стилі fashion campaign grid, текст і CTA поверх фото по центру знизу. На mobile це horizontal snap slider із картками `84vw` і тонким progress bar під слайдером; на desktop — 3-column grid.
- Promo video section під hero використовує локальний asset `public/videos/maky-promo.mp4`, autoplay muted loop playsInline, темний overlay і CTA на `/stories/maky-spring-summer-2026`.
- Statement block про колекцію.
- Блок `Весна - літо 2026` із продуктами з Shopify.
- Асиметричні категорії: сукні, костюми, вечірній одяг.
- Темна campaign/lookbook секція.
- У campaign/lookbook секції фото використовує `object-contain` на білому фоні, щоб образ не обрізався.
- Блок медіа.
- Showroom block з адресою: вул. Шпитальна, 1, Львів, ТЦ "Магнус", 3-й поверх.
- Категорійні плитки ведуть на `/shop` із відповідним query-фільтром.

### PLP / Каталог

Файли:

- `app/shop/page.tsx`
- `app/shop/CatalogClient.tsx`
- `app/shop/loading.tsx`
- `lib/catalog.ts`

Реалізовано:

- Повноцінна сторінка `/shop`.
- Product grid на базі існуючого `ProductCard`.
- Категорії каталогу з українськими назвами і counts.
- Нормалізація Shopify `product_type` у локальні категорії: сукні, костюми, блузи, вечірній одяг, жилети, топи, шорти, комбінезони, аксесуари, подарунки, інше.
- Сортування: рекомендоване, ціна від нижчої, ціна від вищої, назва А-Я.
- Query params для стану каталогу: `category` і `sort`.
- Desktop: sticky sidebar з категоріями і select сортування.
- Mobile: bottom sheet drawer для категорій і сортування.
- Empty state для категорій без товарів.
- Loading skeleton для `/shop`.
- Error state, якщо Shopify endpoint недоступний.

### Header / Navigation

Файл: `components/SiteHeader.tsx`

Реалізовано:

- Fixed header.
- На головній сторінці до скролу хедер прозорий поверх hero.
- Після скролу хедер стає білим із чорним текстом.
- На внутрішніх сторінках хедер одразу білий із чорним текстом, щоб не губитися на світлих product-фото.
- Drawer-меню, search drawer і cart drawer.
- Header cart count синхронізується з реальним cart state.
- Category links у drawer ведуть на реальний `/shop?category=...`.
- Search drawer виконує реальний пошук через `/api/search` із debounce.
- Header визначає locale з pathname (`/en...`) і перемикає UA/EN route.
- У desktop header біля мов є компактна іконка вибору валюти (`₴`, `$`, `€`) з popover.
- Внутрішній дизайн меню та списків зараз виглядає добре. Не змінювати без окремого запиту.

### PDP / Product Detail Page

Файли:

- `app/shop/[handle]/page.tsx`
- `app/shop/[handle]/ProductClient.tsx`
- `app/shop/[handle]/loading.tsx`
- `app/shop/[handle]/error.tsx`

Реалізовано:

- Dynamic route `/shop/[handle]`.
- SEO metadata для PDP формується з product title/body/images.
- Великі product-фото.
- На мобільному: горизонтальний snap rail для фото.
- На desktop: sticky purchase block справа.
- Size selector через клікабельні chips, не через select.
- Size guide modal із таблицею XS-XL і showroom note.
- Unavailable sizes disabled і показують статус “Немає в наявності”.
- Accordions для опису, тканини/догляду, доставки/повернення.
- Sticky bottom add-to-cart bar на мобільному.
- Add-to-cart додає товар з обраним розміром у глобальний кошик і відкриває cart drawer.
- `Complete the look` / related products block.
- Loading skeleton для PDP.
- Error boundary для PDP, якщо Shopify endpoint недоступний.

### Cart state

Файл: `components/CartProvider.tsx`

Checkout route: `app/api/checkout/route.ts`

Реалізовано:

- Глобальний client provider навколо header, main і footer.
- Збереження cart items у `localStorage` через ключ `dumka-cart-v1`.
- Cart item містить `variantId`, `handle`, `title`, `image`, `size`, `price`, `priceNumber`, `quantity`.
- Якщо додати той самий товар з тим самим розміром, збільшується `quantity`.
- Header показує реальний total item count.
- Cart drawer показує товари, кількість, subtotal і дозволяє збільшувати/зменшувати quantity або прибирати товар.
- Checkout button викликає `/api/checkout`, створює Shopify Cart через Storefront API `cartCreate` і редіректить на `checkoutUrl`.
- Для checkout потрібні env vars: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `SHOPIFY_STOREFRONT_API_VERSION`.

### Currency / Exchange Rates

Файли:

- `components/CurrencyProvider.tsx`
- `lib/currency.ts`
- `app/api/rates/route.ts`

Реалізовано:

- Глобальний currency provider навколо cart/header/main/footer.
- Валюти: `UAH`, `USD`, `EUR`.
- Ціни з Shopify лишаються базово в гривні через `priceNumber`.
- Для display ціна конвертується з UAH у USD/EUR через офіційний курс НБУ.
- `/api/rates` бере USD/EUR з `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=...&json`.
- Курс кешується на 1 годину.
- У menu drawer є перемикач валюти і дата курсу НБУ.
- Обрана валюта зберігається в `localStorage` ключем `dumka-currency-v1`.
- Desktop currency selector доступний у header біля перемикача мов; повний selector також є в menu drawer.
- Checkout не використовує display currency: Shopify checkout рахує оплату за variant IDs і quantity.

### Content / Localization

Файл: `content/site.ts`

Реалізовано:

- Основний UI copy винесений у content config для `uk` і `en`.
- Home page, catalog page, PDP labels/accordions/size guide і footer беруть тексти з `content/site.ts`.
- `/en`, `/en/shop`, `/en/shop/[handle]` передають `locale="en"` у відповідні компоненти.
- Product titles/descriptions поки беруться з Shopify як є.

### Stories

Файли:

- `app/stories/page.tsx`
- `app/en/stories/page.tsx`
- `app/stories/[slug]/page.tsx`
- `app/en/stories/[slug]/page.tsx`
- `components/StoriesPageContent.tsx`
- `components/StoryDetailPageContent.tsx`
- `content/stories.ts`

Реалізовано:

- Editorial Stories сторінка у форматі luxury house stories index: великий lowercase title, category/year filter row, feature story і editorial cards.
- Основний story — колекція весна-літо 2026 “МАКИ” на базі бренд-опису.
- Додано supporting stories: пам'ять у деталях, символ маку, тканини/емоція.
- Додано архівні колекції з `https://nadiyadumka.com/kolekcziyi/`: весна-літо 2021, весна-літо 2022 “Окрилена Україною”, весна-літо 2023 “КАЛИНА”, осінь-зима 2025/26 “GRONO”.
- Для архівних колекцій додано original source links на старі сторінки колекцій.
- Для колекцій додано внутрішні detail pages:
  - `/stories/maky-spring-summer-2026`
  - `/stories/grono-autumn-winter-2025-26`
  - `/stories/kalyna-spring-summer-2023`
  - `/stories/okrylena-ukrainoyu-spring-summer-2022`
  - `/stories/spring-summer-2021`
- EN aliases працюють за тією самою slug-структурою через `/en/stories/[slug]`.
- Detail pages мають editorial hero, великий текстовий блок, detail sections, gallery block, related collections і SEO metadata.
- UA/EN версії через `content/stories.ts`.
- Stories link додано в menu drawer і footer.

### Технічна база

- Next.js App Router.
- React 19.
- Tailwind v4.
- Дані товарів беруться з Shopify JSON endpoint.
- Курси валют беруться з офіційного API НБУ.
- Додано `README.md` із командами запуску.
- Додано git repo і push у `https://github.com/Kl1menko/dumka.git`.
- Додано clean scripts, щоб уникати зламаних `.next` chunks.

## 2. Що Ще Треба Зробити

### Високий пріоритет

- Додати production Storefront API token у env і перевірити checkout на live Shopify.

### Середній пріоритет

- Додати системні сторінки: delivery, returns, contacts/showroom, media.

### Низький пріоритет

- Додати wishlist.
- Додати recently viewed.
- Додати media links на реальні статті.
- Додати animations on scroll.
- Оптимізувати images через `next/image`, якщо домени Shopify будуть стабільно додані в `next.config.mjs`.

## 3. Як Працюють Дані

### Product types

Файл: `lib/types.ts`

Є два головні типи:

- `ProductVariant`
- `Product`

`ProductVariant` описує один варіант товару:

- `id`: Shopify Storefront merchandise id, формат `gid://shopify/ProductVariant/...`
- `title`: назва варіанта, наприклад `S / Black`
- `price`: відформатована ціна
- `priceNumber`: числова ціна для сортування або обчислень
- `size`: значення `option1` із Shopify
- `color`: значення `option2` із Shopify
- `available`: доступність варіанта

`Product` описує товар:

- `handle`: slug для URL `/shop/[handle]`
- `title`: назва товару
- `bodyHtml`: HTML-опис із Shopify
- `images`: масив image URLs
- `variants`: масив варіантів
- `price`: мінімальна ціна серед variants
- `priceNumber`: числова мінімальна ціна для сортування
- `productType`: Shopify `product_type`, використовується каталогом
- `tags`: Shopify tags, резерв для майбутньої категоризації

### Fetching products

Файл: `lib/data.ts`

`getProducts()`:

1. Робить fetch на `https://j06wf9-vp.myshopify.com/products.json?limit=250`.
2. Використовує Next revalidate `3600`, тобто кеш оновлюється раз на годину.
3. Дістає `json.products`.
4. Мапить Shopify product shape у локальний `Product`.
5. Форматує ціни через `Intl.NumberFormat("uk-UA")`.
6. Визначає default price як найнижчу ціну серед variants.
7. Зберігає числову мінімальну ціну, `product_type` і `tags`.
8. Якщо сталася помилка, повертає порожній масив.

`getProductsResult()`:

1. Робить той самий fetch і mapping.
2. Повертає `{ products, error }`.
3. Використовується там, де UI має показати явний error state замість порожнього каталогу.

`getProductByHandle(handle)`:

1. Викликає `getProducts()`.
2. Шукає товар за `product.handle`.
3. Повертає `Product | undefined`.

Зараз `getProductByHandle` лишився як helper, але PDP route напряму бере весь список продуктів, щоб одразу сформувати `relatedProducts`.

## 4. Як Працюють Сторінки

### Root layout

Файл: `app/layout.tsx`

Відповідає за:

- global fonts через `next/font/google`
- global CSS import
- metadata
- `CartProvider`
- `SiteHeader`
- `<main>{children}</main>`
- footer з showroom/contact/subscription info.

Важливо: body має `bg-white`, тому будь-які нові сторінки автоматично стартують із чистого білого фону.

### Home page

Файл: `app/page.tsx`

Це server component.

Логіка:

1. Викликає `getProducts()`.
2. Бере перші 6 товарів для home product grid.
3. Використовує локальний `heroImage` `/images/hero-maky.jpg`.
4. Формує категорії з перших доступних product images.
5. Рендерить секції:
   - hero
   - statement
   - collection grid
   - category grid
   - lookbook
   - media
   - showroom

### Catalog page

Файл: `app/shop/page.tsx`

Це server component.

Логіка:

1. Await `searchParams`, бо у Next.js 15 route params/search params асинхронні.
2. Викликає `getProducts()`.
3. Нормалізує `category` і `sort` через `lib/catalog.ts`.
4. Рахує кількість товарів у кожній категорії.
5. Передає продукти, початковий фільтр, початкове сортування і counts у `CatalogClient`.

### Product route

Файл: `app/shop/[handle]/page.tsx`

Це server component.

Логіка:

1. `generateStaticParams()` бере всі продукти з Shopify.
2. Для кожного продукту створює static route `{ handle }`.
3. `ProductPage()` отримує `params.handle`.
4. Знаходить product у списку.
5. Якщо товар не знайдено, викликає `notFound()`.
6. Формує `relatedProducts` як перші 3 товари, окрім поточного.
7. Передає все в client component `ProductClient`.

`generateMetadata()`:

1. Await `params`.
2. Знаходить product за `handle`.
3. Формує title, description і Open Graph image з Shopify product data.

## 5. Як Працюють Компоненти

### SiteHeader

Файл: `components/SiteHeader.tsx`

Це client component, бо використовує:

- `useState`
- `useEffect`
- `usePathname`
- scroll listener

State:

- `drawer`: може бути `menu`, `search`, `cart` або `null`.
- `scrolled`: `true`, якщо `window.scrollY > 24`.

Route logic:

- `pathname === "/"` означає home.
- `solidHeader = scrolled || !isHome`.
- На home до скролу хедер прозорий і білий.
- На home після скролу хедер білий із чорним текстом.
- На будь-якій внутрішній сторінці хедер одразу білий із чорним текстом.

Drawer logic:

- Клік по `Меню` або `Пошук` ставить відповідне значення в local `drawer`.
- Клік по `Кошик` відкриває cart drawer через `CartProvider`.
- Overlay з'являється, якщо відкритий menu/search drawer або cart drawer.
- Клік по overlay або `Закрити` закриває активний drawer.
- Drawers рухаються через Tailwind classes `translate-x-0` / `translate-x-full`.

Search logic:

- Search drawer має local `searchQuery`, `searchResults`, `searchLoading`, `searchError`.
- Пошук стартує після 2 символів із debounce 280ms.
- `/api/search` викликає `getProductsResult()` і шукає по title, product type, tags і stripped bodyHtml.
- Якщо Shopify недоступний, `/api/search` повертає `503`, а drawer показує error text.
- Результати ведуть на `/shop/[handle]`.

Localization flow:

- Locale helper: `lib/i18n.ts`.
- Українські routes лишаються базовими: `/`, `/shop`, `/shop/[handle]`.
- English aliases додані як `/en`, `/en/shop`, `/en/shop/[handle]`.
- Header, search drawer і cart drawer використовують locale-aware labels і links.
- Product titles/descriptions поки беруться з Shopify як є.

Важливо: внутрішні стилі menu drawer зараз вважаються approved. Не чіпати без окремого запиту.

### ProductCard

Файл: `components/ProductCard.tsx`

Це client component, але зараз не має state. Він лишається client через попередню структуру і можливий hover/client UI розвиток.

Логіка:

1. Береться `product.images[0]` як основне фото.
2. Якщо його немає, використовується fallback Shopify image.
3. `product.images[1]` використовується як hover image.
4. Якщо другого фото немає, hover image дорівнює main image.
5. Вся картка є `Link` на `/shop/${product.handle}`.
6. На desktop hover плавно перемикає main image на alternate image.
7. Зображення в картках використовують `object-fit: contain`, щоб виріб вміщався повністю.
8. Ціна показується через `useCurrency().formatPrice(product.priceNumber)`.
9. На мобільному картки компактні, по 2 в ряд.

CSS для картки лежить у `app/globals.css`:

- `.product-tile-media`
- `.product-tile-image`
- `.product-tile-action`

### ProductClient

Файл: `app/shop/[handle]/ProductClient.tsx`

Це client component, бо має local UI state.

State:

- `sizeGuideOpen`: чи відкритий size guide modal.
- `selectedSize`: активний розмір. Початкове значення — перший доступний size.

Computed values:

- `sizeOptions`: унікальні `variant.size` із product variants разом із availability.
- `selectedVariant`: перший variant для активного розміру.
- `canAddToCart`: `false`, якщо активний розмір недоступний.
- `images`: product images або fallback image.

Mobile image rail:

- На mobile контейнер має horizontal scroll.
- Кожне фото має `snap-center`.
- Фото займає приблизно `86vw`.
- Лічильник `i + 1 / images.length` показується тільки на mobile.

Desktop product layout:

- Зліва великі фото.
- Справа sticky purchase/info block.
- Add-to-cart button показується в правому блоці тільки від `md`.

Mobile add-to-cart:

- На mobile основна кнопка винесена в fixed bottom bar.
- Bar показує назву товару, ціну і CTA.

Cart drawer:

- Клік по add-to-cart викликає `addProduct(product, selectedSize)` з `CartProvider`.
- Cart drawer тепер глобальний і відкривається з provider.

### CatalogClient

Файл: `app/shop/CatalogClient.tsx`

Це client component, бо має local UI state.

State:

- `category`: активна категорія.
- `sort`: активне сортування.
- `filtersOpen`: чи відкритий mobile filter drawer.

Логіка:

- Фільтрація і сортування працюють на клієнті поверх уже завантажених Shopify products.
- При зміні category/sort оновлюється URL через `router.replace`.
- На desktop controls показуються як sticky sidebar і select.
- На mobile controls відкриваються bottom sheet drawer.

## 6. CSS / UI Primitives

Файл: `app/globals.css`

Глобальні primitives:

- `.luxury-link`: uppercase link із hover underline.
- `.primary-button`: чорна кнопка з білим текстом.
- `.ghost-button`: прозора кнопка з тонкою рамкою.
- `.floating-field`: input із нижньою лінією і floating label.
- `.reveal`: fade-up animation.
- `.product-tile-*`: товарні плитки.
- `.mobile-product-rail`: приховує scrollbar на mobile horizontal rail.

Правила:

- Базовий фон сторінок тільки `#FFFFFF`.
- Не повертати молочний фон як body/page background.
- Темні секції дозволені тільки як editorial/campaign block.
- Кнопки мають лишатися з мінімальним radius.

## 7. Поточні Обмеження

- Checkout flow реалізований, але потребує реальний `SHOPIFY_STOREFRONT_ACCESS_TOKEN` у env для production-перевірки.
- Product description вставляється через `dangerouslySetInnerHTML`, бо Shopify повертає HTML. Треба бути обережними, якщо джерело даних зміниться.
- Related products зараз обираються просто як перші 3 інші товари, без логіки категорій або образів.

## 8. Команди Для Роботи

Встановлення:

```bash
npm install
```

Dev server:

```bash
npm run dev:clean
```

Production build check:

```bash
npm run build:clean
```

Очистити Next cache:

```bash
npm run clean
```

Важливо: не запускати `next build`, поки відкритий `next dev` у цьому ж проєкті. Next.js пише dev і build output в одну папку `.next`, через що можуть виникати помилки на кшталт `Cannot find module './222.js'`.

## 9. Git / Deploy Notes

Remote repository:

```bash
https://github.com/Kl1menko/dumka.git
```

Основна гілка:

```bash
main
```

Після змін:

```bash
git status
git add .
git commit -m "Describe change"
git push
```

Перед push бажано запускати:

```bash
npm run build:clean
```

## 10. Правила Для Наступних Змін

- Не чіпати внутрішній дизайн drawer-меню без окремого запиту.
- Не повертати молочний фон.
- Не робити мас-маркетні sale-плашки, яскраві badges або агресивні CTA.
- Product cards тримати компактними, чистими і mobile-first.
- PDP має лишатися максимально візуальним: фото першочергові, інформація зібрана і не перевантажена.
- Якщо додається нова логіка, коротко оновити цей файл у секціях “Що вже зроблено” і “Що ще треба зробити”.
