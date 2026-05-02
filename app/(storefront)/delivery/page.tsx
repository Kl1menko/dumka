import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Доставка та оплата | DUMKA by Nadiya Dumka",
  description: "Умови доставки, оплати та повернення виробів DUMKA by Nadiya Dumka.",
};

export default function DeliveryPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 md:px-8 md:py-28">
      <p className="mb-4 text-[11px] uppercase tracking-widest text-[#111]/40">Сервіс</p>
      <h1 className="mb-16 font-serif text-4xl uppercase tracking-wide md:text-5xl">
        Доставка та оплата
      </h1>

      <div className="space-y-14">
        <section>
          <h2 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
            Доставка по Україні
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[#111]/70">
            <p>
              Безкоштовна доставка Новою Поштою по всій Україні для замовлень
              від <span className="text-[#111]">1&nbsp;500&nbsp;₴</span>. Для менших замовлень — за
              тарифами перевізника.
            </p>
            <p>
              Термін доставки — <span className="text-[#111]">1–3 робочих дні</span> після
              підтвердження замовлення. Трекінг-номер надсилаємо на email або Telegram одразу після
              відправлення.
            </p>
            <p>
              Самовивіз доступний у нашому шоурумі у Львові без додаткової оплати — після
              попереднього узгодження.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
            Міжнародна доставка
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[#111]/70">
            <p>
              Відправляємо за кордон через Укрпошту та міжнародних кур'єрів. Вартість і терміни
              залежать від країни призначення — уточнюйте у шоурумі або на email.
            </p>
            <p>
              Митні платежі та збори країни отримувача оплачує покупець.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
            Оплата
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[#111]/70">
            <p>
              Оплата приймається онлайн карткою Visa / Mastercard через захищену платіжну сторінку
              Shopify Payments, а також накладеним платежем через Нову Пошту.
            </p>
            <p>
              Для корпоративних замовлень і пошиття на замовлення — оплата на рахунок ФОП після
              узгодження деталей.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
            Повернення
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[#111]/70">
            <p>
              Повернення приймаємо протягом <span className="text-[#111]">14 днів</span> з
              моменту отримання замовлення. Виріб повинен бути у первісному стані — з ярликами,
              без ознак носіння, запаху або пошкоджень.
            </p>
            <p>
              Для ініціювання повернення напишіть на{" "}
              <a
                href="mailto:dumkaprotebe@gmail.com"
                className="text-[#111] underline underline-offset-4"
              >
                dumkaprotebe@gmail.com
              </a>{" "}
              із зазначенням номера замовлення та причини. Ми надішлемо інструкції протягом
              1 робочого дня.
            </p>
            <p>
              Вироби, пошиті або підігнані на замовлення, поверненню не підлягають.
            </p>
            <p>
              Вартість зворотної доставки несе покупець, за винятком випадків виробничого браку або
              помилки з нашого боку.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
            Шоурум / Примірка
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[#111]/70">
            <p>
              Усі вироби можна приміряти особисто у Львові. Рекомендуємо записатися заздалегідь,
              щоб наш стиліст міг підготувати правильні розміри та доповнення.
            </p>
            <div className="mt-2 space-y-1 text-[#111]/55">
              <p>Вул. Шпитальна, 1, Львів</p>
              <p>ТЦ «Магнус», 3-й поверх</p>
              <p>+38 (067) 757-01-21</p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-16 border-t border-[#111]/8 pt-10">
        <p className="mb-6 text-sm text-[#111]/50">
          Є питання? Ми завжди на зв'язку.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="mailto:dumkaprotebe@gmail.com"
            className="primary-button inline-block px-8 py-3 text-xs"
          >
            Написати нам
          </a>
          <Link
            href="/shop"
            className="ghost-button inline-block px-8 py-3 text-xs"
          >
            До каталогу
          </Link>
        </div>
      </div>
    </main>
  );
}
