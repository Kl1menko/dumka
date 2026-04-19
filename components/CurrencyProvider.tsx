"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CurrencyCode,
  ExchangeRates,
  fallbackExchangeRates,
  formatCurrencyFromUah,
} from "@/lib/currency";

const CURRENCY_STORAGE_KEY = "dumka-currency-v1";

interface CurrencyContextValue {
  currency: CurrencyCode;
  rates: ExchangeRates;
  rateDate: string;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (valueUah: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("UAH");
  const [rates, setRates] = useState<ExchangeRates>(fallbackExchangeRates);

  useEffect(() => {
    const storedCurrency = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (isCurrencyCode(storedCurrency)) {
      setCurrencyState(storedCurrency);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadRates() {
      try {
        const response = await fetch("/api/rates");
        const payload = await response.json();

        if (active && response.ok && payload?.rates?.USD && payload?.rates?.EUR) {
          setRates(payload);
        }
      } catch {
        setRates(fallbackExchangeRates);
      }
    }

    loadRates();

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<CurrencyContextValue>(() => {
    function setCurrency(nextCurrency: CurrencyCode) {
      setCurrencyState(nextCurrency);
      window.localStorage.setItem(CURRENCY_STORAGE_KEY, nextCurrency);
    }

    return {
      currency,
      rates,
      rateDate: rates.date,
      setCurrency,
      formatPrice: (valueUah: number) =>
        formatCurrencyFromUah(valueUah, currency, rates),
    };
  }, [currency, rates]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }

  return context;
}

function isCurrencyCode(value: string | null): value is CurrencyCode {
  return value === "UAH" || value === "USD" || value === "EUR";
}
