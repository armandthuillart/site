import type { APIRoute } from "astro";

const getRobotsTxt = (siteURL: URL) => `\
User-agent: *
Allow: /

Sitemap: ${siteURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const siteURL = new URL("sitemap-index.xml", site);
  return new Response(getRobotsTxt(siteURL));
};
