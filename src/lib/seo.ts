/**
 * Head metadata + JSON-LD, resolved page-over-site.
 *
 * The `site` global seeds seoTitle / seoDescription / ogImage / twitterHandle — none of which
 * anything rendered before. They're editable in the CMS, so they resolve here rather than being
 * hard-coded per route.
 *
 * The merge itself is the SDK's `resolveSeo` — the same function the server-side renderer uses
 * (`mergeSeoMeta`), so `*.bettercms.site` and this static build emit identical <head> SEO. Empty
 * inputs collapse to "" meaning "omit the tag": it never fabricates a value.
 */
import { resolveSeo, type ResolvedSeo } from "@bettercms-ai/sdk";
import { getSingleton, authorData, type Author, type BlogPostFields, type CaseStudyFields, type Site } from "./content";

type Json = Record<string, unknown>;
type SeoArgs = {
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  schema?: Json | Json[];
};

const site = (): Site | undefined => getSingleton<Site>("site");

function defaults() {
  const s = site();
  return {
    metaTitle: s?.seoTitle,
    metaDescription: s?.seoDescription,
    ogImage: s?.ogImage?.url ?? null,
    twitterHandle: s?.twitterHandle ?? null,
    siteSchema: s ? organizationSchema(s) : undefined,
  };
}

/** Resolve a route's head metadata + JSON-LD (page wins over site). Base.astro renders it. */
export const seo = (args: SeoArgs): ResolvedSeo =>
  resolveSeo(
    {
      title: args.title,
      metaTitle: args.metaTitle,
      metaDescription: args.metaDescription,
      metaJson: args.schema ? { schema: args.schema } : null,
    },
    defaults(),
  );

/** The brand, from the CMS. The single source for <title>, the nav, and the footer. */
export const brandName = (): string => site()?.brandName ?? "Harbor";

// ── Schema builders (https://schema.org) ────────────────────────────────────────────────────

export const organizationSchema = (s: Site): Json => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: s.brandName,
  ...(s.seoDescription ? { description: s.seoDescription } : {}),
  ...(s.ogImage?.url ? { logo: s.ogImage.url } : {}),
});

export const blogPostingSchema = (post: BlogPostFields): Json => {
  const author: Author | null = authorData(post.author);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(post.coverImage?.url ? { image: post.coverImage.url } : {}),
    ...(post.publishedDate ? { datePublished: post.publishedDate } : {}),
    ...(author ? { author: { "@type": "Person", name: author.name, ...(author.role ? { jobTitle: author.role } : {}) } } : {}),
  };
};

export const caseStudySchema = (c: CaseStudyFields): Json => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: c.title,
  ...(c.summary ? { description: c.summary } : {}),
  ...(c.coverImage?.url ? { image: c.coverImage.url } : {}),
  ...(c.client ? { about: c.client } : {}),
});
