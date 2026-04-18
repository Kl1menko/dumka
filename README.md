# DUMKA Premium Store

Next.js storefront для преміального fashion-бренду DUMKA.

## Design Direction

Перед змінами в UI відкрийте [DUMKA_FRONTEND_GUIDELINES.md](./DUMKA_FRONTEND_GUIDELINES.md). Там зафіксовано принципи quiet luxury, структуру home/PDP, правила для drawer cart, типографіки, кнопок, інпутів і контенту.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the app:

   ```bash
   npm run dev
   ```

   If ports `3000-3005` are already busy, use the clean dev script:

   ```bash
   npm run dev:clean
   ```

3. Build check:

   ```bash
   npm run build:clean
   ```

   Stop the dev server before running a production build. Next.js writes both dev and
   build output to `.next`; running them at the same time can produce missing chunk
   errors such as `Cannot find module './222.js'`.
