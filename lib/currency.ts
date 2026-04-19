export type CurrencyCode = "UAH" | "USD" | "EUR";

export interface ExchangeRates {
  base: "UAH";
  rates: Record<Exclude<CurrencyCode, "UAH">, number>;
  date: string;
}

export const fallbackExchangeRates: ExchangeRates = {
  base: "UAH",
  rates: {
    USD: 43.8943,
    EUR: 51.7667,
  },
  date: "20.04.2026",
};

export function formatCurrencyFromUah(
  valueUah: number,
  currency: CurrencyCode,
  rates: ExchangeRates = fallbackExchangeRates
) {
  if (currency === "UAH") {
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: "UAH",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valueUah);
  }

  const rate = rates.rates[currency];
  const convertedValue = rate > 0 ? valueUah / rate : valueUah;

  return new Intl.NumberFormat(currency === "USD" ? "en-US" : "de-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(convertedValue);
}
