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

### Головна сторінка

Файл: `app/page.tsx`

Реалізовано:

- Hero на весь екран із фокусом на колекцію `Маки`.
- Statement block про колекцію.
- Блок `Весна - літо 2026` із продуктами з Shopify.
- Асиметричні категорії: сукні, костюми, вечірній одяг.
- Темна campaign/lookbook секція.
- Блок медіа.
- Showroom block з адресою: вул. Шпитальна, 1, Львів, ТЦ "Магнус", 3-й поверх.

### Header / Navigation

Файл: `components/SiteHeader.tsx`

Реалізовано:

- Fixed header.
- На головній сторінці до скролу хедер прозорий поверх hero.
- Після скролу хедер стає білим із чорним текстом.
- На внутрішніх сторінках хедер одразу білий із чорним текстом, щоб не губитися на світлих product-фото.
- Drawer-меню, search drawer і cart drawer.
- Внутрішній дизайн меню та списків зараз виглядає добре. Не змінювати без окремого запиту.

### PDP / Product Detail Page

Файли:

- `app/shop/[handle]/page.tsx`
- `app/shop/[handle]/ProductClient.tsx`

Реалізовано:

- Dynamic route `/shop/[handle]`.
- Великі product-фото.
- На мобільному: горизонтальний snap rail для фото.
- На desktop: sticky purchase block справа.
- Size selector через клікабельні chips, не через select.
- Accordions для опису, тканини/догляду, доставки/повернення.
- Sticky bottom add-to-cart bar на мобільному.
- Cart drawer після додавання товару.
- `Complete the look` / related products block.

### Технічна база

- Next.js App Router.
- React 19.
- Tailwind v4.
- Дані товарів беруться з Shopify JSON endpoint.
- Додано `README.md` із командами запуску.
- Додано git repo і push у `https://github.com/Kl1menko/dumka.git`.
- Додано clean scripts, щоб уникати зламаних `.next` chunks.

## 2. Що Ще Треба Зробити

### Високий пріоритет

- Додати повноцінну PLP сторінку каталогу:
  - `/shop`
  - фільтри через drawer або horizontal controls
  - сортування
  - категорії Shopify: сукні, костюми, блузи, вечірній одяг, жилети, топи, шорти, комбінезони, аксесуари, подарунки.
- Зробити реальний cart state:
  - зберігати додані товари
  - кількість
  - selected size
  - subtotal
  - синхронізація header cart count.
- Підключити реальний checkout flow:
  - або Shopify cart/checkout API
  - або headless Shopify Storefront API.
- Доробити size guide modal замість нинішньої кнопки-заглушки.
- Обробити unavailable variants:
  - disabled size chips
  - текст “Немає в наявності”
  - не дозволяти add-to-cart без валідного variant.

### Середній пріоритет

- Додати localization flow: UA / EN.
- Додати real search:
  - пошук по product title
  - показ результатів у drawer.
- Додати category links у drawer, які ведуть на реальні сторінки, а не anchors.
- Додати loading/skeleton states для товарів.
- Додати error state, якщо Shopify endpoint недоступний.
- Додати SEO metadata для PDP на основі product title/body/images.
- Замінити hardcoded homepage copy на окремий content config.

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

### Fetching products

Файл: `lib/data.ts`

`getProducts()`:

1. Робить fetch на `https://j06wf9-vp.myshopify.com/products.json?limit=250`.
2. Використовує Next revalidate `3600`, тобто кеш оновлюється раз на годину.
3. Дістає `json.products`.
4. Мапить Shopify product shape у локальний `Product`.
5. Форматує ціни через `Intl.NumberFormat("uk-UA")`.
6. Визначає default price як найнижчу ціну серед variants.
7. Якщо сталася помилка, повертає порожній масив.

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
3. Обирає `heroImage` з першого товару або fallback Shopify image.
4. Формує категорії з перших доступних product images.
5. Рендерить секції:
   - hero
   - statement
   - collection grid
   - category grid
   - lookbook
   - media
   - showroom

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

- Клік по `Меню`, `Пошук`, `Кошик` ставить відповідне значення в `drawer`.
- Overlay з'являється, якщо `drawer !== null`.
- Клік по overlay або `Закрити` ставить `drawer` у `null`.
- Сам drawer рухається через Tailwind classes `translate-x-0` / `translate-x-full`.

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
7. На мобільному картки компактні, по 2 в ряд.

CSS для картки лежить у `app/globals.css`:

- `.product-tile-media`
- `.product-tile-image`
- `.product-tile-action`

### ProductClient

Файл: `app/shop/[handle]/ProductClient.tsx`

Це client component, бо має local UI state.

State:

- `selectedSize`: активний розмір. Початкове значення — перший доступний size.
- `cartOpen`: чи відкритий cart drawer після add-to-cart.

Computed values:

- `sizes`: унікальні `variant.size` із product variants.
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

- Клік по add-to-cart ставить `cartOpen = true`.
- Overlay і drawer працюють за тим самим принципом, що і header drawer.
- Зараз це UI-заглушка, не реальний кошик.

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

- Немає справжнього кошика.
- Немає реального checkout.
- Немає реального пошуку.
- Немає PLP сторінки каталогу.
- Немає modal size guide.
- Product description вставляється через `dangerouslySetInnerHTML`, бо Shopify повертає HTML. Треба бути обережними, якщо джерело даних зміниться.
- Related products зараз обираються просто як перші 3 інші товари, без логіки категорій або образів.
- Header cart count завжди `0`.
- Search drawer не виконує пошук.

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
