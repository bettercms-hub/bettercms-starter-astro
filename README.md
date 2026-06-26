# BetterCMS Marketing Starter (Astro)

The **Astro** starter for the BetterCMS *Marketing Starter* template: a polished, fully static
marketing site rendered from a BetterCMS project.

- **Home / About / Contact** — CMS pages rendered from their block tree with `<BcmsBlocks>`.
  The Contact page carries a real **form block**, so submissions land in your project's inbox.
- **Blog** and **Case Studies** — content collections, listed and rendered as static pages.

Create a site from this template in the BetterCMS dashboard (pick *Marketing Starter* → *Astro*)
and it's deployed and wired automatically. Or run it locally below.

## The slug contract

This site reads these slugs from the CMS — they match the template's seeded content. Keep them in
sync if you rename models/pages (and mirror changes in `bettercms-starter`, the Next.js twin):

| Kind  | Slugs |
|-------|-------|
| Pages | `home`, `about`, `contact` |
| Models| `blog-post`, `case-study`, `author` |

## Run locally

```bash
cp .env.example .env            # set PUBLIC_BCMS_WORKSPACE + BCMS_API_KEY (content:read)
npm install
npm run fetch-content           # writes bcms-content.json (pages, forms, entries)
npm run dev                     # http://localhost:4321
```

This is a **static** site (`output: "static"`): every page, entry, and the contact form render
from `bcms-content.json`. Regenerate it with `npm run fetch-content` after editing content. On
BetterCMS hosting the deploy Action generates `bcms-content.json` before each build, then serves
the static `dist/`.
