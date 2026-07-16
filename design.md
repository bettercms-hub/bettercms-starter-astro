# Design — BetterCMS Marketing Starter

A locked design system, shared by **both** starter repos (`bettercms-starter-astro` and
`bettercms-starter`, Next). The two ship one identical `global.css`; this file explains it.
Extend or amend it — don't regenerate it per page.

Fork this template? This file is yours. Change the tokens, keep the rules.

## Register

The **calm workhorse**. The sibling `modern-aesthetic` template is the premium, animated,
immersive one — this is the polished default: fast, quiet, and obviously rebrandable. If a
change here makes it compete with `modern-aesthetic` on spectacle, it's the wrong change.

## Genre

modern-minimal.

## Macrostructure family

Marketing pages (`/`, `/about`, `/contact`) render a **flat CMS block stream** — the editor
composes them, so the layout can only style *by block type and position*, never by hand-placed
sections. That constraint is the design.

- **Marketing pages** — Marquee Hero. The first heading + text + buttons is the marquee
  (large, left-biased, on plain paper). Everything after it is a calm hairline-ruled document.
- **Content pages** (`/blog`, `/case-studies`, and their detail routes) — Index + Long
  Document. Card grid to an article measure.

## Theme — Coral

Warm-grey paper, one coral accent, Geist throughout, soft pill CTAs. Diversification axes:
**paper band** light-warm · **display style** grotesk-sans (Geist) · **accent hue** warm coral.

One accent. It marks the primary button, links, the focus ring, and nothing else — under 5% of
any viewport. There is no secondary chromatic colour, no gradient, no glass.

## Typography

Geist for everything (single-family discipline — the genre's rule).

- Display: Geist 600–700, tracking `-0.03em`.
- Body: Geist 400. Muted body copy at 400.
- Mono: system mono, for inline code only.

## Spacing

A named scale in `:root` (`--space-*`) and a fluid type scale (`--step-*`). Pages reference
tokens by name — never a raw value.

## Motion

Reveal only: fade + 10px rise on scroll, via CSS `animation-timeline: view()` (no JS).

- Easings: `--ease` only. Never the browser default `ease`, never bounce or overshoot.
- Reduced motion: everything static and fully visible.
- **Deliberately absent**: aurora/mesh, film grain, parallax, autoplay. They belong to
  `modern-aesthetic`. Cut motion before adding it.

## Microinteractions stance

Silent success. Hover is a colour/border shift, not a lift. The focus ring never animates.

## CTA voice

- Primary: solid coral fill, soft pill, `--color-primary-fg` text. Names its destination.
- Secondary: surface fill, hairline border. Same shape.
- Never "click here", "learn more", "get started" with no object.

## Copy rules — load-bearing

1. **No invented facts.** No metric, percentage, customer count, logo wall, or testimonial
   unless the forking user supplies a real one. A starter that ships `80% faster` means every
   user who deploys it publishes a claim nobody measured, under their own brand.
2. **The brand lives in the `site` global**, never in a page template. `brandName` renders the
   nav, the footer, and every `<title>`. One brand, one source.
3. Placeholder copy is fine — placeholder *proof* is not.

## What pages MUST share

Wordmark · accent colour and its ≤5% placement · Geist · CTA voice · the nav and footer chrome.

## What pages MAY differ on

Macrostructure within the family. Marketing pages may carry CMS imagery; content pages are
typography + cover images only.

## Chrome

- **Nav — three sections: wordmark · links · one CTA.** The CTA is *derived* from the last
  `navLinks` entry, never appended to them — the previous nav hard-coded a Contact button on
  top of the seeded Contact link, so Contact rendered twice before you counted the footer.
- **Footer — newsletter-first.** It leads with the one thing a footer is actually for, and
  keeps the index to a single quiet row. It replaced four columns of links + a social row + a
  copyright line: the most-recognised generated-footer shape, and the third place Contact was
  being rendered. It's also what gives the seeded `form_newsletter` — which nothing rendered —
  a home.

## Exports

### tokens.css

The live values are the `@theme` + `:root` blocks at the top of `src/styles/global.css`
(Astro) / `app/globals.css` (Next). That block **is** the token export: Tailwind v4 `@theme`
generates utilities (`bg-paper`, `text-ink`, `font-display`) from the same names the
hand-written chrome and the `<BcmsBlocks>` rules consume. Copy that block to port the system.
