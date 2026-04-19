export type Locale = "uk" | "en";

export function getLocaleFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "uk";
}

export function localizePath(pathname: string, locale: Locale) {
  const withoutLocale =
    pathname === "/en" ? "/" : pathname.startsWith("/en/") ? pathname.slice(3) : pathname;

  if (locale === "en") {
    return withoutLocale === "/" ? "/en" : `/en${withoutLocale}`;
  }

  return withoutLocale || "/";
}
