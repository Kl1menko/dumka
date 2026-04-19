"use client";

import { usePathname } from "next/navigation";
import { getSiteContent } from "@/content/site";
import { getLocaleFromPathname } from "@/lib/i18n";

export function SiteFooter() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const content = getSiteContent(locale).footer;
  const prefix = locale === "en" ? "/en" : "";
  const linkHrefs = [`${prefix}/#collection`, `${prefix}/#showroom`, `${prefix}/#lookbook`, `${prefix}/stories`];
  const serviceHrefs = ["#", "#", "https://www.instagram.com/nadiya_dumka/", "#"];

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
        <form className="mt-10 max-w-sm">
          <label className="floating-field">
            <input placeholder=" " type="email" />
            <span>{content.emailLabel}</span>
          </label>
        </form>
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
