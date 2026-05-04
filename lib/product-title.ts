import { Locale } from "@/lib/i18n";

const UK_TO_EN_PREFIX: Array<[string, string]> = [
  ["жакет", "Blazer"],
  ["піджак", "Jacket"],
  ["сукня", "Dress"],
  ["спідниця", "Skirt"],
  ["корсет", "Corset"],
  ["топ", "Top"],
  ["блуза", "Blouse"],
  ["шорти", "Shorts"],
  ["жилетка", "Waistcoat"],
  ["жилет", "Vest"],
  ["кейп", "Cape"],
  ["комір", "Collar"],
  ["штани", "Pants"],
  ["баска", "Peplum"],
  ["маніжка", "Dickey"],
  ["костюм", "Suit"],
  ["подарунковий", "Gift"],
];

export function localizeProductTitle(title: string, locale: Locale): string {
  if (locale !== "en") return title;

  let result = title;
  for (const [uk, en] of UK_TO_EN_PREFIX) {
    const pattern = new RegExp(`^${escapeRegex(uk)}(?=[\\s-]|$)`, "i");
    if (pattern.test(result)) {
      result = result.replace(pattern, en);
      break;
    }
  }

  return result;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
