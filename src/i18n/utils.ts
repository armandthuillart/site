import { ui } from "@i18n/ui";
import { getRelativeLocaleUrl } from "astro:i18n";

export function getLangFromURL(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as keyof typeof ui;
  return "en";
}

export function getLocalePostHref(locale: string, postSlug: string) {
  const path = postSlug.split("/").slice(1).join("/");

  if (path === "" || path === "index") {
    return locale === "en" ? "/" : `${getRelativeLocaleUrl(locale, "")}/`;
  }

  return getRelativeLocaleUrl(locale, path);
}

export function getTranslations(lang: keyof typeof ui) {
  const current = ui[lang];

  return (key: keyof (typeof ui)["en"]) => {
    return current[key] ?? ui["en"][key];
  };
}

export function parsePageId(id: string) {
  const [first, ...rest] = id.split("/");
  const isLocalePrefix = first === "en" || first === "fr";

  const locale = isLocalePrefix ? first : "en";
  const parts = isLocalePrefix ? rest : [first, ...rest];

  return { locale, parts, path: parts.join("/") };
}
