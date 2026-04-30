import { ui, defaultLang } from "@i18n/ui";
import { getRelativeLocaleUrl } from "astro:i18n";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function getLocalePostHref(locale: string, postId: string) {
  const [, ...slug] = postId.split("/");
  const path = slug.join("/");

  if (path === "" || path === "index") {
    return locale === defaultLang ? "/" : `${getRelativeLocaleUrl(locale, "")}/`;
  }

  return getRelativeLocaleUrl(locale, path);
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}
