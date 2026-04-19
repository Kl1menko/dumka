import { NextResponse } from "next/server";
import { fallbackExchangeRates } from "@/lib/currency";

interface NbuRate {
  rate: number;
  cc: string;
  exchangedate: string;
}

export async function GET() {
  const [usd, eur] = await Promise.all([
    getNbuRate("USD"),
    getNbuRate("EUR"),
  ]);

  return NextResponse.json(
    {
      base: "UAH",
      rates: {
        USD: usd?.rate || fallbackExchangeRates.rates.USD,
        EUR: eur?.rate || fallbackExchangeRates.rates.EUR,
      },
      date: usd?.exchangedate || eur?.exchangedate || fallbackExchangeRates.date,
    },
    {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}

async function getNbuRate(currency: "USD" | "EUR") {
  const response = await fetch(
    `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${currency}&json`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as NbuRate[];
  return data[0] || null;
}
