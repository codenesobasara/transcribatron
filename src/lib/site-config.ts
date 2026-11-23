export const siteConfig = {
  name: "Transcribatron",
  tagline: "Say more. Spend less.",
  description:
    "Transcribe meetings, dictations and imports on your iPhone and Mac. Pay once. No subscription.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.transcribatron.ca",
  appStoreUrl: "https://apps.apple.com/app/id6760924349",
  // Same listing: the app is a universal purchase that installs on Apple
  // silicon Macs. Swap this if a separate native Mac listing ever ships.
  macAppStoreUrl: "https://apps.apple.com/app/id6760924349",
  price: {
    amount: 8.99,
    currency: "USD",
    displayShort: "$8.99",
    displayLong: "$8.99 once, no subscription",
  },
  // Only list routes that exist. Features, Pricing, Blog, Docs and Download
  // pages aren't built yet; add their links back when the pages ship.
  nav: [{ href: "/support", label: "Support" }],
  footer: {
    resources: [{ href: "/support", label: "Support" }],
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
