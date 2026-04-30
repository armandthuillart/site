import { getRelativeLocaleUrl } from "astro:i18n";

import { ui, defaultLang } from "./ui";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function getLocalePostHref(locale: string, postId: string) {
  const [, ...slug] = postId.split("/");
  return getRelativeLocaleUrl(locale, slug.join("/"));
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}
