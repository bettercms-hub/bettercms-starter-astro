import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ContentBlock } from "@bettercms-ai/types";
import type { DeliveryForm } from "@bettercms-ai/sdk";

/**
 * Read the deploy Action's build snapshot (`bcms-content.json`): entries grouped under
 * `collections` by model slug (depth-1 hydrated), plus published pages and forms. A static
 * build resolves everything from here — no API key needed at build time. Absent file → empty
 * (e.g. before `npm run fetch-content` locally).
 */
export interface SnapshotPage {
  slug: string;
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  blocks: ContentBlock[];
}
export type SnapshotEntry<T> = { slug: string; data: T };
interface Snapshot {
  collections?: Record<string, SnapshotEntry<unknown>[]>;
  pages?: SnapshotPage[];
  forms?: DeliveryForm[];
  turnstileSiteKey?: string | null;
}

let cache: Snapshot | null = null;
function snap(): Snapshot {
  if (cache) return cache;
  try {
    cache = JSON.parse(readFileSync(resolve(process.cwd(), "bcms-content.json"), "utf8")) as Snapshot;
  } catch {
    cache = {};
  }
  return cache;
}

export const getPage = (slug: string): SnapshotPage | undefined =>
  (snap().pages ?? []).find((p) => p.slug === slug);
export const getForms = (): { items: DeliveryForm[]; turnstileSiteKey: string | null } => ({
  items: snap().forms ?? [],
  turnstileSiteKey: snap().turnstileSiteKey ?? null,
});
export const listEntries = <T>(model: string): SnapshotEntry<T>[] =>
  (snap().collections?.[model] ?? []) as SnapshotEntry<T>[];
export const getEntry = <T>(model: string, slug: string): SnapshotEntry<T> | undefined =>
  listEntries<T>(model).find((e) => e.slug === slug);

/** Singleton models (site/home/…) have exactly one entry — return its data. */
export const getSingleton = <T>(model: string): T | undefined => listEntries<T>(model)[0]?.data;

// ── Site globals (the `site` singleton: brand/nav/footer chrome, editable in the CMS) ──────────
/** Repeatable/zoned-array fields arrive as `{ repeatable: [...] }` at delivery depth ≥ 1. */
export type Repeatable<T> = { repeatable?: T[] };
export type NavLink = { label: string; href: string };
export type Social = { label: string; href: string };
export type Site = {
  brandName?: string;
  navLinks?: Repeatable<NavLink>;
  footerTagline?: string;
  socials?: Repeatable<Social>;
};
/** Unwrap a repeatable field to a plain list. */
export const items = <T>(field?: Repeatable<T>): T[] => (Array.isArray(field?.repeatable) ? field.repeatable : []);

// Field shapes seeded by the Marketing Starter template.
export type Image = { url: string; alt?: string };
export type RichText = { html: string };
export type Author = { name: string; role?: string; bio?: string; avatar?: Image };
export type BlogPostFields = {
  title: string;
  excerpt?: string;
  coverImage?: Image;
  body?: RichText;
  author?: { slug: string; data?: Author } | string;
  publishedDate?: string;
};
export type CaseStudyFields = {
  title: string;
  client?: string;
  summary?: string;
  coverImage?: Image;
  body?: RichText;
  result?: string;
};
export const authorData = (a: BlogPostFields["author"]): Author | null =>
  !a || typeof a === "string" ? null : a.data ?? null;
