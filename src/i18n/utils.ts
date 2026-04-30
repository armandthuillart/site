import { ui, defaultLang } from "@i18n/ui";
import { getRelativeLocaleUrl } from "astro:i18n";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function getLocalePostHref(locale: string, postSlug: string) {
  const path = postSlug.split("/").slice(1).join("/");

  if (path === "" || path === "index") {
    return locale === defaultLang ? "/" : `${getRelativeLocaleUrl(locale, "")}/`;
  }

  return getRelativeLocaleUrl(locale, path);
}

export function getTranslations(lang: keyof typeof ui) {
  const current = ui[lang];

  return (key: keyof (typeof ui)[typeof defaultLang]) => {
    return current[key] ?? ui[defaultLang][key];
  };
}
