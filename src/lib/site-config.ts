export const siteConfig = {
  name: "Transcribatron",
  tagline: "Say more. Spend less.",
  description:
    "Transcribe meetings, dictations and imports on your iPhone and Mac. Pay once. No subscription.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://transcribatron.com",
  appStoreUrl: "https://apps.apple.com/app/id6760924349",
  price: {
    amount: 9.99,
    currency: "USD",
    displayShort: "$9.99",
    displayLong: "$9.99 once, no subscription",
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
