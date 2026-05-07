"use client";

export default function ProductError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-24 text-center">
      <p className="mb-4 font-serif text-4xl font-light uppercase">
        Виріб тимчасово недоступний
      </p>
      <p className="max-w-md text-sm leading-7 text-[#111111]/60">
        Не вдалося завантажити дані. Оновіть сторінку або зв'яжіться з шоурумом.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button className="primary-button" onClick={reset}>
          Спробувати ще раз
        </button>
        <a className="ghost-button" href="tel:+380677570121">
          Шоурум
        </a>
      </div>
    </div>
  );
}
