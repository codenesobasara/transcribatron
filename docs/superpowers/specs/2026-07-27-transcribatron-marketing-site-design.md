# Transcribatron Marketing Site — Design Spec

**Date:** 2026-07-27
**Status:** Approved for planning
**Target launch:** Week of 2026-08-03 (coincides with app going live on the App Store)

---

## 1. Product context

Transcribatron is a native iOS + macOS voice-to-text and meeting transcription app. It ships on the App Store and Mac App Store as a **one-time $9.99 lifetime purchase** — no subscription. The app is on-device by default (WhisperKit / Parakeet / Apple Speech + local Qwen/Phi LLMs), with unique features like live "Meeting Buddy" coaching during meetings, speaker voiceprint recognition, and a system-wide iOS dictation keyboard.

The app source is at `C:\Users\nesob\Desktop\dev\trandscribe\Transcribatron` (sibling directory).

## 2. Goals

Ship a fast, SEO-optimized marketing website that:

1. Converts App Store traffic and Google discovery into installs
2. Positions Transcribatron against subscription competitors (Otter, Fathom, Granola, Superwhisper) using the one-time-pay wedge
3. Provides ongoing SEO surface area via a blog and a documentation site — both managed in Sanity so content changes don't require deploys
4. Is component-first from day one so new sections/pages can be added by composing existing components, not rewriting

**Design reference:** [paymelater.app](https://paymelater.app) — warm minimalism, screenshot-driven storytelling, numbered feature journey (01–06), single accent color, conversational copy.

## 3. Positioning

**Hero angle:** *"Say more. Spend less."* One-time payment, all features included, no SaaS.

Everything else (privacy, Meeting Buddy, speaker voiceprint, system-wide keyboard) supports the value story further down the page — the pricing wedge leads.

**Copy voice:** friendly, concrete, first-person plural ("we/us") when talking about the product, second-person ("you/your") when talking to the reader. Concrete numbers over adjectives ($9.99 once, not "affordable"). Compare-to-subscription framing is welcome ("what you'd pay Otter in 15 days, you pay Transcribatron once — forever"). Do not lead with "AI-powered" — table stakes.

## 4. Tech stack (chosen)

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js 16.2 App Router | Already installed. Read local docs at `node_modules/next/dist/docs/` before writing Next-specific code (see AGENTS.md — APIs differ from LLM training). |
| Language | TypeScript strict | Already configured. |
| Styling | Tailwind v4 | Already installed. |
| UI primitives | shadcn/ui | Restyled to brand tokens. |
| Icons | `lucide-react` | Tree-shaken. |
| Fonts | `Inter` (body) + `Instrument Serif` (hero headline) via `next/font` | Declared **once** in `src/app/layout.tsx`, exposed as Tailwind font-family tokens (`font-sans`, `font-serif`). Swapping = two lines. |
| CMS | Sanity | Separate Studio project, hosted content lake, free tier sufficient. |
| Deployment | Vercel | Auto-deploy on push to `main`, preview deploys on PRs. |
| Analytics | Vercel Analytics + Speed Insights | GDPR-friendly, no cookies, no consent banner. |
| Config | `vercel.ts` | Not `vercel.json`. |
| Node version | Node 24 LTS | Vercel default. |

**Explicitly out of scope for launch:** dark mode, Framer Motion / scroll-triggered animations, newsletter / email capture, Resend or any transactional email, GA4 / Meta Pixel / third-party tracking, docs search, i18n.

## 5. Site architecture

### 5.1 Routes

```
src/app/
├─ layout.tsx              → global shell (Nav, Footer, fonts, analytics)
├─ page.tsx                → / (landing)
├─ features/page.tsx       → /features
├─ pricing/page.tsx        → /pricing
├─ download/page.tsx       → /download
├─ blog/
│  ├─ page.tsx             → /blog (Sanity list)
│  ├─ [slug]/page.tsx      → /blog/my-post (Sanity post)
│  └─ rss.xml/route.ts     → RSS feed
├─ docs/
│  ├─ page.tsx             → /docs (Sanity list)
│  └─ [slug]/page.tsx      → /docs/getting-started (Sanity article)
├─ support/page.tsx        → /support
├─ privacy/page.tsx        → /privacy
├─ terms/page.tsx          → /terms
├─ sitemap.ts              → dynamic sitemap
├─ robots.ts               → robots.txt
├─ opengraph-image.tsx     → default OG image (1200x630)
└─ api/
   └─ revalidate/route.ts  → Sanity webhook target (secret-gated)
```

### 5.2 Rendering strategy

- **Marketing pages** (Home, Features, Pricing, Download, Support, legal): fully static at build time.
- **Blog + Docs from Sanity:** static with **on-demand revalidation** via `revalidateTag()`. Sanity webhook → `/api/revalidate` (auth by secret) → tag-based regeneration.
- **Sitemap + RSS:** regenerated on Sanity webhook.
- **Draft mode:** Sanity Presentation tool + Next.js draft mode for previews at `?preview=1`.

### 5.3 Component layers

```
src/components/
├─ ui/                     → shadcn primitives (Button, Badge, Card, Accordion, Dialog, Tabs)
├─ layout/                 → Container, Section, Grid, PageHeader
├─ marketing/              → composed sections
│   ├─ Nav.tsx
│   ├─ Footer.tsx
│   ├─ Hero.tsx
│   ├─ TrustStrip.tsx
│   ├─ FeatureRow.tsx           → numbered 01-06 alternating layout
│   ├─ PricingCard.tsx
│   ├─ ComparisonTable.tsx      → vs Otter/Fathom/Granola/Superwhisper
│   ├─ FaqAccordion.tsx
│   ├─ Testimonial.tsx
│   ├─ CtaBanner.tsx
│   ├─ AppStoreBadge.tsx        → variants: 'ios' | 'mac'
│   ├─ Screenshot.tsx           → device-frame wrapper, placeholder + real modes
│   └─ QrCode.tsx
├─ content/                → Sanity content renderers
│   ├─ PortableText.tsx
│   ├─ CodeBlock.tsx            → Shiki syntax highlighting
│   ├─ Callout.tsx              → info/warning/tip variants
│   └─ InlineScreenshot.tsx
└─ seo/
    ├─ JsonLd.tsx               → typed schema.org helpers
    └─ SiteMetadata.tsx         → shared metadata generators
```

**Component discipline:**
- Every section takes props (`headline`, `body`, `screenshot`, `cta`) so the same `<FeatureRow>` renders on both `/` and `/features`
- Design tokens (colors, spacing, font sizes) defined in **one place** — `tailwind.config.ts` + `src/lib/tokens.ts` if needed. No raw hex codes in JSX.
- Every image has `alt` as a required prop (TS error if omitted)
- Sections default to `<h2>`; every page has exactly one `<h1>`

### 5.4 Data flow

- Sanity client (`src/lib/sanity.ts`) — one place, typed via `@sanity/client` + `sanity-typegen`
- GROQ queries co-located with the page that uses them (`src/app/blog/queries.ts`)
- Sanity images through `next/image` via a custom loader (Sanity's CDN handles resize/format)

## 6. Visual system

### 6.1 Color tokens

Defined in `tailwind.config.ts` and consumed as semantic classes (`bg-surface`, `text-ink`, `bg-accent`). Never raw hex in JSX.

| Token | Value | Purpose |
|---|---|---|
| `bg` | `#FAF8F3` | page background (warm cream, from app) |
| `surface` | `#FFFFFF` | cards, elevated panels |
| `surface-2` | `#F3EFE7` | alt-row backgrounds |
| `ink` | `#151510` | primary text (warm ink, from app) |
| `ink-2` | `#4A4740` | secondary text |
| `ink-3` | `#8A867E` | tertiary text, captions |
| `accent` | `#FF6B00` | CTAs, links, numbered badges (app brand orange) |
| `accent-soft` | `#FFF1E5` | accent-tinted panels |
| `sep` | `#EAE5DB` | borders, dividers |
| `positive` | `#2E7D5B` | "included" checkmarks in comparison table |
| `warning` | `#B45309` | "extra cost" markers in comparison table |

Dark mode is deferred but tokens are structured so it can be added later without touching JSX.

### 6.2 Typography

- **Sans-serif:** Inter, variable, self-hosted via `next/font`
- **Serif (hero headline only):** Instrument Serif, self-hosted via `next/font`
- Scale: body `16px/1.6`; headings `text-2xl → text-6xl`; hero `text-5xl md:text-7xl`; tight tracking on headings
- Weights: 400 body, 500 UI, 600 headings, 700 hero
- Fonts declared once in root layout; consumed via Tailwind `font-sans` / `font-serif` — swapping = two lines

### 6.3 Spacing & layout

- Container: `max-w-6xl` (~1152px), centered, `px-6 md:px-8`
- Section rhythm: `py-20 md:py-28`, alternating `bg` / `surface-2` for stripe effect
- Radii: cards `rounded-2xl`, buttons `rounded-full`
- Borders preferred over shadows (subtler paymelater feel)

### 6.4 Motion (CSS-only)

- Hover states on buttons/cards: transform + color, `duration-200`
- No scroll-triggered animations, no parallax, no page transitions
- `<Screenshot>` gets subtle 3° tilt-in-place on desktop hover
- `prefers-reduced-motion` respected everywhere (disables the tilt)

### 6.5 Iconography

`lucide-react` only. No emoji in UI.

### 6.6 Screenshot treatment

`<Screenshot device="iphone" | "mac" src? placeholder? alt />` — wraps in a subtle device frame. **Placeholder mode** (used pre-launch) renders a styled block with a mini fake transcript inside (accent color + warm ink) so the layout is honest during development. Real screenshots swap in by populating `src`.

## 7. Page-by-page structure

### 7.1 `/` — Landing

Sections top to bottom:
1. **Nav** — logo left; links (Features, Pricing, Blog, Docs, Support); "Download" pill CTA right
2. **Hero** — "Say more. Spend less." + one-liner subhead + dual App Store + Mac App Store badges + iPhone + Mac screenshot pair
3. **Trust strip** — "On-device by default · No subscription · No ads · No tracking"
4. **Feature journey (01–06)** — numbered alternating rows:
   - 01 Dictate anywhere (iOS keyboard)
   - 02 Record meetings (with Meeting Buddy coaching)
   - 03 Know who's talking (speaker voiceprint)
   - 04 Clean & analyze with AI (local or cloud, your choice)
   - 05 Listen to anything (read-aloud with karaoke highlighting)
   - 06 Yours forever (Obsidian sync, Apple Notes, MCP)
5. **Pricing snapshot** — one big card, "$9.99 once. That's the whole price." + link to /pricing
6. **Comparison strip** — "What you'd pay elsewhere in a year: Otter $240, Fathom $228, Granola $180. Transcribatron: $9.99. Once."
7. **FAQ accordion (6–8 Qs)** — refund, updates, cloud costs, iCloud sync, family sharing, App Store availability
8. **Final CTA** — big "$9.99. Download for iOS & Mac." with badges
9. **Footer**

### 7.2 `/features`

Same numbered rows as landing, expanded — each section gets 2–3 sub-features, more screenshots, deeper explanation. Reuses `<FeatureRow>`.

### 7.3 `/pricing`

- Single giant centered pricing card — "$9.99 lifetime"
- What's included list (bring-your-own-API for cloud LLMs; on-device is free forever)
- Full comparison table: Transcribatron vs Otter / Fathom / Granola / Superwhisper — features + 1yr/3yr/lifetime cost
- Refund policy note (App Store standard)
- FAQ about pricing (updates? family sharing? education discount?)

### 7.4 `/download`

- Two big cards: iPhone/iPad (App Store badge + QR code) and Mac (Mac App Store badge)
- System requirements per platform (iOS 26+, macOS 15+, Apple Silicon recommended)
- Screenshot of "first run" experience so users know what to expect

### 7.5 `/blog`

- **Index:** hero ("Notes on transcription, meetings, and voice."); featured post card; grid of post cards (title, excerpt, date, read time, cover image)
- **Post:** `[slug]` — cover image, title, author, date, PortableText body, related posts at bottom
- RSS at `/blog/rss.xml`
- Optional post categories (Product updates, Meeting tips, Privacy)

### 7.6 `/docs`

- **Index:** section-grouped list (Getting Started, Recording Meetings, Transcription, Cleanup & Analysis, Integrations, Privacy, Troubleshooting)
- **Article:** `[slug]` — sidebar TOC (auto-generated from headings), main body, next/prev links
- Search deferred to post-launch

### 7.7 `/support`

- Contact options (email, GitHub issues if public, X/Twitter)
- Top FAQ (short accordion)
- Link to /docs
- "Report a bug" / "Request a feature" callouts

### 7.8 `/privacy` and `/terms`

App Store-compliant templates drafted based on Transcribatron's actual data practices (on-device by default, optional API keys stored in Keychain, no telemetry).

⚠️ **Must be reviewed by a lawyer before launch.** Flagged in launch checklist.

## 8. SEO strategy

### 8.1 Metadata

Per-page via Next.js 16 `generateMetadata`:
- Unique `title` + `description` per route, template `%s | Transcribatron`
- Canonical URL every page
- Open Graph + Twitter Card tags
- `alternates` for RSS on blog

### 8.2 Dynamic OG images

`opengraph-image.tsx` per route generates 1200×630 branded images at build time via Image Response API. Blog posts get a template with title + author overlaid.

### 8.3 JSON-LD structured data

Via `<script type="application/ld+json">`:
- Sitewide: `Organization`, `WebSite` (with `SearchAction`)
- `/`, `/pricing`, `/download`: `SoftwareApplication` + `Product` with `offers` ($9.99 USD)
- Blog posts: `Article`
- Docs: `TechArticle` + `BreadcrumbList`
- `/support` + FAQ sections: `FAQPage`

### 8.4 Sitemap + robots

- `src/app/sitemap.ts` — pulls Sanity slugs at build/revalidate time, includes all routes with `lastModified` + priority
- `src/app/robots.ts` — allow-all, disallow `/api/`, link to sitemap

### 8.5 On-page discipline (enforced by components)

- One `<h1>` per page; `<Section>` uses `<h2>` by default
- Every image `alt` required (TS error if missing)
- Semantic HTML — `<article>`, `<nav>`, `<main>`, `<section>`
- Every blog/doc page ends with "Related" links (Sanity-driven)

### 8.6 Core Web Vitals targets

- LCP < 2.0s, CLS < 0.05, INP < 200ms
- All fonts via `next/font` with `display: swap`, preloaded
- Above-the-fold images `priority`, else lazy
- No render-blocking JS on marketing pages (static)

### 8.7 Keyword strategy (informs copy)

- Primary: "transcription app", "meeting transcription iOS", "on-device transcription", "one-time transcription app", "otter alternative"
- Secondary (blog clusters): "how to transcribe meetings on Mac", "privacy-first voice to text", "speaker identification transcription"

## 9. Sanity content model

Studio in `sanity/` folder (separate deployable). Six schemas:

| Schema | Fields |
|---|---|
| `post` | title, slug, excerpt, coverImage, author (ref), publishedAt, category (ref), body (PortableText), seo (title/desc/ogImage overrides) |
| `docArticle` | title, slug, section (ref), order (number), body (PortableText), lastReviewed, seo |
| `docSection` | title, slug, order, icon |
| `category` | title, slug, description |
| `author` | name, avatar, bio, twitter, website |
| `siteSettings` | siteName, defaultOgImage, socials[], footerLinks[], currentVersion, appStoreUrl, macAppStoreUrl |

**Why `siteSettings`:** App Store URLs live here. When apps go live, paste URLs into Sanity and the whole site updates — no code change, no redeploy.

**PortableText renderers** in `src/components/content/` — CodeBlock (Shiki), Callout, InlineScreenshot, plus standard block/mark serializers. Adding a block type = one file.

**Type safety:** `sanity-typegen` → TS types from schemas → typed GROQ queries.

## 10. Analytics

- **Vercel Analytics** — page views, top routes, referrers. Zero-config, no cookies.
- **Vercel Speed Insights** — real-user Core Web Vitals.
- **One custom event:** `cta_appstore_click` (with `page` and `position` properties — hero/features/pricing/footer)
- No GA4, no Meta Pixel, no third-party trackers.

## 11. Deployment

- **Vercel** — auto-deploy on push to `main`, preview deploys on PRs
- **Env vars** (via `vercel env`):
  - `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_READ_TOKEN` (server-only)
  - `SANITY_REVALIDATE_SECRET` (webhook auth)
  - `NEXT_PUBLIC_SITE_URL` (used in metadata, sitemap, OG images)
- **Sanity webhook** → `POST /api/revalidate` (secret-gated) → `revalidateTag('posts')` / `revalidateTag('docs')` → new content in seconds
- **Domain** — TBD (launch-day task, out of scope for design phase)
- **vercel.ts** for config (rewrites, headers, cron if needed) — not `vercel.json`

## 12. Testing strategy (proportional)

**What we test:**
1. **Lighthouse CI in GitHub Actions** on every PR — budgets: LCP < 2s, CLS < 0.05, TBT < 200ms, Lighthouse SEO ≥ 98, a11y ≥ 95. PR fails on regression.
2. **Playwright smoke test** (~10 tests) — every route renders, no console errors, meta tags present, App Store links present on landing/pricing/download
3. **Vitest unit tests** for the two things with real logic: `revalidate` API route (secret auth, tag invalidation), `sitemap.ts` (Sanity slugs included)
4. **Type checking** — `tsc --noEmit` in CI

**What we don't test:** component snapshots (churn without value), visual regression (add later if needed), Sanity Studio itself (Sanity's product).

## 13. Accessibility

- shadcn primitives are a11y-first (focus rings, ARIA, keyboard nav)
- Colour contrast: every text/bg pair WCAG AA
- Keyboard nav manually verified before launch
- `prefers-reduced-motion` honored on the one CSS transition with motion

## 14. Launch checklist (becomes a runbook)

- [ ] Sanity Studio deployed + populated with initial blog posts (3–5) and docs (10–15)
- [ ] Real App Store + Mac App Store URLs pasted into `siteSettings`
- [ ] Real screenshots swapped in for placeholders
- [ ] Legal pages reviewed by a lawyer
- [ ] Domain live on Vercel, `www` → apex redirect, HTTPS
- [ ] Sanity webhook secret set, webhook configured
- [ ] Google Search Console verified, sitemap submitted
- [ ] Bing Webmaster Tools verified
- [ ] Lighthouse budgets green on `main`

## 15. Out of scope (deliberate, revisit post-launch)

- Dark mode
- Framer Motion / scroll-triggered animations
- Newsletter / email capture / Resend
- GA4, Meta Pixel, or any third-party tracking
- Docs search (Algolia / DocSearch / client-side fuse.js)
- i18n / multilingual content
- Blog comments
- User authentication (nothing to log into)
- A/B testing framework

Adding any of these later should be a component / integration swap — the architecture accommodates them without rewrites.
