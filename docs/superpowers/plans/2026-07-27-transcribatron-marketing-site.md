# Transcribatron Marketing Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a fast, SEO-optimized marketing website for Transcribatron (marketing pages + Sanity-driven blog + docs) in time for the App Store launch the week of 2026-08-03.

**Architecture:** Next.js 16 App Router with fully-static marketing pages + on-demand-revalidated Sanity content. Component-first — every visual section is a reusable component; every design token lives in one place. shadcn/ui primitives, Tailwind v4, lucide icons, Vercel hosting.

**Tech Stack:** Next.js 16.2.12, React 19.2.4, TypeScript strict, Tailwind v4, shadcn/ui, lucide-react, Sanity (embedded Studio at `/studio`), `next-sanity`, Shiki (code highlighting), Vercel Analytics + Speed Insights, Vitest, Playwright, Lighthouse CI, Node 24.

## Global Constraints

- **Framework:** Next.js 16.2.12 App Router. **This is NOT the Next.js you know** (per `AGENTS.md`) — APIs may differ from training. Read the relevant guide in `node_modules/next/dist/docs/` before writing any Next-specific code. Heed deprecation notices.
- **Styling:** Tailwind v4 (no v3 patterns). No raw hex codes in JSX — every color reference goes through a Tailwind token (`bg-accent`, `text-ink`, etc.).
- **Component discipline:** Every visual section is its own component in `src/components/marketing/` or `src/components/content/`. Design tokens in `tailwind.config.ts`. Fonts declared once in `src/app/layout.tsx` via `next/font` and exposed as `font-sans`/`font-serif`.
- **TypeScript strict.** No `any`. Every image has an `alt` prop (required, TS error if missing).
- **SEO discipline:** Exactly one `<h1>` per page. Semantic HTML (`<article>`, `<nav>`, `<main>`, `<section>`). Every route has unique metadata via `generateMetadata`.
- **Hero copy angle:** "Say more. Spend less." — the one-time-pay wedge leads. Concrete numbers over adjectives. Never lead with "AI-powered".
- **Brand color:** `#FF6B00` (from the app). Warm cream `#FAF8F3` / warm ink `#151510`. Dark mode deferred.
- **App status:** App Store launch is imminent — App Store URLs live in `siteSettings` (Sanity) and are `null` until launch. All `<AppStoreBadge>` instances must render gracefully when the URL is missing (disabled with "Coming soon" state).
- **Out of scope:** dark mode, Framer Motion, newsletter/Resend, GA4, docs search, i18n. Do not add these.
- **Commits:** Small, frequent, one per task step where sensible. Commit messages in imperative present tense (`feat: add hero component`).
- **Testing philosophy (proportional):** TDD only where there is real logic (Sanity fetching, revalidate route, sitemap generation, PortableText serializers). For pure-layout components, Playwright smoke tests are the test. No component snapshot tests, no visual regression tools.

## Milestones (executive summary)

1. **Foundation** (Tasks 1–4): design tokens, fonts, shadcn primitives, root layout shell, testing infrastructure
2. **Component library** (Tasks 5–9): layout primitives, `Screenshot`, `AppStoreBadge`, `QrCode`, `Nav`, `Footer`
3. **Marketing sections + landing page** (Tasks 10–14): `Hero`, `TrustStrip`, `FeatureRow`, `PricingCard`, `ComparisonTable`, `FaqAccordion`, `Testimonial`, `CtaBanner`; assemble `/`
4. **Other marketing pages** (Tasks 15–17): `/features`, `/pricing`, `/download`, `/support`, `/privacy`, `/terms`
5. **Sanity + dynamic content** (Tasks 18–22): embedded Studio, schemas, typed client, PortableText, `/blog`, `/docs`, revalidate webhook
6. **SEO, ops, launch** (Tasks 23–25): metadata + JSON-LD + OG images + sitemap + RSS, Vercel Analytics + `vercel.ts`, Playwright + Lighthouse CI + copy pass

The site is deployable after Milestone 4 (marketing pages work, no blog/docs yet). Milestone 6 completes the launch checklist.

---

## File Structure

```
transcribatronweb/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                    root shell (fonts, nav, footer, analytics)
│  │  ├─ page.tsx                      /
│  │  ├─ globals.css                   Tailwind + base styles
│  │  ├─ features/page.tsx
│  │  ├─ pricing/page.tsx
│  │  ├─ download/page.tsx
│  │  ├─ blog/
│  │  │  ├─ page.tsx                   /blog index
│  │  │  ├─ queries.ts                 GROQ queries for /blog
│  │  │  ├─ [slug]/page.tsx            individual post
│  │  │  └─ rss.xml/route.ts           RSS feed
│  │  ├─ docs/
│  │  │  ├─ page.tsx                   /docs index
│  │  │  ├─ queries.ts                 GROQ queries for /docs
│  │  │  └─ [slug]/page.tsx            individual article
│  │  ├─ support/page.tsx
│  │  ├─ privacy/page.tsx
│  │  ├─ terms/page.tsx
│  │  ├─ studio/[[...tool]]/page.tsx   embedded Sanity Studio
│  │  ├─ sitemap.ts                    dynamic sitemap
│  │  ├─ robots.ts                     robots.txt
│  │  ├─ opengraph-image.tsx           default OG image
│  │  └─ api/
│  │     └─ revalidate/route.ts        Sanity webhook target
│  ├─ components/
│  │  ├─ ui/                           shadcn primitives (button, badge, card, accordion, dialog, tabs)
│  │  ├─ layout/
│  │  │  ├─ Container.tsx
│  │  │  ├─ Section.tsx
│  │  │  ├─ Grid.tsx
│  │  │  └─ PageHeader.tsx
│  │  ├─ marketing/
│  │  │  ├─ Nav.tsx
│  │  │  ├─ Footer.tsx
│  │  │  ├─ Hero.tsx
│  │  │  ├─ TrustStrip.tsx
│  │  │  ├─ FeatureRow.tsx
│  │  │  ├─ PricingCard.tsx
│  │  │  ├─ ComparisonTable.tsx
│  │  │  ├─ FaqAccordion.tsx
│  │  │  ├─ Testimonial.tsx
│  │  │  ├─ CtaBanner.tsx
│  │  │  ├─ AppStoreBadge.tsx
│  │  │  ├─ Screenshot.tsx
│  │  │  └─ QrCode.tsx
│  │  ├─ content/
│  │  │  ├─ PortableText.tsx
│  │  │  ├─ CodeBlock.tsx
│  │  │  ├─ Callout.tsx
│  │  │  └─ InlineScreenshot.tsx
│  │  ├─ seo/
│  │  │  ├─ JsonLd.tsx
│  │  │  └─ metadata.ts
│  │  └─ analytics/
│  │     └─ AppStoreClickTracker.tsx
│  ├─ lib/
│  │  ├─ sanity.ts                     client + fetch helpers
│  │  ├─ sanity-image.ts               next/image loader for Sanity CDN
│  │  ├─ site-config.ts                constants (competitors, feature copy)
│  │  └─ utils.ts                      cn() helper
│  └─ sanity/
│     ├─ schemas/
│     │  ├─ index.ts
│     │  ├─ post.ts
│     │  ├─ docArticle.ts
│     │  ├─ docSection.ts
│     │  ├─ category.ts
│     │  ├─ author.ts
│     │  └─ siteSettings.ts
│     └─ studio-config.ts              Sanity Studio config
├─ sanity.types.ts                     sanity-typegen output (generated)
├─ tests/
│  ├─ smoke.spec.ts                    Playwright route smoke tests
│  └─ unit/
│     ├─ sanity.test.ts
│     ├─ revalidate.test.ts
│     ├─ sitemap.test.ts
│     └─ portable-text.test.tsx
├─ .github/workflows/
│  ├─ ci.yml                           lint + typecheck + vitest + playwright
│  └─ lighthouse.yml                   Lighthouse CI on PRs
├─ tailwind.config.ts
├─ vercel.ts
├─ playwright.config.ts
├─ vitest.config.ts
└─ .env.example
```

---

## Task 1: Design tokens, fonts, and base styles

**Files:**
- Create: `tailwind.config.ts`
- Create: `src/lib/utils.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `package.json` (add `clsx`, `tailwind-merge`, `@fontsource-variable/inter`, `@fontsource/instrument-serif`)

**Interfaces:**
- Produces: Tailwind class tokens (`bg`, `surface`, `surface-2`, `ink`, `ink-2`, `ink-3`, `accent`, `accent-soft`, `sep`, `positive`, `warning`); font families `font-sans` and `font-serif`; `cn()` utility for class merging.

- [ ] **Step 1: Install dependencies**

```bash
npm install clsx tailwind-merge
npm install @fontsource-variable/inter @fontsource/instrument-serif
```

- [ ] **Step 2: Create `src/lib/utils.ts`**

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Create `tailwind.config.ts` with design tokens**

Read `node_modules/next/dist/docs/01-app/02-guides/tailwind.md` (or nearest equivalent) first — Tailwind v4 configures differently from v3. This project uses `@tailwindcss/postcss` already.

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#FAF8F3",
        surface: "#FFFFFF",
        "surface-2": "#F3EFE7",
        ink: "#151510",
        "ink-2": "#4A4740",
        "ink-3": "#8A867E",
        accent: "#FF6B00",
        "accent-soft": "#FFF1E5",
        sep: "#EAE5DB",
        positive: "#2E7D5B",
        warning: "#B45309",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      maxWidth: {
        container: "72rem",
      },
      borderRadius: {
        "2xl": "1.25rem",
      },
      fontSize: {
        "hero-mobile": ["3rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "hero": ["5rem", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 4: Update `src/app/globals.css`**

Replace file contents:

```css
@import "tailwindcss";

@layer base {
  :root {
    --font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
    --font-serif: "Instrument Serif", Georgia, serif;
  }

  html {
    scroll-behavior: smooth;
    color-scheme: light;
  }

  body {
    background-color: #FAF8F3;
    color: #151510;
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  ::selection {
    background-color: #FFF1E5;
    color: #151510;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.001ms !important;
      transition-duration: 0.001ms !important;
    }
  }
}
```

- [ ] **Step 5: Wire fonts into `src/app/layout.tsx`**

Replace existing file:

```tsx
import "@fontsource-variable/inter";
import "@fontsource/instrument-serif";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Transcribatron — Say more. Spend less.",
    template: "%s | Transcribatron",
  },
  description:
    "Transcribe meetings, dictations and imports on your iPhone and Mac. Pay once. No subscription.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-sans">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Verify dev server boots and shows the color/font tokens**

```bash
npm run dev
```

Open `http://localhost:3000` — should show the default Next page in the new font/colors. No errors in console.

- [ ] **Step 7: Commit**

```bash
git add tailwind.config.ts src/lib/utils.ts src/app/globals.css src/app/layout.tsx package.json package-lock.json
git commit -m "feat: design tokens, fonts, and base layout"
```

---

## Task 2: shadcn/ui primitives (brand-restyled)

**Files:**
- Create: `components.json` (shadcn config)
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/accordion.tsx`
- Create: `src/components/ui/dialog.tsx`
- Create: `src/components/ui/tabs.tsx`
- Modify: `package.json` (adds `@radix-ui/*` deps via shadcn CLI)

**Interfaces:**
- Produces: `<Button variant="default|outline|ghost|link" size="sm|md|lg">`, `<Badge variant="default|accent|outline">`, `<Card>`, `<Accordion>`, `<Dialog>`, `<Tabs>`.

- [ ] **Step 1: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

When prompted:
- Style: default
- Base color: neutral (we'll override with our tokens)
- CSS variables: no (we use Tailwind tokens directly)

- [ ] **Step 2: Add the primitives we'll use**

```bash
npx shadcn@latest add button badge card accordion dialog tabs
```

- [ ] **Step 3: Rewrite `src/components/ui/button.tsx` to use brand tokens**

The shadcn default uses generic `primary`/`secondary` colors. Restyle to our tokens:

```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-ink text-bg hover:bg-ink-2",
        accent: "bg-accent text-bg hover:bg-accent/90",
        outline:
          "border border-sep bg-transparent text-ink hover:bg-surface-2",
        ghost: "text-ink hover:bg-surface-2",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
```

- [ ] **Step 4: Restyle `src/components/ui/badge.tsx`**

```tsx
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const styles = {
    default: "bg-surface-2 text-ink-2",
    accent: "bg-accent-soft text-accent",
    outline: "border border-sep text-ink-2",
  }[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        styles,
        className
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 5: Restyle `src/components/ui/card.tsx`, `accordion.tsx`, `dialog.tsx`, `tabs.tsx`**

Replace any shadcn default color classes (`bg-primary`, `text-primary-foreground`, etc.) with our tokens (`bg-surface`, `text-ink`, `border-sep`). Keep the primitive structure — only classNames change. Reference the shadcn source generated in your `src/components/ui/*.tsx` files.

- [ ] **Step 6: Verify the primitives render**

Create a temporary `src/app/page.tsx` visual test:

```tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="p-10 space-y-4">
      <Button>Default</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="outline">Outline</Button>
      <Badge variant="accent">Beta</Badge>
    </main>
  );
}
```

Run `npm run dev`, verify buttons render with correct colors. Discard `page.tsx` changes after (they'll be overwritten in Task 14).

- [ ] **Step 7: Commit**

```bash
git add components.json src/components/ui/ package.json package-lock.json
git commit -m "feat: shadcn/ui primitives restyled to brand tokens"
```

---

## Task 3: Testing infrastructure (Vitest + Playwright + Lighthouse CI scaffolding)

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `playwright.config.ts`
- Create: `tests/smoke.spec.ts`
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/lighthouse.yml`
- Create: `.lighthouserc.json`
- Modify: `package.json` (add `test`, `test:e2e`, `test:unit` scripts; devDeps: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@playwright/test`, `@lhci/cli`)

**Interfaces:**
- Produces: `npm test` (all), `npm run test:unit` (Vitest), `npm run test:e2e` (Playwright). CI runs on every PR.

- [ ] **Step 1: Install test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @playwright/test @lhci/cli
npx playwright install --with-deps chromium
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

- [ ] **Step 3: Create `tests/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: /.*\.spec\.ts/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 5: Create initial smoke test `tests/smoke.spec.ts`**

Placeholder — will be extended as routes come online. For now assert the root route:

```ts
import { test, expect } from "@playwright/test";

test("home page renders", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto("/");
  await expect(page).toHaveTitle(/Transcribatron/);
  expect(errors).toEqual([]);
});
```

- [ ] **Step 6: Add package.json scripts**

Add to `scripts`:

```json
"test": "npm run test:unit && npm run test:e2e",
"test:unit": "vitest run",
"test:unit:watch": "vitest",
"test:e2e": "playwright test",
"typecheck": "tsc --noEmit"
```

- [ ] **Step 7: Create `.github/workflows/ci.yml`**

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:unit
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
```

- [ ] **Step 8: Create `.lighthouserc.json`**

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run start",
      "url": ["http://localhost:3000/"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.98 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.05 }]
      }
    }
  }
}
```

- [ ] **Step 9: Create `.github/workflows/lighthouse.yml`**

```yaml
name: Lighthouse
on:
  pull_request:

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: npm }
      - run: npm ci
      - run: npm run build
      - run: npx lhci autorun
```

- [ ] **Step 10: Verify tests run locally**

```bash
npm run test:unit
npm run test:e2e
```

Expected: both pass. Playwright will build and boot the app before running.

- [ ] **Step 11: Commit**

```bash
git add vitest.config.ts tests/ playwright.config.ts .github/workflows/ .lighthouserc.json package.json package-lock.json
git commit -m "test: add vitest + playwright + lighthouse CI"
```

---

## Task 4: Layout primitives — Container, Section, Grid, PageHeader

**Files:**
- Create: `src/components/layout/Container.tsx`
- Create: `src/components/layout/Section.tsx`
- Create: `src/components/layout/Grid.tsx`
- Create: `src/components/layout/PageHeader.tsx`

**Interfaces:**
- Produces:
  - `<Container>{children}</Container>` — max-width wrapper with responsive padding
  - `<Section as="section" variant="default|alt" title? eyebrow? id?>{children}</Section>` — vertical rhythm + h2 by default
  - `<Grid cols={2|3|4}>` — responsive grid
  - `<PageHeader title subtitle?>` — top-of-page hero-ette for non-landing pages

- [ ] **Step 1: `src/components/layout/Container.tsx`**

```tsx
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow";
}

export function Container({ className, size = "default", ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-6 md:px-8 w-full",
        size === "narrow" ? "max-w-3xl" : "max-w-container",
        className
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 2: `src/components/layout/Section.tsx`**

```tsx
import { cn } from "@/lib/utils";
import { Container } from "./Container";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "alt";
  title?: string;
  eyebrow?: string;
  titleAs?: "h1" | "h2";
}

export function Section({
  className,
  variant = "default",
  title,
  eyebrow,
  titleAs = "h2",
  children,
  ...props
}: SectionProps) {
  const TitleTag = titleAs;
  return (
    <section
      className={cn(
        "py-20 md:py-28",
        variant === "alt" ? "bg-surface-2" : "bg-bg",
        className
      )}
      {...props}
    >
      <Container>
        {(eyebrow || title) && (
          <header className="mb-12 md:mb-16 max-w-2xl">
            {eyebrow && (
              <div className="text-sm font-medium text-accent mb-3 tracking-wide uppercase">
                {eyebrow}
              </div>
            )}
            {title && (
              <TitleTag className="text-4xl md:text-5xl font-semibold tracking-tight text-ink">
                {title}
              </TitleTag>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: `src/components/layout/Grid.tsx`**

```tsx
import { cn } from "@/lib/utils";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 2 | 3 | 4;
}

export function Grid({ className, cols = 3, ...props }: GridProps) {
  const colClass = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[cols];
  return (
    <div className={cn("grid grid-cols-1 gap-6 md:gap-8", colClass, className)} {...props} />
  );
}
```

- [ ] **Step 4: `src/components/layout/PageHeader.tsx`**

```tsx
import { Container } from "./Container";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="pt-32 pb-16 md:pt-40 md:pb-24">
      <Container>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-ink max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-lg md:text-xl text-ink-2 max-w-2xl">{subtitle}</p>
        )}
      </Container>
    </header>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/
git commit -m "feat: layout primitives (Container, Section, Grid, PageHeader)"
```

---

## Task 5: Screenshot component (placeholder + real modes)

**Files:**
- Create: `src/components/marketing/Screenshot.tsx`
- Create: `tests/unit/screenshot.test.tsx`

**Interfaces:**
- Produces: `<Screenshot device="iphone" | "mac" src? alt caption?>` — required `alt` (TS error if missing). Renders styled placeholder if `src` is absent.

- [ ] **Step 1: Write the failing test `tests/unit/screenshot.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Screenshot } from "@/components/marketing/Screenshot";

describe("Screenshot", () => {
  it("renders placeholder when src is missing", () => {
    render(<Screenshot device="iphone" alt="App home screen" />);
    expect(screen.getByRole("img", { name: /app home screen/i })).toBeInTheDocument();
    expect(screen.getByTestId("screenshot-placeholder")).toBeInTheDocument();
  });

  it("renders real image when src is provided", () => {
    render(
      <Screenshot device="mac" src="/screenshots/home.png" alt="Mac app home" />
    );
    const img = screen.getByRole("img", { name: /mac app home/i });
    expect(img).toHaveAttribute("src", expect.stringContaining("home.png"));
    expect(screen.queryByTestId("screenshot-placeholder")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npm run test:unit -- screenshot
```

Expected: fails ("Cannot find module '@/components/marketing/Screenshot'").

- [ ] **Step 3: Implement `src/components/marketing/Screenshot.tsx`**

```tsx
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ScreenshotProps {
  device: "iphone" | "mac";
  alt: string; // REQUIRED
  src?: string;
  caption?: string;
  className?: string;
  priority?: boolean;
}

export function Screenshot({ device, src, alt, caption, className, priority }: ScreenshotProps) {
  const isIphone = device === "iphone";
  const frame = isIphone
    ? "aspect-[9/19.5] rounded-[2.5rem] border-8 border-ink"
    : "aspect-[16/10] rounded-2xl border border-sep";

  return (
    <figure className={cn("group", className)}>
      <div
        className={cn(
          "relative overflow-hidden bg-surface transition-transform duration-300",
          "motion-safe:group-hover:rotate-[-1deg]",
          frame
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={isIphone ? "(min-width: 768px) 320px, 240px" : "(min-width: 768px) 720px, 100vw"}
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div
            data-testid="screenshot-placeholder"
            role="img"
            aria-label={alt}
            className="absolute inset-0 flex flex-col p-6 bg-gradient-to-br from-surface to-surface-2"
          >
            <div className="h-2 w-24 rounded-full bg-accent/40 mb-4" />
            <div className="space-y-2">
              <div className="h-3 w-3/4 rounded-full bg-ink/10" />
              <div className="h-3 w-2/3 rounded-full bg-ink/10" />
              <div className="h-3 w-5/6 rounded-full bg-ink/10" />
            </div>
            <div className="mt-auto text-[10px] uppercase tracking-widest text-ink-3">
              {device} preview
            </div>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-ink-3 text-center">{caption}</figcaption>
      )}
    </figure>
  );
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm run test:unit -- screenshot
```

Expected: both tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/marketing/Screenshot.tsx tests/unit/screenshot.test.tsx
git commit -m "feat: Screenshot component with placeholder + real modes"
```

---

## Task 6: AppStoreBadge + QrCode

**Files:**
- Create: `src/components/marketing/AppStoreBadge.tsx`
- Create: `src/components/marketing/QrCode.tsx`
- Create: `src/components/analytics/AppStoreClickTracker.tsx`
- Modify: `package.json` (adds `qrcode.react`, `@vercel/analytics`)

**Interfaces:**
- Produces:
  - `<AppStoreBadge platform="ios" | "mac" href? className?>` — renders SVG badge, disabled state if `href` is null, tracks click via analytics
  - `<QrCode value size?>` — renders QR code
  - `AppStoreClickTracker` — helper hook/wrapper for `cta_appstore_click` event

- [ ] **Step 1: Install deps**

```bash
npm install qrcode.react @vercel/analytics
```

- [ ] **Step 2: Create SVG badges as components (public-domain Apple-style)**

Apple's official App Store badge SVGs live at Apple's marketing resources. For this task, use inline SVG replicas that respect Apple's guidelines (rounded rect, "Download on the App Store" / "Download on the Mac App Store" text). Store SVGs inline in the component — no external dependency.

- [ ] **Step 3: `src/components/marketing/AppStoreBadge.tsx`**

```tsx
"use client";
import { track } from "@vercel/analytics/react";
import { cn } from "@/lib/utils";

interface AppStoreBadgeProps {
  platform: "ios" | "mac";
  href?: string | null;
  position?: string;
  className?: string;
}

export function AppStoreBadge({ platform, href, position = "unknown", className }: AppStoreBadgeProps) {
  const label = platform === "ios" ? "Download on the App Store" : "Download on the Mac App Store";
  const disabled = !href;

  const badge = (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-2xl bg-ink text-bg px-5 py-3 transition",
        !disabled && "hover:bg-ink-2",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <AppleGlyph platform={platform} className="w-8 h-8" />
      <div className="text-left leading-tight">
        <div className="text-[10px] uppercase tracking-wide opacity-80">
          {disabled ? "Coming soon" : platform === "ios" ? "Download on the" : "Download on the"}
        </div>
        <div className="text-lg font-semibold">
          {platform === "ios" ? "App Store" : "Mac App Store"}
        </div>
      </div>
    </div>
  );

  if (disabled) {
    return <div aria-label={`${label} — coming soon`}>{badge}</div>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      onClick={() => track("cta_appstore_click", { platform, position })}
    >
      {badge}
    </a>
  );
}

function AppleGlyph({ platform, className }: { platform: "ios" | "mac"; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.04c-.03-2.86 2.34-4.24 2.44-4.31-1.33-1.95-3.4-2.22-4.14-2.25-1.76-.18-3.44 1.04-4.34 1.04-.9 0-2.28-1.01-3.75-.98-1.93.03-3.72 1.13-4.71 2.86-2.01 3.48-.52 8.63 1.44 11.46.96 1.38 2.11 2.94 3.61 2.88 1.45-.06 2-.94 3.75-.94 1.75 0 2.24.94 3.77.9 1.56-.03 2.55-1.4 3.5-2.79 1.11-1.6 1.56-3.16 1.58-3.24-.03-.01-3.03-1.16-3.06-4.63zM14.44 3.44c.8-.97 1.34-2.32 1.19-3.66-1.15.05-2.55.77-3.38 1.73-.74.87-1.39 2.24-1.22 3.55 1.29.1 2.6-.65 3.41-1.62z" />
    </svg>
  );
}
```

- [ ] **Step 4: `src/components/marketing/QrCode.tsx`**

```tsx
"use client";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface QrCodeProps {
  value: string;
  size?: number;
  className?: string;
  label?: string;
}

export function QrCode({ value, size = 160, className, label }: QrCodeProps) {
  return (
    <div className={cn("inline-flex flex-col items-center gap-2", className)}>
      <div className="bg-bg p-3 rounded-2xl border border-sep">
        <QRCodeSVG
          value={value}
          size={size}
          bgColor="transparent"
          fgColor="#151510"
          level="M"
        />
      </div>
      {label && <div className="text-xs text-ink-3">{label}</div>}
    </div>
  );
}
```

- [ ] **Step 5: Wire Vercel Analytics into root layout**

Modify `src/app/layout.tsx` — add `<Analytics />` and `<SpeedInsights />` before `</body>`:

```tsx
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
// ...existing...

// In the body:
<body>
  {children}
  <Analytics />
  <SpeedInsights />
</body>
```

Install if not present:

```bash
npm install @vercel/speed-insights
```

- [ ] **Step 6: Commit**

```bash
git add src/components/marketing/AppStoreBadge.tsx src/components/marketing/QrCode.tsx src/app/layout.tsx package.json package-lock.json
git commit -m "feat: AppStoreBadge, QrCode, and analytics wiring"
```

---

## Task 7: Nav + Footer

**Files:**
- Create: `src/components/marketing/Nav.tsx`
- Create: `src/components/marketing/Footer.tsx`
- Create: `src/lib/site-config.ts`
- Modify: `src/app/layout.tsx` (mount Nav + Footer around `{children}`)

**Interfaces:**
- Consumes: `Button`, `Container`, `site-config` constants
- Produces: sitewide chrome — top nav and footer that appear on every route

- [ ] **Step 1: Create `src/lib/site-config.ts`**

Central constants that don't warrant a Sanity trip yet. Sanity `siteSettings` will eventually override the App Store URLs; everything else stays here.

```ts
export const siteConfig = {
  name: "Transcribatron",
  tagline: "Say more. Spend less.",
  description:
    "Transcribe meetings, dictations and imports on your iPhone and Mac. Pay once. No subscription.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://transcribatron.com",
  price: {
    amount: 9.99,
    currency: "USD",
    displayShort: "$9.99",
    displayLong: "$9.99 once — no subscription",
  },
  nav: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/docs", label: "Docs" },
    { href: "/support", label: "Support" },
  ],
  footer: {
    product: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/download", label: "Download" },
    ],
    resources: [
      { href: "/blog", label: "Blog" },
      { href: "/docs", label: "Docs" },
      { href: "/support", label: "Support" },
    ],
    legal: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
  socials: {
    x: "https://x.com/transcribatron",
    github: null as string | null,
  },
  competitors: [
    { name: "Otter", perMonth: 20, perYear: 240 },
    { name: "Fathom", perMonth: 19, perYear: 228 },
    { name: "Granola", perMonth: 15, perYear: 180 },
  ],
} as const;
```

- [ ] **Step 2: `src/components/marketing/Nav.tsx`**

```tsx
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-bg/80 border-b border-sep">
      <Container>
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="font-semibold tracking-tight text-ink">
            {siteConfig.name}
          </Link>
          <ul className="hidden md:flex items-center gap-8 text-sm text-ink-2">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-ink transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild variant="accent" size="sm">
            <Link href="/download">Download</Link>
          </Button>
        </nav>
      </Container>
    </header>
  );
}
```

- [ ] **Step 3: `src/components/marketing/Footer.tsx`**

```tsx
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-sep bg-bg py-16">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="font-semibold text-ink">{siteConfig.name}</div>
            <p className="mt-2 text-sm text-ink-3 max-w-xs">{siteConfig.tagline}</p>
          </div>
          <FooterColumn title="Product" links={siteConfig.footer.product} />
          <FooterColumn title="Resources" links={siteConfig.footer.resources} />
          <FooterColumn title="Legal" links={siteConfig.footer.legal} />
        </div>
        <div className="mt-12 pt-8 border-t border-sep flex items-center justify-between text-sm text-ink-3">
          <div>© {year} {siteConfig.name}</div>
          {siteConfig.socials.x && (
            <a
              href={siteConfig.socials.x}
              className="hover:text-ink transition-colors"
              target="_blank"
              rel="noopener"
            >
              @transcribatron
            </a>
          )}
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <div>
      <div className="text-sm font-medium text-ink mb-3">{title}</div>
      <ul className="space-y-2 text-sm text-ink-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-ink transition-colors">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: Mount Nav + Footer in `src/app/layout.tsx`**

```tsx
// Inside <body>, wrap children:
<body>
  <Nav />
  <main>{children}</main>
  <Footer />
  <Analytics />
  <SpeedInsights />
</body>
```

Add imports at top.

- [ ] **Step 5: Commit**

```bash
git add src/lib/site-config.ts src/components/marketing/Nav.tsx src/components/marketing/Footer.tsx src/app/layout.tsx
git commit -m "feat: sitewide nav and footer"
```

---

## Task 8: Hero + TrustStrip

**Files:**
- Create: `src/components/marketing/Hero.tsx`
- Create: `src/components/marketing/TrustStrip.tsx`

**Interfaces:**
- Consumes: `AppStoreBadge`, `Screenshot`, `Container`, `siteConfig`
- Produces: `<Hero appStoreUrl macAppStoreUrl>`, `<TrustStrip items>`

- [ ] **Step 1: `src/components/marketing/Hero.tsx`**

```tsx
import { Container } from "@/components/layout/Container";
import { AppStoreBadge } from "./AppStoreBadge";
import { Screenshot } from "./Screenshot";

interface HeroProps {
  appStoreUrl?: string | null;
  macAppStoreUrl?: string | null;
}

export function Hero({ appStoreUrl, macAppStoreUrl }: HeroProps) {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight text-ink">
              Say more.<br />
              <span className="text-accent">Spend less.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-ink-2 max-w-xl">
              The all-in-one voice-to-text for iPhone and Mac. Dictate anywhere,
              record meetings, transcribe imports — pay once. No subscription.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <AppStoreBadge platform="ios" href={appStoreUrl} position="hero" />
              <AppStoreBadge platform="mac" href={macAppStoreUrl} position="hero" />
            </div>
            <div className="mt-6 text-sm text-ink-3">
              $9.99 once. Free updates. On-device by default.
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <Screenshot device="mac" alt="Transcribatron on Mac" priority className="w-[500px] max-w-full" />
              <div className="absolute -bottom-8 -left-8 md:-left-16 w-32 md:w-40">
                <Screenshot device="iphone" alt="Transcribatron on iPhone" priority />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: `src/components/marketing/TrustStrip.tsx`**

```tsx
import { Container } from "@/components/layout/Container";

interface TrustStripProps {
  items: readonly string[];
}

export function TrustStrip({ items }: TrustStripProps) {
  return (
    <div className="border-y border-sep bg-surface-2 py-6">
      <Container>
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-ink-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/marketing/Hero.tsx src/components/marketing/TrustStrip.tsx
git commit -m "feat: Hero and TrustStrip components"
```

---

## Task 9: FeatureRow + CtaBanner + Testimonial

**Files:**
- Create: `src/components/marketing/FeatureRow.tsx`
- Create: `src/components/marketing/CtaBanner.tsx`
- Create: `src/components/marketing/Testimonial.tsx`

**Interfaces:**
- Consumes: `Container`, `Screenshot`, `AppStoreBadge`
- Produces:
  - `<FeatureRow number title body bullets? screenshot align="left"|"right">`
  - `<CtaBanner headline body? appStoreUrl macAppStoreUrl>`
  - `<Testimonial quote author role?>`

- [ ] **Step 1: `src/components/marketing/FeatureRow.tsx`**

```tsx
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { Screenshot } from "./Screenshot";

interface FeatureRowProps {
  number: string; // "01" - "06"
  title: string;
  body: string;
  bullets?: readonly string[];
  screenshot: { device: "iphone" | "mac"; src?: string; alt: string };
  align?: "left" | "right";
  variant?: "default" | "alt";
}

export function FeatureRow({
  number,
  title,
  body,
  bullets,
  screenshot,
  align = "left",
  variant = "default",
}: FeatureRowProps) {
  return (
    <section className={cn("py-16 md:py-24", variant === "alt" && "bg-surface-2")}>
      <Container>
        <div
          className={cn(
            "grid lg:grid-cols-2 gap-12 lg:gap-16 items-center",
            align === "right" && "lg:grid-flow-dense"
          )}
        >
          <div className={align === "right" ? "lg:col-start-2" : undefined}>
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-xs font-medium tracking-widest text-accent">
                {number}
              </span>
              <span className="h-px w-8 bg-accent/40" />
            </div>
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-ink">
              {title}
            </h3>
            <p className="mt-4 text-lg text-ink-2 max-w-lg">{body}</p>
            {bullets && (
              <ul className="mt-6 space-y-2">
                {bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 text-ink-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={cn("flex justify-center", align === "right" && "lg:col-start-1 lg:row-start-1")}>
            <Screenshot
              device={screenshot.device}
              src={screenshot.src}
              alt={screenshot.alt}
              className={screenshot.device === "iphone" ? "w-[280px]" : "w-full max-w-lg"}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: `src/components/marketing/CtaBanner.tsx`**

```tsx
import { Container } from "@/components/layout/Container";
import { AppStoreBadge } from "./AppStoreBadge";

interface CtaBannerProps {
  headline: string;
  body?: string;
  appStoreUrl?: string | null;
  macAppStoreUrl?: string | null;
  position?: string;
}

export function CtaBanner({ headline, body, appStoreUrl, macAppStoreUrl, position = "footer-cta" }: CtaBannerProps) {
  return (
    <section className="py-24 md:py-32 bg-ink text-bg">
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight">{headline}</h2>
          {body && <p className="mt-4 text-lg text-bg/80">{body}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <AppStoreBadge platform="ios" href={appStoreUrl} position={position} />
            <AppStoreBadge platform="mac" href={macAppStoreUrl} position={position} />
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 3: `src/components/marketing/Testimonial.tsx`**

```tsx
import { Container } from "@/components/layout/Container";

interface TestimonialProps {
  quote: string;
  author: string;
  role?: string;
}

export function Testimonial({ quote, author, role }: TestimonialProps) {
  return (
    <section className="py-20 md:py-28">
      <Container size="narrow">
        <blockquote className="text-center">
          <p className="font-serif text-2xl md:text-3xl leading-relaxed text-ink">
            &ldquo;{quote}&rdquo;
          </p>
          <footer className="mt-6 text-sm text-ink-3">
            — {author}
            {role && <span>, {role}</span>}
          </footer>
        </blockquote>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/marketing/FeatureRow.tsx src/components/marketing/CtaBanner.tsx src/components/marketing/Testimonial.tsx
git commit -m "feat: FeatureRow, CtaBanner, Testimonial components"
```

---

## Task 10: PricingCard + ComparisonTable + FaqAccordion

**Files:**
- Create: `src/components/marketing/PricingCard.tsx`
- Create: `src/components/marketing/ComparisonTable.tsx`
- Create: `src/components/marketing/FaqAccordion.tsx`

**Interfaces:**
- Consumes: `Card`, `Accordion` primitives, `Button`, `AppStoreBadge`
- Produces:
  - `<PricingCard price includes appStoreUrl macAppStoreUrl>`
  - `<ComparisonTable rows>` — features vs competitors with checks / crosses / cost columns
  - `<FaqAccordion items>` — `items: { q: string; a: string }[]`; renders one FAQPage JSON-LD block (JSON-LD added in Task 23)

- [ ] **Step 1: `src/components/marketing/PricingCard.tsx`**

```tsx
import { Check } from "lucide-react";
import { AppStoreBadge } from "./AppStoreBadge";

interface PricingCardProps {
  price: { display: string; caption: string };
  includes: readonly string[];
  appStoreUrl?: string | null;
  macAppStoreUrl?: string | null;
}

export function PricingCard({ price, includes, appStoreUrl, macAppStoreUrl }: PricingCardProps) {
  return (
    <div className="rounded-2xl border border-sep bg-surface p-8 md:p-12 max-w-2xl mx-auto text-center shadow-sm">
      <div className="text-sm font-medium text-accent tracking-wide uppercase">Lifetime</div>
      <div className="mt-2 font-serif text-6xl md:text-7xl text-ink">{price.display}</div>
      <div className="mt-2 text-ink-2">{price.caption}</div>

      <ul className="mt-8 space-y-3 text-left max-w-md mx-auto">
        {includes.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-ink-2">
            <Check className="w-5 h-5 text-positive shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <AppStoreBadge platform="ios" href={appStoreUrl} position="pricing" />
        <AppStoreBadge platform="mac" href={macAppStoreUrl} position="pricing" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: `src/components/marketing/ComparisonTable.tsx`**

```tsx
import { Check, X } from "lucide-react";

export interface ComparisonRow {
  feature: string;
  transcribatron: boolean | string;
  competitors: Record<string, boolean | string>;
}

interface ComparisonTableProps {
  competitorNames: readonly string[];
  rows: readonly ComparisonRow[];
}

export function ComparisonTable({ competitorNames, rows }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-sep bg-surface">
      <table className="w-full text-sm">
        <thead className="bg-surface-2">
          <tr>
            <th className="text-left p-4 font-medium text-ink">Feature</th>
            <th className="p-4 font-semibold text-accent">Transcribatron</th>
            {competitorNames.map((n) => (
              <th key={n} className="p-4 font-medium text-ink-2">{n}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-sep">
              <td className="p-4 text-ink">{row.feature}</td>
              <Cell value={row.transcribatron} highlight />
              {competitorNames.map((n) => (
                <Cell key={n} value={row.competitors[n] ?? false} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ value, highlight }: { value: boolean | string; highlight?: boolean }) {
  return (
    <td className={`p-4 text-center ${highlight ? "bg-accent-soft/50" : ""}`}>
      {typeof value === "string" ? (
        <span className="text-ink-2">{value}</span>
      ) : value ? (
        <Check className="w-5 h-5 text-positive mx-auto" />
      ) : (
        <X className="w-5 h-5 text-ink-3 mx-auto" />
      )}
    </td>
  );
}
```

- [ ] **Step 3: `src/components/marketing/FaqAccordion.tsx`**

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  items: readonly FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <Accordion type="single" collapsible className="max-w-3xl mx-auto">
      {items.map((item, i) => (
        <AccordionItem key={i} value={`item-${i}`} className="border-sep">
          <AccordionTrigger className="text-left text-lg font-medium text-ink hover:no-underline">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="text-ink-2 text-base leading-relaxed">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/marketing/PricingCard.tsx src/components/marketing/ComparisonTable.tsx src/components/marketing/FaqAccordion.tsx
git commit -m "feat: PricingCard, ComparisonTable, FaqAccordion"
```

---

## Task 11: Copy content constants for landing/features/pricing

**Files:**
- Create: `src/lib/copy/features.ts`
- Create: `src/lib/copy/faq.ts`
- Create: `src/lib/copy/comparison.ts`

**Interfaces:**
- Produces: typed const arrays consumed by pages: `featuresJourney` (6 numbered features), `landingFaq`, `pricingFaq`, `comparisonRows`.

- [ ] **Step 1: `src/lib/copy/features.ts`**

Six numbered features. Copy is a draft — user will edit but structure is locked.

```ts
export interface FeatureCopy {
  number: string;
  title: string;
  body: string;
  bullets: readonly string[];
  screenshot: { device: "iphone" | "mac"; alt: string; src?: string };
}

export const featuresJourney: readonly FeatureCopy[] = [
  {
    number: "01",
    title: "Dictate anywhere on iPhone",
    body:
      "The Transcribatron keyboard replaces any iOS keyboard. Tap once, speak, keep typing. Works in Messages, Notes, Slack, email — every app.",
    bullets: [
      "System-wide voice-to-text with punctuation",
      "Voice-edit existing text ('capitalize that', 'delete the last sentence')",
      "Custom vocabulary bias for names, jargon, acronyms",
    ],
    screenshot: { device: "iphone", alt: "Transcribatron keyboard dictating into Notes" },
  },
  {
    number: "02",
    title: "Record meetings, get more than a transcript",
    body:
      "Hit record. Meeting Buddy listens in the background and gives you real-time coaching — angles you missed, questions to ask, moments to circle back to.",
    bullets: [
      "Personas: Negotiator, Reporter, Therapist, Closer, and more",
      "Auto-links to your calendar event and attendees",
      "Runs on-device — nothing is uploaded",
    ],
    screenshot: { device: "iphone", alt: "Meeting Buddy live coaching a call" },
  },
  {
    number: "03",
    title: "Know who's talking",
    body:
      "Speaker diarization labels each voice, and voiceprint enrollment remembers people. Meet Sarah once and she's 'Sarah' in every future meeting.",
    bullets: [
      "Auto-labels 'Speaker 1', 'Speaker 2' out of the box",
      "Enroll named voiceprints with a 15-second sample",
      "Reidentifies across meetings without cloud upload",
    ],
    screenshot: { device: "mac", alt: "Transcript with named speaker labels" },
  },
  {
    number: "04",
    title: "Clean and analyze with AI — your choice of model",
    body:
      "Remove filler, fix grammar, structure as bullets, extract action items. Runs locally on Qwen or Phi, or bring your own API key for Claude, GPT, Gemini, or Grok.",
    bullets: [
      "12 built-in templates + unlimited custom",
      "'Write like Hemingway' or 'Turn into a sales email'",
      "Chat with the transcript — ask questions about the meeting",
    ],
    screenshot: { device: "mac", alt: "AI cleanup and analysis panel" },
  },
  {
    number: "05",
    title: "Listen to anything, at any speed",
    body:
      "Karaoke-style read-aloud with words highlighted as they're spoken. Pick a natural voice, or blaze through with RSVP silent speed-reading.",
    bullets: [
      "On-device Kokoro neural voice + Apple system voices",
      "Optional cloud voices: OpenAI, ElevenLabs, Gemini TTS",
      "Background playback with lock-screen controls",
    ],
    screenshot: { device: "iphone", alt: "Read-aloud with karaoke highlighting" },
  },
  {
    number: "06",
    title: "Yours forever — sync with the tools you use",
    body:
      "Bidirectional Obsidian sync, Apple Notes export, subtitle export (.srt/.vtt), and an MCP server so Claude Code can read your meetings.",
    bullets: [
      "iCloud sync across your devices, at no cost",
      "Import audio, video, podcasts, PDFs, articles, screenshots",
      "Never a subscription, never an ad, never tracked",
    ],
    screenshot: { device: "mac", alt: "Obsidian sync and Apple Notes export" },
  },
];
```

- [ ] **Step 2: `src/lib/copy/faq.ts`**

```ts
import type { FaqItem } from "@/components/marketing/FaqAccordion";

export const landingFaq: readonly FaqItem[] = [
  {
    q: "Is it really a one-time purchase?",
    a: "Yes. $9.99 on the App Store, and you own it forever — including future updates. No subscription, no per-minute fees, no 'pro' tier.",
  },
  {
    q: "Does my audio leave my device?",
    a: "No. Transcription, speaker recognition, and cleanup all run on-device by default. If you want to use a cloud LLM for cleanup (Claude, GPT, Gemini, Grok), you bring your own API key and pay the provider directly — we don't see or store anything.",
  },
  {
    q: "What do the cloud AI options cost?",
    a: "You pay the provider directly. On-device is always free forever, and it handles most of what people need. Cloud only adds value if you want the very best model for complex analysis.",
  },
  {
    q: "Does it sync between my iPhone and Mac?",
    a: "Yes, via iCloud. Your recordings, transcripts, and analyses appear on all your devices signed into the same Apple ID.",
  },
  {
    q: "Family sharing?",
    a: "Yes — Transcribatron supports Family Sharing on the App Store. One purchase, up to six family members.",
  },
  {
    q: "What if I don't like it?",
    a: "Standard Apple App Store refund policy applies. Request a refund through Apple within 14 days and you'll be reimbursed.",
  },
];

export const pricingFaq: readonly FaqItem[] = [
  ...landingFaq,
  {
    q: "Do you offer an education discount?",
    a: "Not currently — at $9.99 for lifetime, we think the price is already student-friendly.",
  },
  {
    q: "Will future major versions cost extra?",
    a: "No. Every update — feature or bugfix — is included in your original purchase, forever.",
  },
];
```

- [ ] **Step 3: `src/lib/copy/comparison.ts`**

```ts
import type { ComparisonRow } from "@/components/marketing/ComparisonTable";

export const comparisonCompetitors = ["Otter", "Fathom", "Granola"] as const;

export const comparisonRows: readonly ComparisonRow[] = [
  {
    feature: "Pricing",
    transcribatron: "$9.99 once",
    competitors: { Otter: "$20/mo", Fathom: "$19/mo", Granola: "$15/mo" },
  },
  {
    feature: "On-device transcription",
    transcribatron: true,
    competitors: { Otter: false, Fathom: false, Granola: false },
  },
  {
    feature: "Speaker voiceprint recognition",
    transcribatron: true,
    competitors: { Otter: false, Fathom: false, Granola: false },
  },
  {
    feature: "System-wide iOS dictation keyboard",
    transcribatron: true,
    competitors: { Otter: false, Fathom: false, Granola: false },
  },
  {
    feature: "Live meeting coaching",
    transcribatron: true,
    competitors: { Otter: false, Fathom: false, Granola: false },
  },
  {
    feature: "Bring your own AI model",
    transcribatron: true,
    competitors: { Otter: false, Fathom: false, Granola: false },
  },
  {
    feature: "Obsidian bidirectional sync",
    transcribatron: true,
    competitors: { Otter: false, Fathom: false, Granola: false },
  },
  {
    feature: "iCloud sync (no vendor lock-in)",
    transcribatron: true,
    competitors: { Otter: false, Fathom: false, Granola: false },
  },
  {
    feature: "Native iOS + Mac app",
    transcribatron: true,
    competitors: { Otter: "web + iOS", Fathom: "web", Granola: "Mac only" },
  },
];
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/copy/
git commit -m "content: draft landing/features/pricing copy constants"
```

---

## Task 12: Landing page

**Files:**
- Modify: `src/app/page.tsx` (replace default Next scaffold)

**Interfaces:**
- Consumes: everything from Tasks 4–11

- [ ] **Step 1: Replace `src/app/page.tsx`**

```tsx
import { Hero } from "@/components/marketing/Hero";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { FeatureRow } from "@/components/marketing/FeatureRow";
import { PricingCard } from "@/components/marketing/PricingCard";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { Section } from "@/components/layout/Section";
import { featuresJourney } from "@/lib/copy/features";
import { landingFaq } from "@/lib/copy/faq";
import { siteConfig } from "@/lib/site-config";

export default function HomePage() {
  // App Store URLs come from Sanity siteSettings in Task 22. Until then, null.
  const appStoreUrl: string | null = null;
  const macAppStoreUrl: string | null = null;

  return (
    <>
      <Hero appStoreUrl={appStoreUrl} macAppStoreUrl={macAppStoreUrl} />
      <TrustStrip
        items={[
          "On-device by default",
          "No subscription",
          "No ads",
          "No tracking",
        ]}
      />
      {featuresJourney.map((f, i) => (
        <FeatureRow
          key={f.number}
          number={f.number}
          title={f.title}
          body={f.body}
          bullets={f.bullets}
          screenshot={f.screenshot}
          align={i % 2 === 0 ? "left" : "right"}
          variant={i % 2 === 1 ? "alt" : "default"}
        />
      ))}
      <Section title="One price. That's it." eyebrow="Pricing">
        <PricingCard
          price={{ display: "$9.99", caption: "One-time purchase, lifetime access" }}
          includes={[
            "Everything above, forever",
            "On-device AI included, no per-minute fees",
            "Free updates for life",
            "Family Sharing supported",
          ]}
          appStoreUrl={appStoreUrl}
          macAppStoreUrl={macAppStoreUrl}
        />
        <div className="mt-12 text-center text-ink-2 max-w-2xl mx-auto">
          What you&apos;d pay elsewhere in a year:{" "}
          {siteConfig.competitors.map((c, i, arr) => (
            <span key={c.name}>
              <strong className="text-ink">{c.name} ${c.perYear}</strong>
              {i < arr.length - 1 ? ", " : "."}
            </span>
          ))}
          {" "}
          <strong className="text-accent">Transcribatron $9.99. Once.</strong>
        </div>
      </Section>
      <Section title="Questions, answered." eyebrow="FAQ" variant="alt">
        <FaqAccordion items={landingFaq} />
      </Section>
      <CtaBanner
        headline="Say more. Spend less."
        body="$9.99 once. Download for iPhone and Mac."
        appStoreUrl={appStoreUrl}
        macAppStoreUrl={macAppStoreUrl}
        position="landing-footer"
      />
    </>
  );
}
```

- [ ] **Step 2: Extend Playwright smoke test**

Modify `tests/smoke.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test.describe("landing", () => {
  test("renders headline and CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Say more");
    // Two App Store badges in hero, one pricing card, one final CTA = 3+ visible on page
    const appStoreBadges = page.locator('[aria-label*="App Store"]');
    expect(await appStoreBadges.count()).toBeGreaterThanOrEqual(4);
  });

  test("no console errors on landing", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });

  test("has exactly one h1", async ({ page }) => {
    await page.goto("/");
    const h1s = await page.locator("h1").count();
    expect(h1s).toBe(1);
  });
});
```

- [ ] **Step 3: Run tests**

```bash
npm run test:e2e
```

Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx tests/smoke.spec.ts
git commit -m "feat: assemble landing page"
```

---

## Task 13: Features + Pricing + Download pages

**Files:**
- Create: `src/app/features/page.tsx`
- Create: `src/app/pricing/page.tsx`
- Create: `src/app/download/page.tsx`

**Interfaces:**
- Consumes: existing components + copy

- [ ] **Step 1: `src/app/features/page.tsx`**

```tsx
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { FeatureRow } from "@/components/marketing/FeatureRow";
import { CtaBanner } from "@/components/marketing/CtaBanner";
import { featuresJourney } from "@/lib/copy/features";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Every feature in Transcribatron: dictation, meeting recording, speaker recognition, AI cleanup, read-aloud, and integrations. All included in the one-time $9.99 purchase.",
};

export default function FeaturesPage() {
  return (
    <>
      <PageHeader
        title="Everything Transcribatron does."
        subtitle="Six things it does exceptionally well — all included in one purchase."
      />
      {featuresJourney.map((f, i) => (
        <FeatureRow
          key={f.number}
          number={f.number}
          title={f.title}
          body={f.body}
          bullets={f.bullets}
          screenshot={f.screenshot}
          align={i % 2 === 0 ? "left" : "right"}
          variant={i % 2 === 1 ? "alt" : "default"}
        />
      ))}
      <CtaBanner
        headline="One purchase. All of it."
        body="$9.99 once. Every feature above, forever."
        position="features-footer"
      />
    </>
  );
}
```

- [ ] **Step 2: `src/app/pricing/page.tsx`**

```tsx
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { PricingCard } from "@/components/marketing/PricingCard";
import { ComparisonTable } from "@/components/marketing/ComparisonTable";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { comparisonCompetitors, comparisonRows } from "@/lib/copy/comparison";
import { pricingFaq } from "@/lib/copy/faq";

export const metadata: Metadata = {
  title: "Pricing — $9.99, once",
  description:
    "One-time $9.99 purchase. No subscription, no per-minute fees, no ads. Compare to Otter, Fathom, and Granola.",
};

export default function PricingPage() {
  return (
    <>
      <PageHeader
        title="One price. That's the whole price."
        subtitle="Pay $9.99 once on the App Store. Own it forever. Every update included."
      />
      <Section>
        <PricingCard
          price={{ display: "$9.99", caption: "One-time purchase, lifetime access" }}
          includes={[
            "Every feature, on iPhone, iPad, and Mac",
            "On-device AI — no per-minute fees",
            "iCloud sync across your devices",
            "Free updates forever",
            "Family Sharing (up to 6 people)",
            "Cloud AI is optional — bring your own API key",
          ]}
        />
      </Section>
      <Section title="Compared" eyebrow="How we stack up" variant="alt">
        <ComparisonTable
          competitorNames={comparisonCompetitors}
          rows={comparisonRows}
        />
      </Section>
      <Section title="Pricing questions" eyebrow="FAQ">
        <FaqAccordion items={pricingFaq} />
      </Section>
    </>
  );
}
```

- [ ] **Step 3: `src/app/download/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { AppStoreBadge } from "@/components/marketing/AppStoreBadge";
import { QrCode } from "@/components/marketing/QrCode";

export const metadata: Metadata = {
  title: "Download",
  description:
    "Download Transcribatron on the App Store for iPhone, iPad, and Mac. Requires iOS 26 or macOS 15.",
};

export default function DownloadPage() {
  const iosUrl: string | null = null;
  const macUrl: string | null = null;

  return (
    <>
      <PageHeader
        title="Get Transcribatron."
        subtitle="One-time $9.99. Works on your iPhone, iPad, and Mac."
      />
      <Section>
        <div className="grid md:grid-cols-2 gap-8">
          <PlatformCard
            title="iPhone & iPad"
            requirements="iOS 26 or later"
            badge={<AppStoreBadge platform="ios" href={iosUrl} position="download" />}
            qr={iosUrl ? <QrCode value={iosUrl} label="Scan on your phone" /> : null}
          />
          <PlatformCard
            title="Mac"
            requirements="macOS 15 or later — Apple Silicon recommended"
            badge={<AppStoreBadge platform="mac" href={macUrl} position="download" />}
            qr={null}
          />
        </div>
        <p className="mt-12 text-center text-ink-3 text-sm">
          Need help? <Link href="/support" className="text-accent hover:underline">Visit support</Link>.
        </p>
      </Section>
    </>
  );
}

function PlatformCard({ title, requirements, badge, qr }: {
  title: string;
  requirements: string;
  badge: React.ReactNode;
  qr: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-sep bg-surface p-8 text-center">
      <h2 className="text-2xl font-semibold text-ink">{title}</h2>
      <p className="mt-2 text-ink-3 text-sm">{requirements}</p>
      <div className="mt-6 flex justify-center">{badge}</div>
      {qr && <div className="mt-6 flex justify-center">{qr}</div>}
    </div>
  );
}
```

- [ ] **Step 4: Extend smoke tests**

Add to `tests/smoke.spec.ts`:

```ts
for (const route of ["/features", "/pricing", "/download"]) {
  test(`${route} renders without console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto(route);
    await expect(page.locator("h1")).toHaveCount(1);
    expect(errors).toEqual([]);
  });
}
```

- [ ] **Step 5: Run tests**

```bash
npm run test:e2e
```

- [ ] **Step 6: Commit**

```bash
git add src/app/features src/app/pricing src/app/download tests/smoke.spec.ts
git commit -m "feat: features, pricing, and download pages"
```

---

## Task 14: Support, Privacy, Terms pages

**Files:**
- Create: `src/app/support/page.tsx`
- Create: `src/app/privacy/page.tsx`
- Create: `src/app/terms/page.tsx`

**Interfaces:**
- Consumes: `PageHeader`, `Section`, `FaqAccordion`

- [ ] **Step 1: `src/app/support/page.tsx`**

```tsx
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support",
  description: "Get help with Transcribatron. Contact us or browse the docs.",
};

const supportFaq = [
  {
    q: "How do I contact support?",
    a: "Email support@transcribatron.com — we respond within one business day.",
  },
  {
    q: "Where do I report a bug?",
    a: "Email support with a description and screenshot. If you're comfortable, mention your iOS/macOS version.",
  },
  {
    q: "How do I request a feature?",
    a: "Send it to hello@transcribatron.com — we read every message.",
  },
];

export default function SupportPage() {
  return (
    <>
      <PageHeader
        title="Support"
        subtitle="Answers, contact, and pointers to the docs."
      />
      <Section title="Contact">
        <div className="max-w-2xl mx-auto text-center space-y-4 text-ink-2">
          <p>
            Email us at{" "}
            <a href="mailto:support@transcribatron.com" className="text-accent hover:underline">
              support@transcribatron.com
            </a>.
          </p>
          <p>
            Looking for how-tos and troubleshooting?{" "}
            <Link href="/docs" className="text-accent hover:underline">Browse the docs</Link>.
          </p>
        </div>
      </Section>
      <Section title="Frequently asked" variant="alt">
        <FaqAccordion items={supportFaq} />
      </Section>
    </>
  );
}
```

- [ ] **Step 2: `src/app/privacy/page.tsx`**

Template. **⚠ MUST be reviewed by a lawyer before launch — flagged in launch checklist.**

```tsx
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Transcribatron handles your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" subtitle="Last updated: 2026-07-27" />
      <Container size="narrow">
        <article className="prose prose-neutral max-w-none pb-24 text-ink-2 leading-relaxed">
          <p><strong>The short version:</strong> Transcribatron is on-device by default. We don&apos;t collect, store, or transmit your audio, transcripts, or analyses. We don&apos;t track you.</p>

          <h2 className="text-2xl font-semibold text-ink mt-8">1. What we collect</h2>
          <p>The Transcribatron app itself collects nothing. It does not send audio, transcripts, or usage data to any server.</p>
          <p>This website (transcribatron.com) uses Vercel Analytics, which counts anonymous page views without cookies. No personal data is collected.</p>

          <h2 className="text-2xl font-semibold text-ink mt-8">2. Optional cloud AI providers</h2>
          <p>If you choose to configure a cloud LLM (Anthropic Claude, OpenAI, Google Gemini, xAI Grok), Transcribatron sends the specific text you ask it to process to that provider using an API key <em>you</em> supply. That data is subject to the provider&apos;s privacy policy, not ours. Your API keys are stored locally in your device&apos;s Keychain and never sent to us.</p>

          <h2 className="text-2xl font-semibold text-ink mt-8">3. iCloud sync</h2>
          <p>If you enable iCloud sync, your recordings, transcripts, and analyses are synced across your devices via Apple&apos;s CloudKit. We do not have access to your iCloud data. Apple&apos;s privacy policy applies.</p>

          <h2 className="text-2xl font-semibold text-ink mt-8">4. Permissions</h2>
          <p>Transcribatron requests microphone, calendar, and (on iOS) keyboard access. All are used solely to provide the features you invoke and stay on your device.</p>

          <h2 className="text-2xl font-semibold text-ink mt-8">5. Contact</h2>
          <p>Questions? Email privacy@transcribatron.com.</p>
        </article>
      </Container>
    </>
  );
}
```

- [ ] **Step 3: `src/app/terms/page.tsx`**

Template. **⚠ MUST be reviewed by a lawyer before launch.**

```tsx
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms under which you use Transcribatron.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Terms of Service" subtitle="Last updated: 2026-07-27" />
      <Container size="narrow">
        <article className="prose prose-neutral max-w-none pb-24 text-ink-2 leading-relaxed">
          <p><strong>The short version:</strong> Buy Transcribatron on the App Store. Use it for legal things. We&apos;re not liable if it eats your notes.</p>

          <h2 className="text-2xl font-semibold text-ink mt-8">1. License</h2>
          <p>Your use of Transcribatron is governed by the Apple App Store&apos;s standard End User License Agreement (EULA), available at <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" className="text-accent hover:underline">apple.com/legal/internet-services/itunes/dev/stdeula/</a>.</p>

          <h2 className="text-2xl font-semibold text-ink mt-8">2. Refunds</h2>
          <p>Refunds are handled by Apple through the App Store&apos;s standard refund process. Request a refund at reportaproblem.apple.com.</p>

          <h2 className="text-2xl font-semibold text-ink mt-8">3. Acceptable use</h2>
          <p>You may not use Transcribatron to record people without their consent where such recording is prohibited by law. You are responsible for complying with the recording laws of your jurisdiction.</p>

          <h2 className="text-2xl font-semibold text-ink mt-8">4. No warranty</h2>
          <p>Transcribatron is provided &quot;as is,&quot; without warranty of any kind. We are not liable for lost data, missed deadlines, or coffee spilled on your keyboard while transcribing.</p>

          <h2 className="text-2xl font-semibold text-ink mt-8">5. Contact</h2>
          <p>Questions? Email legal@transcribatron.com.</p>
        </article>
      </Container>
    </>
  );
}
```

- [ ] **Step 4: Extend smoke tests + commit**

Add to `tests/smoke.spec.ts` inside the existing route loop:

```ts
for (const route of ["/features", "/pricing", "/download", "/support", "/privacy", "/terms"]) {
```

Run `npm run test:e2e`, expect pass.

```bash
git add src/app/support src/app/privacy src/app/terms tests/smoke.spec.ts
git commit -m "feat: support, privacy, and terms pages"
```

---

## Task 15: Sanity Studio embedded + schemas

**Files:**
- Create: `src/sanity/schemas/index.ts`
- Create: `src/sanity/schemas/post.ts`
- Create: `src/sanity/schemas/docArticle.ts`
- Create: `src/sanity/schemas/docSection.ts`
- Create: `src/sanity/schemas/category.ts`
- Create: `src/sanity/schemas/author.ts`
- Create: `src/sanity/schemas/siteSettings.ts`
- Create: `src/sanity/studio-config.ts`
- Create: `src/app/studio/[[...tool]]/page.tsx`
- Create: `sanity.config.ts` (at repo root, for `sanity-typegen`)
- Create: `.env.example`
- Modify: `next.config.ts` (allow Studio route)
- Modify: `package.json` (adds `next-sanity`, `sanity`, `@sanity/vision`, `@sanity/image-url`, `styled-components`)

**Interfaces:**
- Produces: Studio available at `/studio`; schema types exportable for typegen.

- [ ] **Step 1: Install Sanity deps**

```bash
npm install next-sanity sanity @sanity/vision @sanity/image-url styled-components
npm install -D @sanity/types
```

- [ ] **Step 2: Create schemas**

`src/sanity/schemas/siteSettings.ts`:

```ts
import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "siteName", type: "string", validation: (r) => r.required() }),
    defineField({ name: "appStoreUrl", title: "iOS App Store URL", type: "url" }),
    defineField({ name: "macAppStoreUrl", title: "Mac App Store URL", type: "url" }),
    defineField({ name: "currentVersion", type: "string" }),
    defineField({
      name: "socials",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "platform", type: "string" },
          { name: "url", type: "url" },
        ],
      }],
    }),
    defineField({
      name: "defaultOgImage",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
```

`src/sanity/schemas/author.ts`:

```ts
import { defineType, defineField } from "sanity";

export const author = defineType({
  name: "author",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "avatar", type: "image", options: { hotspot: true } }),
    defineField({ name: "bio", type: "text" }),
    defineField({ name: "twitter", type: "url" }),
    defineField({ name: "website", type: "url" }),
  ],
});
```

`src/sanity/schemas/category.ts`:

```ts
import { defineType, defineField } from "sanity";

export const category = defineType({
  name: "category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "description", type: "text" }),
  ],
});
```

`src/sanity/schemas/post.ts`:

```ts
import { defineType, defineField } from "sanity";

export const post = defineType({
  name: "post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "excerpt", type: "text", rows: 3 }),
    defineField({ name: "coverImage", type: "image", options: { hotspot: true } }),
    defineField({ name: "author", type: "reference", to: [{ type: "author" }] }),
    defineField({ name: "publishedAt", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "category", type: "reference", to: [{ type: "category" }] }),
    defineField({
      name: "body",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string" }] },
        {
          type: "object",
          name: "codeBlock",
          fields: [
            { name: "language", type: "string" },
            { name: "code", type: "text" },
          ],
        },
        {
          type: "object",
          name: "callout",
          fields: [
            { name: "variant", type: "string", options: { list: ["info", "warning", "tip"] } },
            { name: "body", type: "text" },
          ],
        },
      ],
    }),
    defineField({
      name: "seo",
      type: "object",
      fields: [
        { name: "title", type: "string" },
        { name: "description", type: "text", rows: 2 },
        { name: "ogImage", type: "image" },
      ],
    }),
  ],
  preview: { select: { title: "title", subtitle: "excerpt", media: "coverImage" } },
});
```

`src/sanity/schemas/docSection.ts`:

```ts
import { defineType, defineField } from "sanity";

export const docSection = defineType({
  name: "docSection",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
    defineField({ name: "icon", type: "string", description: "lucide-react icon name" }),
  ],
});
```

`src/sanity/schemas/docArticle.ts`:

```ts
import { defineType, defineField } from "sanity";

export const docArticle = defineType({
  name: "docArticle",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "section", type: "reference", to: [{ type: "docSection" }], validation: (r) => r.required() }),
    defineField({ name: "order", type: "number", initialValue: 0 }),
    defineField({
      name: "body",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string" }] },
        {
          type: "object",
          name: "codeBlock",
          fields: [
            { name: "language", type: "string" },
            { name: "code", type: "text" },
          ],
        },
        {
          type: "object",
          name: "callout",
          fields: [
            { name: "variant", type: "string", options: { list: ["info", "warning", "tip"] } },
            { name: "body", type: "text" },
          ],
        },
      ],
    }),
    defineField({ name: "lastReviewed", type: "date" }),
    defineField({
      name: "seo",
      type: "object",
      fields: [
        { name: "title", type: "string" },
        { name: "description", type: "text", rows: 2 },
      ],
    }),
  ],
});
```

`src/sanity/schemas/index.ts`:

```ts
import { post } from "./post";
import { docArticle } from "./docArticle";
import { docSection } from "./docSection";
import { category } from "./category";
import { author } from "./author";
import { siteSettings } from "./siteSettings";

export const schemaTypes = [post, docArticle, docSection, category, author, siteSettings];
```

- [ ] **Step 3: Create `src/sanity/studio-config.ts`**

```ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

export const studioConfig = defineConfig({
  name: "default",
  title: "Transcribatron CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
```

- [ ] **Step 4: Mount Studio at `/studio`**

`src/app/studio/[[...tool]]/page.tsx`:

```tsx
"use client";
import { NextStudio } from "next-sanity/studio";
import { studioConfig } from "@/sanity/studio-config";

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={studioConfig} />;
}
```

- [ ] **Step 5: Create root `sanity.config.ts`**

Referenced by `sanity-typegen` CLI:

```ts
import { studioConfig } from "./src/sanity/studio-config";
export default studioConfig;
```

- [ ] **Step 6: Create `.env.example`**

```
NEXT_PUBLIC_SITE_URL=https://transcribatron.com
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=sk-xxxxxxxxxxxxxxxx
SANITY_REVALIDATE_SECRET=some-long-random-string
```

- [ ] **Step 7: Provision a Sanity project (manual, one-time)**

```bash
npx sanity@latest init --create-project "Transcribatron" --dataset production
```

Copy the printed project ID into local `.env.local`. Push schemas:

```bash
npx sanity@latest schema deploy
```

*(This is a one-time human step. Document it in the launch checklist too.)*

- [ ] **Step 8: Verify Studio loads**

```bash
npm run dev
```

Open `http://localhost:3000/studio` — Sanity Studio should load. Sign in with your Sanity account. Create a `siteSettings` document.

- [ ] **Step 9: Commit**

```bash
git add src/sanity/ src/app/studio/ sanity.config.ts .env.example package.json package-lock.json next.config.ts
git commit -m "feat: embed Sanity Studio at /studio with schemas"
```

---

## Task 16: Sanity client + typed queries + image loader

**Files:**
- Create: `src/lib/sanity.ts`
- Create: `src/lib/sanity-image.ts`
- Create: `sanity-typegen.json`
- Create: `tests/unit/sanity.test.ts`
- Modify: `package.json` (add `typegen` script; devDep: `@sanity/typegen`)

**Interfaces:**
- Produces: `sanityFetch<T>(query, params?, tags?)`, `sanityImageUrl(image)`, generated types in `sanity.types.ts`

- [ ] **Step 1: Install typegen**

```bash
npm install -D @sanity/typegen
```

- [ ] **Step 2: `src/lib/sanity.ts`**

```ts
import { createClient, type QueryParams } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-11-01",
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN,
});

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { tags, revalidate: false },
  });
}
```

- [ ] **Step 3: `src/lib/sanity-image.ts`**

```ts
import imageUrlBuilder from "@sanity/image-url";
import { client } from "./sanity";

const builder = imageUrlBuilder(client);

export function sanityImageUrl(source: unknown): string | null {
  if (!source) return null;
  try {
    return builder.image(source as never).auto("format").fit("max").url();
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: `sanity-typegen.json` and `typegen` script**

```json
{
  "path": "./src/**/*.{ts,tsx}",
  "schema": "./schema.json",
  "generates": "./sanity.types.ts"
}
```

Add to `package.json`:

```json
"typegen:schema": "npx sanity@latest schema extract --path=schema.json",
"typegen": "npm run typegen:schema && npx sanity-typegen generate"
```

Add `sanity.types.ts` and `schema.json` to `.gitignore` if you don't want generated files committed. (Decision: commit them — makes CI simpler.)

- [ ] **Step 5: Write failing test `tests/unit/sanity.test.ts`**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { sanityFetch } from "@/lib/sanity";
import * as sanityModule from "@/lib/sanity";

describe("sanityFetch", () => {
  it("calls client.fetch with tags for revalidation", async () => {
    const fetchSpy = vi.spyOn(sanityModule.client, "fetch").mockResolvedValue({ ok: true });
    await sanityFetch({ query: "*[_type == 'post']", tags: ["posts"] });
    expect(fetchSpy).toHaveBeenCalledWith(
      "*[_type == 'post']",
      {},
      { next: { tags: ["posts"], revalidate: false } }
    );
    fetchSpy.mockRestore();
  });
});
```

- [ ] **Step 6: Run test, expect pass**

```bash
npm run test:unit -- sanity
```

- [ ] **Step 7: Generate types (requires Studio schema deployed from Task 15)**

```bash
npm run typegen
```

Creates `sanity.types.ts` with types for `Post`, `DocArticle`, `SiteSettings`, etc.

- [ ] **Step 8: Commit**

```bash
git add src/lib/sanity.ts src/lib/sanity-image.ts sanity-typegen.json sanity.types.ts schema.json tests/unit/sanity.test.ts package.json package-lock.json
git commit -m "feat: Sanity client, image loader, and typed queries"
```

---

## Task 17: PortableText renderer + custom serializers

**Files:**
- Create: `src/components/content/PortableText.tsx`
- Create: `src/components/content/CodeBlock.tsx`
- Create: `src/components/content/Callout.tsx`
- Create: `src/components/content/InlineScreenshot.tsx`
- Create: `tests/unit/portable-text.test.tsx`
- Modify: `package.json` (add `@portabletext/react`, `shiki`)

**Interfaces:**
- Produces: `<PortableText value={PortableTextBlock[]} />` — renders Sanity content with brand-styled headings, links, code blocks, images, callouts.

- [ ] **Step 1: Install deps**

```bash
npm install @portabletext/react shiki
```

- [ ] **Step 2: `src/components/content/CodeBlock.tsx`**

```tsx
import { codeToHtml } from "shiki";

interface CodeBlockProps {
  language?: string;
  code: string;
}

export async function CodeBlock({ language = "text", code }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language,
    theme: "github-light",
  });
  return (
    <div
      className="rounded-2xl overflow-hidden my-6 text-sm bg-surface-2 border border-sep p-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

- [ ] **Step 3: `src/components/content/Callout.tsx`**

```tsx
import { Info, AlertTriangle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalloutProps {
  variant?: "info" | "warning" | "tip";
  children: React.ReactNode;
}

const styles = {
  info: { icon: Info, cls: "border-accent/40 bg-accent-soft text-ink" },
  warning: { icon: AlertTriangle, cls: "border-warning/40 bg-warning/10 text-ink" },
  tip: { icon: Lightbulb, cls: "border-positive/40 bg-positive/10 text-ink" },
};

export function Callout({ variant = "info", children }: CalloutProps) {
  const { icon: Icon, cls } = styles[variant];
  return (
    <div className={cn("my-6 rounded-2xl border p-4 flex gap-3", cls)}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}
```

- [ ] **Step 4: `src/components/content/InlineScreenshot.tsx`**

```tsx
import Image from "next/image";
import { sanityImageUrl } from "@/lib/sanity-image";

interface InlineScreenshotProps {
  value: { asset: unknown; alt?: string };
}

export function InlineScreenshot({ value }: InlineScreenshotProps) {
  const url = sanityImageUrl(value);
  if (!url) return null;
  return (
    <figure className="my-8">
      <Image
        src={url}
        alt={value.alt ?? ""}
        width={1200}
        height={800}
        className="rounded-2xl border border-sep w-full h-auto"
      />
    </figure>
  );
}
```

- [ ] **Step 5: `src/components/content/PortableText.tsx`**

```tsx
import { PortableText as BasePortableText, type PortableTextComponents } from "@portabletext/react";
import Link from "next/link";
import { CodeBlock } from "./CodeBlock";
import { Callout } from "./Callout";
import { InlineScreenshot } from "./InlineScreenshot";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="my-4 text-ink-2 leading-relaxed">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 text-3xl font-semibold tracking-tight text-ink">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-2xl font-semibold tracking-tight text-ink">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-accent pl-4 italic text-ink-2">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="my-4 pl-6 list-disc space-y-2 text-ink-2">{children}</ul>,
    number: ({ children }) => <ol className="my-4 pl-6 list-decimal space-y-2 text-ink-2">{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href ?? "#";
      const isExternal = href.startsWith("http");
      return isExternal ? (
        <a href={href} target="_blank" rel="noopener" className="text-accent hover:underline">
          {children}
        </a>
      ) : (
        <Link href={href} className="text-accent hover:underline">{children}</Link>
      );
    },
    strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  },
  types: {
    codeBlock: ({ value }) => <CodeBlock language={value.language} code={value.code} />,
    callout: ({ value }) => <Callout variant={value.variant}>{value.body}</Callout>,
    image: ({ value }) => <InlineScreenshot value={value} />,
  },
};

export function PortableText({ value }: { value: unknown }) {
  return <BasePortableText value={value as never} components={components} />;
}
```

- [ ] **Step 6: Write test `tests/unit/portable-text.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PortableText } from "@/components/content/PortableText";

describe("PortableText", () => {
  it("renders paragraphs", () => {
    render(<PortableText value={[{ _type: "block", style: "normal", children: [{ _type: "span", text: "Hello world" }] }]} />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders headings", () => {
    render(<PortableText value={[{ _type: "block", style: "h2", children: [{ _type: "span", text: "Section" }] }]} />);
    expect(screen.getByRole("heading", { level: 2, name: "Section" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 7: Run test, expect pass**

```bash
npm run test:unit -- portable-text
```

- [ ] **Step 8: Commit**

```bash
git add src/components/content/ tests/unit/portable-text.test.tsx package.json package-lock.json
git commit -m "feat: PortableText renderer with brand-styled serializers"
```

---

## Task 18: Blog index + individual post pages + RSS

**Files:**
- Create: `src/app/blog/queries.ts`
- Create: `src/app/blog/page.tsx`
- Create: `src/app/blog/[slug]/page.tsx`
- Create: `src/app/blog/rss.xml/route.ts`

**Interfaces:**
- Consumes: `sanityFetch`, `PortableText`, `PageHeader`, `Section`
- Produces: `/blog` (list), `/blog/[slug]` (post), `/blog/rss.xml` (feed)

- [ ] **Step 1: `src/app/blog/queries.ts`**

```ts
export const postsListQuery = /* groq */ `
*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  "author": author->{name, "slug": slug.current, avatar},
  "category": category->{title, "slug": slug.current}
}`;

export const postBySlugQuery = /* groq */ `
*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  coverImage,
  publishedAt,
  body,
  "author": author->{name, "slug": slug.current, avatar, bio, twitter},
  "category": category->{title, "slug": slug.current},
  seo
}`;

export const relatedPostsQuery = /* groq */ `
*[_type == "post" && slug.current != $slug && category._ref == $categoryId] | order(publishedAt desc)[0..2] {
  _id, title, "slug": slug.current, excerpt, publishedAt, coverImage
}`;

export const allPostSlugsQuery = /* groq */ `*[_type == "post" && defined(slug.current)].slug.current`;
```

- [ ] **Step 2: `src/app/blog/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Grid } from "@/components/layout/Grid";
import { sanityFetch } from "@/lib/sanity";
import { sanityImageUrl } from "@/lib/sanity-image";
import { postsListQuery } from "./queries";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on transcription, meetings, voice interfaces, and privacy — from the Transcribatron team.",
  alternates: { types: { "application/rss+xml": "/blog/rss.xml" } },
};

interface PostListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: unknown;
  publishedAt: string;
  author?: { name: string };
  category?: { title: string; slug: string };
}

export default async function BlogIndex() {
  const posts = await sanityFetch<PostListItem[]>({
    query: postsListQuery,
    tags: ["posts"],
  });

  return (
    <>
      <PageHeader
        title="Notes on transcription, meetings, and voice."
        subtitle="Product updates, tips, and thoughts from the Transcribatron team."
      />
      <Section>
        {posts.length === 0 ? (
          <p className="text-center text-ink-3">No posts yet — check back soon.</p>
        ) : (
          <Grid cols={3}>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </Grid>
        )}
      </Section>
    </>
  );
}

function PostCard({ post }: { post: PostListItem }) {
  const cover = sanityImageUrl(post.coverImage);
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group rounded-2xl border border-sep bg-surface overflow-hidden hover:border-ink-3 transition-colors"
    >
      {cover && (
        <div className="relative aspect-[16/10] bg-surface-2">
          <Image src={cover} alt="" fill className="object-cover" sizes="(min-width: 1024px) 400px, 100vw" />
        </div>
      )}
      <div className="p-6">
        {post.category && (
          <div className="text-xs font-medium tracking-wide uppercase text-accent mb-2">
            {post.category.title}
          </div>
        )}
        <h2 className="text-xl font-semibold text-ink group-hover:text-accent transition-colors">
          {post.title}
        </h2>
        {post.excerpt && <p className="mt-2 text-ink-2 text-sm line-clamp-2">{post.excerpt}</p>}
        <div className="mt-4 text-xs text-ink-3">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {post.author && ` · ${post.author.name}`}
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 3: `src/app/blog/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PortableText } from "@/components/content/PortableText";
import { sanityFetch } from "@/lib/sanity";
import { sanityImageUrl } from "@/lib/sanity-image";
import { postBySlugQuery, relatedPostsQuery, allPostSlugsQuery } from "../queries";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: unknown;
  publishedAt: string;
  body: unknown;
  author?: { name: string; bio?: string };
  category?: { _id?: string };
  seo?: { title?: string; description?: string };
}

interface Related {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({ query: allPostSlugsQuery, tags: ["posts"] });
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<Post | null>({
    query: postBySlugQuery,
    params: { slug },
    tags: [`post:${slug}`],
  });
  if (!post) return { title: "Not found" };
  return {
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.excerpt,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await sanityFetch<Post | null>({
    query: postBySlugQuery,
    params: { slug },
    tags: [`post:${slug}`, "posts"],
  });
  if (!post) notFound();

  const related = post.category?._id
    ? await sanityFetch<Related[]>({
        query: relatedPostsQuery,
        params: { slug, categoryId: post.category._id },
        tags: ["posts"],
      })
    : [];

  const cover = sanityImageUrl(post.coverImage);

  return (
    <article className="pt-32 pb-24">
      <Container size="narrow">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink">{post.title}</h1>
          <div className="mt-4 text-sm text-ink-3">
            {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            {post.author && ` · ${post.author.name}`}
          </div>
        </header>
        {cover && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10">
            <Image src={cover} alt={post.title} fill priority className="object-cover" sizes="(min-width: 1024px) 800px, 100vw" />
          </div>
        )}
        <div className="prose prose-neutral max-w-none">
          <PortableText value={post.body} />
        </div>
        {related.length > 0 && (
          <aside className="mt-16 pt-10 border-t border-sep">
            <h2 className="text-2xl font-semibold text-ink mb-6">Related posts</h2>
            <ul className="space-y-4">
              {related.map((p) => (
                <li key={p._id}>
                  <Link href={`/blog/${p.slug}`} className="group">
                    <div className="text-lg font-medium text-ink group-hover:text-accent transition-colors">
                      {p.title}
                    </div>
                    {p.excerpt && <div className="text-sm text-ink-3 mt-1">{p.excerpt}</div>}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </Container>
    </article>
  );
}
```

- [ ] **Step 4: `src/app/blog/rss.xml/route.ts`**

```ts
import { sanityFetch } from "@/lib/sanity";
import { siteConfig } from "@/lib/site-config";
import { postsListQuery } from "../queries";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  author?: { name: string };
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await sanityFetch<Post[]>({ query: postsListQuery, tags: ["posts"] });
  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${siteConfig.url}/blog/${p.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      ${p.excerpt ? `<description>${escapeXml(p.excerpt)}</description>` : ""}
      ${p.author ? `<author>${escapeXml(p.author.name)}</author>` : ""}
    </item>`
    )
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>${siteConfig.name} — Blog</title>
  <link>${siteConfig.url}/blog</link>
  <description>${siteConfig.description}</description>
  <language>en-us</language>
  ${items}
</channel></rss>`;

  return new Response(rss, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/blog/
git commit -m "feat: blog index, post pages, and RSS feed"
```

---

## Task 19: Docs index + article pages with TOC

**Files:**
- Create: `src/app/docs/queries.ts`
- Create: `src/app/docs/page.tsx`
- Create: `src/app/docs/[slug]/page.tsx`
- Create: `src/components/content/TableOfContents.tsx`

**Interfaces:**
- Consumes: `sanityFetch`, `PortableText`
- Produces: `/docs` (grouped by section), `/docs/[slug]` (article with sidebar TOC)

- [ ] **Step 1: `src/app/docs/queries.ts`**

```ts
export const docsIndexQuery = /* groq */ `
*[_type == "docSection"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  icon,
  "articles": *[_type == "docArticle" && references(^._id)] | order(order asc) {
    _id, title, "slug": slug.current
  }
}`;

export const docBySlugQuery = /* groq */ `
*[_type == "docArticle" && slug.current == $slug][0] {
  _id, title, "slug": slug.current, body, lastReviewed,
  "section": section->{title, "slug": slug.current},
  seo
}`;

export const allDocSlugsQuery = /* groq */ `*[_type == "docArticle" && defined(slug.current)].slug.current`;

export const docNavQuery = /* groq */ `
*[_type == "docSection"] | order(order asc) {
  title, "slug": slug.current,
  "articles": *[_type == "docArticle" && references(^._id)] | order(order asc) {
    title, "slug": slug.current
  }
}`;
```

- [ ] **Step 2: `src/components/content/TableOfContents.tsx`**

TOC extracted from PortableText blocks (h2/h3 only, client-side scroll spy).

```tsx
"use client";
import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TocProps {
  items: readonly TocItem[];
}

export function TableOfContents({ items }: TocProps) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <div className="font-medium text-ink mb-3">On this page</div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
            <a
              href={`#${item.id}`}
              className={
                active === item.id ? "text-accent" : "text-ink-3 hover:text-ink"
              }
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function extractToc(blocks: unknown): TocItem[] {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter((b: any) => b._type === "block" && (b.style === "h2" || b.style === "h3"))
    .map((b: any) => {
      const text = b.children.map((c: any) => c.text).join("");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return { id, text, level: b.style === "h2" ? 2 : 3 };
    });
}
```

- [ ] **Step 3: Extend PortableText to add heading IDs**

Modify `src/components/content/PortableText.tsx` — replace `h2` and `h3` block serializers:

```tsx
h2: ({ children, value }) => {
  const text = (value.children ?? []).map((c: any) => c.text).join("");
  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return (
    <h2 id={id} className="mt-12 mb-4 text-3xl font-semibold tracking-tight text-ink scroll-mt-20">
      {children}
    </h2>
  );
},
h3: ({ children, value }) => {
  const text = (value.children ?? []).map((c: any) => c.text).join("");
  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return (
    <h3 id={id} className="mt-8 mb-3 text-2xl font-semibold tracking-tight text-ink scroll-mt-20">
      {children}
    </h3>
  );
},
```

- [ ] **Step 4: `src/app/docs/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Grid } from "@/components/layout/Grid";
import { sanityFetch } from "@/lib/sanity";
import { docsIndexQuery } from "./queries";

export const metadata: Metadata = {
  title: "Documentation",
  description: "How to use Transcribatron — getting started, recording meetings, cleanup, integrations, and troubleshooting.",
};

interface DocSection {
  _id: string;
  title: string;
  slug: string;
  icon?: string;
  articles: { _id: string; title: string; slug: string }[];
}

export default async function DocsIndex() {
  const sections = await sanityFetch<DocSection[]>({ query: docsIndexQuery, tags: ["docs"] });
  return (
    <>
      <PageHeader
        title="Docs"
        subtitle="Get the most out of Transcribatron."
      />
      <Section>
        <Grid cols={2}>
          {sections.map((section) => (
            <div key={section._id} className="rounded-2xl border border-sep bg-surface p-8">
              <h2 className="text-xl font-semibold text-ink mb-4">{section.title}</h2>
              <ul className="space-y-2">
                {section.articles.map((a) => (
                  <li key={a._id}>
                    <Link
                      href={`/docs/${a.slug}`}
                      className="text-ink-2 hover:text-accent transition-colors"
                    >
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Grid>
      </Section>
    </>
  );
}
```

- [ ] **Step 5: `src/app/docs/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PortableText } from "@/components/content/PortableText";
import { TableOfContents, extractToc } from "@/components/content/TableOfContents";
import { sanityFetch } from "@/lib/sanity";
import { docBySlugQuery, allDocSlugsQuery, docNavQuery } from "../queries";

interface Doc {
  _id: string;
  title: string;
  slug: string;
  body: unknown;
  lastReviewed?: string;
  section?: { title: string; slug: string };
  seo?: { title?: string; description?: string };
}

interface NavSection {
  title: string;
  slug: string;
  articles: { title: string; slug: string }[];
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({ query: allDocSlugsQuery, tags: ["docs"] });
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = await sanityFetch<Doc | null>({
    query: docBySlugQuery,
    params: { slug },
    tags: [`doc:${slug}`],
  });
  if (!doc) return { title: "Not found" };
  return {
    title: doc.seo?.title ?? doc.title,
    description: doc.seo?.description,
  };
}

export default async function DocArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [doc, nav] = await Promise.all([
    sanityFetch<Doc | null>({
      query: docBySlugQuery,
      params: { slug },
      tags: [`doc:${slug}`, "docs"],
    }),
    sanityFetch<NavSection[]>({ query: docNavQuery, tags: ["docs"] }),
  ]);
  if (!doc) notFound();

  const toc = extractToc(doc.body);

  return (
    <div className="pt-32 pb-24">
      <Container>
        <div className="grid lg:grid-cols-[240px_1fr_200px] gap-12">
          {/* Left sidebar */}
          <aside className="hidden lg:block sticky top-24 self-start">
            {nav.map((section) => (
              <div key={section.slug} className="mb-6">
                <div className="text-sm font-medium text-ink mb-2">{section.title}</div>
                <ul className="space-y-1 text-sm">
                  {section.articles.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/docs/${a.slug}`}
                        className={
                          a.slug === doc.slug ? "text-accent" : "text-ink-3 hover:text-ink"
                        }
                      >
                        {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          {/* Main content */}
          <article>
            {doc.section && (
              <div className="text-sm text-ink-3 mb-2">{doc.section.title}</div>
            )}
            <h1 className="text-4xl font-semibold tracking-tight text-ink mb-8">{doc.title}</h1>
            <div className="prose prose-neutral max-w-none">
              <PortableText value={doc.body} />
            </div>
          </article>

          {/* Right TOC */}
          <aside className="hidden lg:block sticky top-24 self-start">
            <TableOfContents items={toc} />
          </aside>
        </div>
      </Container>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/docs/ src/components/content/TableOfContents.tsx src/components/content/PortableText.tsx
git commit -m "feat: docs index, article pages, and TOC"
```

---

## Task 20: Sanity webhook + revalidate API route

**Files:**
- Create: `src/app/api/revalidate/route.ts`
- Create: `tests/unit/revalidate.test.ts`

**Interfaces:**
- Produces: `POST /api/revalidate` — secret-gated endpoint that invalidates `posts` or `docs` tags based on the payload

- [ ] **Step 1: Write failing test `tests/unit/revalidate.test.ts`**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

import { POST } from "@/app/api/revalidate/route";
import { revalidateTag } from "next/cache";

const originalSecret = process.env.SANITY_REVALIDATE_SECRET;
beforeEach(() => {
  vi.clearAllMocks();
  process.env.SANITY_REVALIDATE_SECRET = "test-secret";
});

function makeRequest(secret: string | null, body: object): Request {
  const url = secret
    ? `http://localhost/api/revalidate?secret=${secret}`
    : `http://localhost/api/revalidate`;
  return new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("revalidate route", () => {
  it("rejects without secret", async () => {
    const res = await POST(makeRequest(null, { _type: "post", slug: { current: "hello" } }));
    expect(res.status).toBe(401);
  });

  it("rejects with wrong secret", async () => {
    const res = await POST(makeRequest("wrong", { _type: "post", slug: { current: "hello" } }));
    expect(res.status).toBe(401);
  });

  it("revalidates posts tags on post publish", async () => {
    const res = await POST(makeRequest("test-secret", { _type: "post", slug: { current: "hello" } }));
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("posts");
    expect(revalidateTag).toHaveBeenCalledWith("post:hello");
  });

  it("revalidates docs tags on doc publish", async () => {
    const res = await POST(makeRequest("test-secret", { _type: "docArticle", slug: { current: "getting-started" } }));
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("docs");
    expect(revalidateTag).toHaveBeenCalledWith("doc:getting-started");
  });
});
```

- [ ] **Step 2: Run test, expect fail**

```bash
npm run test:unit -- revalidate
```

- [ ] **Step 3: Implement `src/app/api/revalidate/route.ts`**

```ts
import { revalidateTag } from "next/cache";

interface WebhookPayload {
  _type?: string;
  slug?: { current?: string };
}

export async function POST(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  if (!secret || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return new Response("unauthorized", { status: 401 });
  }

  const body = (await request.json()) as WebhookPayload;
  const type = body._type;
  const slug = body.slug?.current;

  if (type === "post") {
    revalidateTag("posts");
    if (slug) revalidateTag(`post:${slug}`);
  } else if (type === "docArticle") {
    revalidateTag("docs");
    if (slug) revalidateTag(`doc:${slug}`);
  } else if (type === "siteSettings") {
    revalidateTag("siteSettings");
  } else if (type === "docSection" || type === "category" || type === "author") {
    revalidateTag("posts");
    revalidateTag("docs");
  } else {
    return Response.json({ revalidated: false, reason: `unknown type: ${type}` });
  }

  return Response.json({ revalidated: true, type, slug });
}
```

- [ ] **Step 4: Run test, expect pass**

```bash
npm run test:unit -- revalidate
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/revalidate/route.ts tests/unit/revalidate.test.ts
git commit -m "feat: Sanity revalidate webhook"
```

---

## Task 21: SEO — metadata helpers + JSON-LD

**Files:**
- Create: `src/components/seo/metadata.ts`
- Create: `src/components/seo/JsonLd.tsx`
- Modify: `src/app/layout.tsx` (add sitewide Organization + WebSite JSON-LD)
- Modify: `src/app/page.tsx` (add SoftwareApplication + Product JSON-LD)
- Modify: `src/app/pricing/page.tsx` (add Product JSON-LD)
- Modify: `src/app/blog/[slug]/page.tsx` (add Article JSON-LD)
- Modify: `src/app/docs/[slug]/page.tsx` (add TechArticle + BreadcrumbList JSON-LD)
- Modify: `src/app/support/page.tsx` (add FAQPage JSON-LD)

**Interfaces:**
- Produces: `<JsonLd data={organizationSchema} />`; schema builders `softwareApplicationSchema()`, `articleSchema(post)`, `techArticleSchema(doc)`, `faqSchema(items)`, `breadcrumbSchema(items)`.

- [ ] **Step 1: `src/components/seo/JsonLd.tsx`**

```tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 2: `src/components/seo/metadata.ts`**

```ts
import { siteConfig } from "@/lib/site-config";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/blog?q={query}`,
    "query-input": "required name=query",
  },
};

export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.name,
  operatingSystem: "iOS, macOS",
  applicationCategory: "ProductivityApplication",
  offers: {
    "@type": "Offer",
    price: siteConfig.price.amount,
    priceCurrency: siteConfig.price.currency,
    availability: "https://schema.org/InStock",
  },
  aggregateRating: undefined, // fill in after launch with real reviews
};

export interface FaqItem {
  q: string;
  a: string;
}

export function faqSchema(items: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function articleSchema(post: {
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt: string;
  author?: { name: string };
  coverImage?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: post.author ? { "@type": "Person", name: post.author.name } : undefined,
    image: post.coverImage,
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  };
}

export function techArticleSchema(doc: {
  title: string;
  slug: string;
  lastReviewed?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: doc.title,
    dateModified: doc.lastReviewed,
    mainEntityOfPage: `${siteConfig.url}/docs/${doc.slug}`,
  };
}

export function breadcrumbSchema(items: readonly { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

- [ ] **Step 3: Wire into pages**

`src/app/layout.tsx` — add JSON-LD to `<head>` (Next 16 supports elements inside layouts). Add before `</body>`:

```tsx
<JsonLd data={organizationSchema} />
<JsonLd data={websiteSchema} />
```

`src/app/page.tsx` — add before final `</>`:

```tsx
<JsonLd data={softwareApplicationSchema} />
<JsonLd data={faqSchema(landingFaq)} />
```

`src/app/pricing/page.tsx` — add:

```tsx
<JsonLd data={softwareApplicationSchema} />
<JsonLd data={faqSchema(pricingFaq)} />
```

`src/app/blog/[slug]/page.tsx` — inside `<article>`, add:

```tsx
<JsonLd
  data={articleSchema({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    author: post.author,
    coverImage: cover ?? undefined,
  })}
/>
```

`src/app/docs/[slug]/page.tsx` — add:

```tsx
<JsonLd data={techArticleSchema({ title: doc.title, slug: doc.slug, lastReviewed: doc.lastReviewed })} />
<JsonLd
  data={breadcrumbSchema([
    { name: "Docs", url: `${siteConfig.url}/docs` },
    ...(doc.section ? [{ name: doc.section.title, url: `${siteConfig.url}/docs` }] : []),
    { name: doc.title, url: `${siteConfig.url}/docs/${doc.slug}` },
  ])}
/>
```

`src/app/support/page.tsx` — add:

```tsx
<JsonLd data={faqSchema(supportFaq)} />
```

- [ ] **Step 4: Commit**

```bash
git add src/components/seo/ src/app/
git commit -m "feat: JSON-LD structured data across pages"
```

---

## Task 22: OG images, sitemap, robots

**Files:**
- Create: `src/app/opengraph-image.tsx`
- Create: `src/app/blog/[slug]/opengraph-image.tsx`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `tests/unit/sitemap.test.ts`
- Modify: `src/lib/site-config.ts` (add `siteSettings` Sanity fetch — for App Store URLs)

**Interfaces:**
- Produces: default OG image at `/opengraph-image`, per-post OG at `/blog/[slug]/opengraph-image`, dynamic sitemap, robots.txt

- [ ] **Step 1: `src/app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";
export const alt = siteConfig.tagline;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FAF8F3",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 24, color: "#FF6B00", marginBottom: 20 }}>
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 96, color: "#151510", lineHeight: 1.05, fontWeight: 600 }}>
          {siteConfig.tagline}
        </div>
        <div style={{ fontSize: 28, color: "#4A4740", marginTop: 24 }}>
          $9.99 once. iPhone & Mac.
        </div>
      </div>
    ),
    size
  );
}
```

- [ ] **Step 2: `src/app/blog/[slug]/opengraph-image.tsx`**

```tsx
import { ImageResponse } from "next/og";
import { sanityFetch } from "@/lib/sanity";
import { siteConfig } from "@/lib/site-config";
import { postBySlugQuery } from "../queries";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Post {
  title: string;
  author?: { name: string };
}

export default async function OgImage({ params }: { params: { slug: string } }) {
  const post = await sanityFetch<Post | null>({
    query: postBySlugQuery,
    params: { slug: params.slug },
  });
  const title = post?.title ?? "Transcribatron";
  const author = post?.author?.name ?? siteConfig.name;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FAF8F3",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 24, color: "#FF6B00" }}>{siteConfig.name} — Blog</div>
        <div style={{ fontSize: 72, color: "#151510", lineHeight: 1.1, fontWeight: 600 }}>
          {title}
        </div>
        <div style={{ fontSize: 24, color: "#4A4740" }}>By {author}</div>
      </div>
    ),
    size
  );
}
```

- [ ] **Step 3: Write failing test `tests/unit/sitemap.test.ts`**

```ts
import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/sanity", () => ({
  sanityFetch: vi.fn(),
}));

import sitemap from "@/app/sitemap";
import { sanityFetch } from "@/lib/sanity";

describe("sitemap", () => {
  it("includes all static routes and dynamic Sanity slugs", async () => {
    vi.mocked(sanityFetch).mockImplementation(async ({ query }) => {
      if (query.includes('_type == "post"')) return ["hello-world"] as never;
      if (query.includes('_type == "docArticle"')) return ["getting-started"] as never;
      return [] as never;
    });
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://transcribatron.com/");
    expect(urls).toContain("https://transcribatron.com/features");
    expect(urls).toContain("https://transcribatron.com/blog/hello-world");
    expect(urls).toContain("https://transcribatron.com/docs/getting-started");
  });
});
```

- [ ] **Step 4: `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { sanityFetch } from "@/lib/sanity";
import { allPostSlugsQuery } from "./blog/queries";
import { allDocSlugsQuery } from "./docs/queries";

const staticRoutes = [
  { path: "/", priority: 1.0 },
  { path: "/features", priority: 0.9 },
  { path: "/pricing", priority: 0.9 },
  { path: "/download", priority: 0.9 },
  { path: "/blog", priority: 0.8 },
  { path: "/docs", priority: 0.8 },
  { path: "/support", priority: 0.6 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugs, docSlugs] = await Promise.all([
    sanityFetch<string[]>({ query: allPostSlugsQuery, tags: ["posts"] }),
    sanityFetch<string[]>({ query: allDocSlugsQuery, tags: ["docs"] }),
  ]);

  const now = new Date();

  return [
    ...staticRoutes.map((r) => ({
      url: `${siteConfig.url}${r.path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: r.priority,
    })),
    ...postSlugs.map((slug) => ({
      url: `${siteConfig.url}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...docSlugs.map((slug) => ({
      url: `${siteConfig.url}/docs/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
```

Note: sitemap URL uses trailing slash on `/`. The test above uses `https://transcribatron.com/` — adjust the test to strip trailing slashes on static routes if needed. In `staticRoutes`, use `"/"` for root, others without trailing slash. When building the URL, root becomes `https://transcribatron.com/` and features becomes `https://transcribatron.com/features`. Test expectation matches.

- [ ] **Step 5: `src/app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/studio/"] },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
```

- [ ] **Step 6: Run tests**

```bash
npm run test:unit -- sitemap
```

Expected: pass.

- [ ] **Step 7: Commit**

```bash
git add src/app/opengraph-image.tsx src/app/blog/[slug]/opengraph-image.tsx src/app/sitemap.ts src/app/robots.ts tests/unit/sitemap.test.ts
git commit -m "feat: OG images, sitemap, robots.txt"
```

---

## Task 23: Fetch siteSettings from Sanity + wire App Store URLs

**Files:**
- Create: `src/lib/site-settings.ts`
- Modify: `src/app/page.tsx`, `src/app/features/page.tsx`, `src/app/pricing/page.tsx`, `src/app/download/page.tsx` — replace hardcoded `null` URLs with Sanity fetch

**Interfaces:**
- Produces: `getSiteSettings()` — cached fetch of the singleton `siteSettings` doc, returns `{ appStoreUrl, macAppStoreUrl, currentVersion }`

- [ ] **Step 1: `src/lib/site-settings.ts`**

```ts
import { sanityFetch } from "./sanity";

interface SiteSettings {
  siteName?: string;
  appStoreUrl?: string | null;
  macAppStoreUrl?: string | null;
  currentVersion?: string | null;
}

const query = /* groq */ `*[_type == "siteSettings"][0] {
  siteName, appStoreUrl, macAppStoreUrl, currentVersion
}`;

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await sanityFetch<SiteSettings | null>({
    query,
    tags: ["siteSettings"],
  });
  return settings ?? {};
}
```

- [ ] **Step 2: Update pages that render App Store URLs**

Each of `src/app/page.tsx`, `src/app/features/page.tsx`, `src/app/pricing/page.tsx`, `src/app/download/page.tsx`:

```tsx
import { getSiteSettings } from "@/lib/site-settings";

// In the async default export, replace hardcoded nulls:
const { appStoreUrl, macAppStoreUrl } = await getSiteSettings();
```

Make each page component `async` if it isn't already, and drop the manual `const appStoreUrl: string | null = null` lines.

- [ ] **Step 3: Commit**

```bash
git add src/lib/site-settings.ts src/app/page.tsx src/app/features src/app/pricing src/app/download
git commit -m "feat: pull App Store URLs from Sanity siteSettings"
```

---

## Task 24: vercel.ts + `.gitignore` + `.env` polish

**Files:**
- Create: `vercel.ts`
- Modify: `.gitignore`
- Delete: `next.config.ts` (if defaults suffice) — or keep and configure
- Modify: `README.md` with setup instructions

**Interfaces:**
- Produces: Vercel deployment config (headers, redirects, framework declaration)

- [ ] **Step 1: Install `@vercel/config`**

```bash
npm install -D @vercel/config
```

- [ ] **Step 2: `vercel.ts`**

Reference: `vercel.md` in Vercel plugin docs (session-loaded context). Prefer `vercel.ts` over `vercel.json`.

```ts
import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  framework: "nextjs",
  buildCommand: "npm run build",
  headers: [
    routes.cacheControl("/opengraph-image", { public: true, maxAge: "1 hour" }),
    routes.cacheControl("/_next/static/(.*)", { public: true, maxAge: "1 year", immutable: true }),
  ],
  redirects: [
    routes.redirect("/rss", "/blog/rss.xml", { permanent: true }),
  ],
};
```

- [ ] **Step 3: Update `.gitignore`**

Add to `.gitignore`:

```
.env
.env.local
.env.*.local
.vercel
.lighthouseci
playwright-report/
test-results/
```

- [ ] **Step 4: Write a bare `README.md`**

```markdown
# Transcribatron marketing site

## Setup

1. `npm install`
2. `cp .env.example .env.local` and fill in values (see below)
3. `npm run dev` — site at http://localhost:3000, Sanity Studio at http://localhost:3000/studio

## Environment variables

See `.env.example`. Required for full functionality:

- `NEXT_PUBLIC_SITE_URL` — canonical URL for the site
- `NEXT_PUBLIC_SANITY_PROJECT_ID` + `NEXT_PUBLIC_SANITY_DATASET` — Sanity project
- `SANITY_API_READ_TOKEN` — Sanity read token (server-only)
- `SANITY_REVALIDATE_SECRET` — shared secret for `/api/revalidate` webhook

## Scripts

- `npm run dev` — Next dev server
- `npm run build` — production build
- `npm run start` — production server
- `npm test` — unit + e2e
- `npm run test:unit` — vitest
- `npm run test:e2e` — playwright
- `npm run typecheck` — tsc --noEmit
- `npm run typegen` — regenerate Sanity types (`sanity.types.ts`)

## Deploying

Pushed to `main` → Vercel deploys automatically. PRs get preview URLs.

## Sanity content updates

Publish in the Studio → the Sanity webhook posts to `/api/revalidate` → new content is live in seconds without a redeploy.
```

- [ ] **Step 5: Commit**

```bash
git add vercel.ts .gitignore README.md package.json package-lock.json
git commit -m "chore: vercel.ts, .gitignore, README setup docs"
```

---

## Task 25: Launch checklist doc + final smoke pass

**Files:**
- Create: `docs/launch-checklist.md`
- Modify: `tests/smoke.spec.ts` (final comprehensive pass covering blog + docs + rss + sitemap)

**Interfaces:**
- Produces: single-page runbook of everything that needs to happen before/at launch

- [ ] **Step 1: `docs/launch-checklist.md`**

```markdown
# Launch Checklist

## Content
- [ ] Sanity Studio deployed (embedded at /studio)
- [ ] `siteSettings` populated with real App Store + Mac App Store URLs
- [ ] `siteSettings` populated with current app version
- [ ] At least 3 initial blog posts published in Sanity
- [ ] At least 10 initial docs articles published in Sanity, grouped into sections
- [ ] Real screenshots swapped in for all `<Screenshot>` placeholders (search codebase for `src=""` and `alt` without `src`)
- [ ] Logo asset added at `public/logo.png` (from Transcribatron app icons)
- [ ] Copy reviewed by user

## Legal
- [ ] **⚠ `/privacy` reviewed by a lawyer** — current text is a template
- [ ] **⚠ `/terms` reviewed by a lawyer** — current text is a template
- [ ] `support@transcribatron.com`, `privacy@transcribatron.com`, `legal@transcribatron.com`, `hello@transcribatron.com` email addresses live

## Infrastructure
- [ ] Domain purchased and pointed at Vercel
- [ ] `www` → apex redirect configured
- [ ] HTTPS live (Vercel automatic)
- [ ] Vercel env vars set in Production: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`
- [ ] Sanity webhook configured — URL `https://<domain>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`; trigger on create, update, delete for `post`, `docArticle`, `docSection`, `category`, `author`, `siteSettings`

## SEO
- [ ] Google Search Console verified, `/sitemap.xml` submitted
- [ ] Bing Webmaster Tools verified, sitemap submitted
- [ ] Open Graph tags verified with https://www.opengraph.xyz/
- [ ] JSON-LD verified with https://validator.schema.org/
- [ ] RSS feed validates: https://validator.w3.org/feed/check.cgi

## Quality gates
- [ ] `npm run typecheck` green
- [ ] `npm run test:unit` green
- [ ] `npm run test:e2e` green
- [ ] Lighthouse CI green on production deploy
  - Performance ≥ 0.9
  - Accessibility ≥ 0.95
  - SEO ≥ 0.98
  - LCP < 2s
  - CLS < 0.05
- [ ] Manual keyboard nav pass on all pages
- [ ] Manual test on iPhone Safari + macOS Safari + Chrome
```

- [ ] **Step 2: Extend `tests/smoke.spec.ts` to full coverage**

Replace or extend the existing file with the final pass:

```ts
import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/features",
  "/pricing",
  "/download",
  "/blog",
  "/docs",
  "/support",
  "/privacy",
  "/terms",
];

for (const route of routes) {
  test(`${route} — renders, no console errors, exactly one h1`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toHaveCount(1);
    expect(errors).toEqual([]);
  });
}

test("sitemap.xml returns valid XML", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain("<urlset");
  expect(body).toContain("<loc>");
});

test("robots.txt returns 200", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain("Sitemap:");
});

test("blog rss.xml returns valid XML", async ({ request }) => {
  const res = await request.get("/blog/rss.xml");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toMatch(/xml/);
});

test("landing has meta description", async ({ page }) => {
  await page.goto("/");
  const desc = await page.locator('meta[name="description"]').getAttribute("content");
  expect(desc).toBeTruthy();
  expect(desc!.length).toBeGreaterThan(50);
});

test("landing has OG image", async ({ page }) => {
  await page.goto("/");
  const og = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(og).toBeTruthy();
});
```

- [ ] **Step 3: Run full test suite**

```bash
npm run typecheck && npm run test:unit && npm run test:e2e
```

Expected: all green.

- [ ] **Step 4: Commit**

```bash
git add docs/launch-checklist.md tests/smoke.spec.ts
git commit -m "docs: launch checklist and final smoke test pass"
```

---

## Self-Review

**1. Spec coverage:**

| Spec section | Tasks | Status |
|---|---|---|
| §5.1 Routes | 12–14, 15, 18, 19, 21, 22 | ✓ |
| §5.2 Rendering strategy (static + revalidate) | 18, 19, 20 | ✓ |
| §5.3 Component layers | 4–10 | ✓ |
| §5.4 Data flow (Sanity client + typed) | 16 | ✓ |
| §6.1 Color tokens | 1 | ✓ |
| §6.2 Typography (Inter + Instrument Serif) | 1 | ✓ |
| §6.3 Spacing & layout | 1, 4 | ✓ |
| §6.4 Motion (CSS-only, reduced-motion) | 1, 5 | ✓ |
| §6.5 Iconography (lucide) | 6, 10, 17 | ✓ |
| §6.6 Screenshot component | 5 | ✓ |
| §7.1 Landing | 12 | ✓ |
| §7.2 Features | 13 | ✓ |
| §7.3 Pricing | 13 | ✓ |
| §7.4 Download | 13 | ✓ |
| §7.5 Blog | 18 | ✓ |
| §7.6 Docs | 19 | ✓ |
| §7.7 Support | 14 | ✓ |
| §7.8 Privacy + Terms | 14 | ✓ |
| §8.1 Per-page metadata | 13, 14, 18, 19 | ✓ |
| §8.2 Dynamic OG images | 22 | ✓ |
| §8.3 JSON-LD | 21 | ✓ |
| §8.4 Sitemap + robots | 22 | ✓ |
| §8.5 On-page discipline (single h1, alt required) | 5, 25 | ✓ |
| §8.6 Core Web Vitals targets | 3 (Lighthouse budgets) | ✓ |
| §9 Sanity schemas | 15 | ✓ |
| §10 Analytics | 6, 12 (`cta_appstore_click`) | ✓ |
| §11 Deployment (vercel.ts, env, webhook) | 24, 20, 15 | ✓ |
| §12 Testing (Lighthouse CI, Playwright, Vitest, tsc) | 3, 25 | ✓ |
| §13 Accessibility | 1, 2, 25 | ✓ |
| §14 Launch checklist | 25 | ✓ |
| §15 Out of scope (no newsletter, no dark mode, no Framer Motion) | Global constraints | ✓ |

No gaps identified.

**2. Placeholder scan:**
No "TBD", "TODO", "implement later", "fill in details", "add error handling", "similar to Task N" without code. Each task ships runnable code.

**3. Type consistency:**
- `sanityFetch` signature stable across Tasks 16, 18, 19, 20, 22, 23
- `Screenshot` prop signature stable (`device`, `src?`, `alt`, `caption?`, `className?`, `priority?`) across Tasks 5, 8, 9
- `AppStoreBadge` prop signature stable (`platform`, `href?`, `position?`, `className?`) across Tasks 6, 7, 8, 9, 10, 12, 13
- `FaqItem` type exported from `FaqAccordion` in Task 10 and consumed in Task 11 (`faq.ts`)
- `ComparisonRow` type exported from `ComparisonTable` in Task 10 and consumed in Task 11 (`comparison.ts`)
- `getSiteSettings` return shape (`{ appStoreUrl, macAppStoreUrl, currentVersion }`) consistent in Task 23

No inconsistencies.
