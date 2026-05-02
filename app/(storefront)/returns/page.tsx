import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Повернення | DUMKA by Nadiya Dumka",
  description: "Умови та процес повернення виробів DUMKA by Nadiya Dumka.",
};

export default function ReturnsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 md:px-8 md:py-28">
      <p className="mb-4 text-[11px] uppercase tracking-widest text-[#111]/40">Сервіс</p>
      <h1 className="mb-16 font-serif text-4xl uppercase tracking-wide md:text-5xl">
        Повернення
      </h1>

      <div className="space-y-14">
        <section>
          <h2 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
            Умови повернення
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[#111]/70">
            <p>
              Приймаємо повернення протягом <span className="text-[#111]">14 днів</span> з
              моменту отримання замовлення.
            </p>
            <p>Виріб повинен відповідати таким умовам:</p>
            <ul className="ml-4 space-y-2 list-none">
              {[
                "Не носився і не використовувався",
                "Оригінальні ярлики на місці",
                "Відсутні сліди макіяжу, парфумів або пошкоджень",
                "Оригінальне пакування збережено",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2.5 h-px w-4 shrink-0 bg-[#111]/30" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
            Як ініціювати повернення
          </h2>
          <div className="space-y-6 text-sm leading-7 text-[#111]/70">
            {[
              {
                step: "01",
                text: "Напишіть на dumkaprotebe@gmail.com із зазначенням номера замовлення та коротким описом причини.",
              },
              {
                step: "02",
                text: "Протягом 1 робочого дня ми підтвердимо повернення і надішлемо адресу для відправлення.",
              },
              {
                step: "03",
                text: "Відправте виріб Новою Поштою або будь-яким зручним перевізником. Збережіть трекінг-номер.",
              },
              {
                step: "04",
                text: "Після отримання та перевірки стану — повернемо кошти протягом 3–5 робочих днів на картку, з якої здійснювалась оплата.",
              },
            ].map(({ step, text }) => (
              <div key={step} className="flex gap-6">
                <span className="shrink-0 font-serif text-2xl text-[#111]/15">{step}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
            Що не підлягає поверненню
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[#111]/70">
            <p>
              Вироби, пошиті або підігнані на замовлення — індивідуальний пошив, зміна конструкції
              або підгонка розміру під замовника.
            </p>
            <p>
              Вироби з явними ознаками носіння, пошкоджень або без оригінальних ярликів.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-[#111]/40">
            Вартість зворотної доставки
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[#111]/70">
            <p>
              Покупець самостійно оплачує зворотну доставку, крім випадків, коли причиною є
              виробничий брак або помилка з нашого боку — тоді витрати компенсуємо ми.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-16 border-t border-[#111]/8 pt-10">
        <p className="mb-6 text-sm text-[#111]/50">
          Маєте питання або нестандартна ситуація?
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="mailto:dumkaprotebe@gmail.com"
            className="primary-button inline-block px-8 py-3 text-xs"
          >
            Написати нам
          </a>
          <Link
            href="/delivery"
            className="ghost-button inline-block px-8 py-3 text-xs"
          >
            Доставка та оплата
          </Link>
        </div>
      </div>
    </main>
  );
}
