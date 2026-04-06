import en, { type TranslationKeys } from "./locales/en";
import ptBR from "./locales/pt-BR";
import type { Locale } from "@/lib/constants";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/constants";

// ─── Dictionary Registry ────────────────────────────────────────────────────

const dictionaries: Record<Locale, TranslationKeys> = {
  [LOCALES.EN]: en,
  [LOCALES.PT_BR]: ptBR,
};

// ─── Get Dictionary ─────────────────────────────────────────────────────────

export function getDictionary(locale: Locale = DEFAULT_LOCALE): TranslationKeys {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

// ─── Translation Helper ─────────────────────────────────────────────────────

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? `${K}.${NestedKeyOf<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

export type TranslationKey = NestedKeyOf<TranslationKeys>;

/**
 * Get a translated string by dot-notation key.
 *
 * @example
 * t("en", "common.save")        // "Save"
 * t("pt-BR", "common.save")     // "Salvar"
 * t("en", "validation.minLength", { min: "3" })  // "Must be at least 3 characters"
 */
export function t(
  locale: Locale,
  key: string,
  params?: Record<string, string>
): string {
  const dict = getDictionary(locale);
  const keys = key.split(".");

  let value: unknown = dict;
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      // Fallback: try the default locale
      let fallback: unknown = dictionaries[DEFAULT_LOCALE];
      for (const fk of keys) {
        if (fallback && typeof fallback === "object" && fk in fallback) {
          fallback = (fallback as Record<string, unknown>)[fk];
        } else {
          return key; // Key not found in any locale
        }
      }
      value = fallback;
      break;
    }
  }

  if (typeof value !== "string") {
    return key;
  }

  // Replace template params like {min}, {max}
  if (params) {
    return Object.entries(params).reduce(
      (str, [paramKey, paramValue]) =>
        str.replace(new RegExp(`\\{${paramKey}\\}`, "g"), paramValue),
      value
    );
  }

  return value;
}

// ─── React Hook Helper ──────────────────────────────────────────────────────

/**
 * Create a translation function bound to a specific locale.
 *
 * @example
 * const t = createTranslator("pt-BR");
 * t("common.save") // "Salvar"
 */
export function createTranslator(locale: Locale) {
  return (key: string, params?: Record<string, string>) =>
    t(locale, key, params);
}

// ─── Locale Metadata ────────────────────────────────────────────────────────

export const LOCALE_LABELS: Record<Locale, string> = {
  [LOCALES.EN]: "English",
  [LOCALES.PT_BR]: "Português (Brasil)",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  [LOCALES.EN]: "GB",
  [LOCALES.PT_BR]: "BR",
};

// ─── Re-exports ─────────────────────────────────────────────────────────────

export type { TranslationKeys };
export { en, ptBR };
