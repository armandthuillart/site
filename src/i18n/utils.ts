import { getRelativeLocaleUrl } from "astro:i18n";

export const getLocalePostHref = (locale: string, postId: string) => {
  const [, ...slug] = postId.split("/");
  return getRelativeLocaleUrl(locale, slug.join("/"));
};
