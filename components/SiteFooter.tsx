"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { getSiteContent } from "@/content/site";
import { getLocaleFromPathname } from "@/lib/i18n";

export function SiteFooter() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const content = getSiteContent(locale).footer;
  const prefix = locale === "en" ? "/en" : "";
  const linkHrefs = [`${prefix}/#collection`, `${prefix}/#showroom`, `${prefix}/#lookbook`, `${prefix}/stories`];
  const serviceHrefs = [
    `${prefix}/delivery`,
    `${prefix}/returns`,
    "https://www.instagram.com/nadiya_dumka/",
  ];
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="mx-auto mt-24 grid max-w-7xl grid-cols-1 gap-12 border-t border-[#111111]/10 px-4 py-16 md:grid-cols-[1.2fr_1fr] md:px-8">
      <div className="max-w-md">
        <h3 className="mb-6 font-serif text-3xl uppercase">Dumka</h3>
        <p className="text-sm leading-7 text-[#111111]/65">
          {content.text}
        </p>
        <div className="mt-8 space-y-2 text-sm text-[#111111]/65">
          {content.address.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
        {subscribed ? (
          <p className="mt-10 text-sm text-[#111111]/55">
            {locale === "en" ? "Thank you. We'll be in touch." : "Дякуємо. Будемо на зв'язку."}
          </p>
        ) : (
          <form
            className="mt-10 max-w-sm"
            onSubmit={(e) => {
              e.preventDefault();
              setSubscribed(true);
            }}
          >
            <div className="flex gap-0">
              <label className="floating-field flex-1">
                <input placeholder=" " type="email" required />
                <span>{content.emailLabel}</span>
              </label>
              <button
                type="submit"
                aria-label="Subscribe"
                className="shrink-0 border border-l-0 border-[#111111]/12 px-4 text-[#111111]/50 transition hover:border-[#111111]/35 hover:text-[#111111]"
              >
                →
              </button>
            </div>
          </form>
        )}
      </div>
      <div className="grid grid-cols-2 gap-8 text-xs uppercase">
        <ul className="space-y-5">
          {content.links.map((item, index) => (
            <li key={item}>
              <a href={linkHrefs[index]} className="luxury-link">
                {item}
              </a>
            </li>
          ))}
        </ul>
        <ul className="space-y-5">
          {content.serviceLinks.map((item, index) => (
            <li key={item}>
              <a href={serviceHrefs[index]} className="luxury-link">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
