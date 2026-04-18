<div align="center">

# Armand Thuillart

[![Astro](https://img.shields.io/badge/Astro-^6.0-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite+](https://img.shields.io/badge/Vite+-0.1.18-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

My digital home, portfolio, and writing space on the web.

[Get Started](#getting-started) • [Tech Stack](#tech-stack) • [Content Authoring](#content-authoring) • [Deployment](#deployment)

</div>

This repository powers my personal website, housing my profile, projects, and writings. I built this static site using modern web technologies to ensure optimal performance, strong SEO, and a great authoring experience.

> [!NOTE]
> **Using Vite+**<br>
> This project relies on [Vite+](https://github.com/voidzero-dev/setup-vp) as its unified toolchain wrapper. It manages dependencies, runtime, formatting, linting, and task execution. You should use `vp` commands instead of `bun`, `npm` or `pnpm` directly.

## Getting Started

Follow these steps to set up the project locally.

1. **Install dependencies**
   ```bash
   vp install
   ```
2. **Start the development server**
   ```bash
   vp dev
   ```
   _The site will be available at `http://localhost:4321`._

### Available Commands

`vp` manages the development lifecycle:

| Command         | Description                                         |
| --------------- | --------------------------------------------------- |
| `vp dev`        | Starts the Astro development server.                |
| `vp check`      | Runs Astro type checks and validations.             |
| `vp lint`       | Lints the codebase using Vite+'s bundled tools.     |
| `vp fmt`        | Formats code via Vite+'s bundled formatter.         |
| `vp build`      | Builds the static site for production into `dist/`. |
| `vp preview`    | Previews the local production build.                |
| `vp run deploy` | Deploys the built site to Cloudflare via Wrangler.  |

## Tech Stack

- **Framework:** [Astro 6](https://astro.build)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com)
- **Content:** MDX (via `astro:content`)
- **Toolchain:** Vite+
- **Deployment:** [Cloudflare](https://workers.cloudflare.com) (via Wrangler)
- **Language:** TypeScript

## Content Authoring

I write all pages and posts in MDX and store them under `src/content/blog/**/*.mdx`.

> [!TIP]
> The content schema strictly validates frontmatter. Be sure to include the required fields before saving.

**Frontmatter Schema (`src/content.config.ts`)**

- `title` (string, required) - The title of the post or page.
- `description` (string, required) - A brief summary for metadata and listings.
- `topic` (string, optional) - Categorizes the post.
- `date` (date, optional) - Publish date.
- `draft` (boolean, required) - Set to `true` to hide the page in production.

The `/writings` index page automatically displays posts that include a `date` and `topic` and are not marked as `draft: true`.

## Deployment

Cloudflare Wrangler deploys the application. The build process generates static output in the `dist` directory and publishes it directly.

```bash
# 1. Build the production output
vp build

# 2. Deploy via Wrangler
vp run deploy
```
