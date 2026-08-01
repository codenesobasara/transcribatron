import type { FaqItem } from "@/components/marketing/FaqAccordion";

export const landingFaq: readonly FaqItem[] = [
  {
    q: "Is it really a one-time purchase?",
    a: "Yes. $9.99 on the App Store, and you own it forever, including future updates. No subscription, no per-minute fees, no 'pro' tier.",
  },
  {
    q: "Does my audio leave my device?",
    a: "No. Transcription, speaker recognition, and cleanup all run on-device by default. If you want to use a cloud LLM for cleanup (Claude, GPT, Gemini, Grok), you bring your own API key and pay the provider directly. We don't see or store anything.",
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
    a: "Yes. Transcribatron supports Family Sharing on the App Store. One purchase, up to six family members.",
  },
  {
    q: "What if I don't like it?",
    a: "Standard Apple App Store refund policy applies. Request a refund through Apple within 14 days and you'll be reimbursed.",
  },
] as const;

export const pricingFaq: readonly FaqItem[] = [
  ...landingFaq,
  {
    q: "Do you offer an education discount?",
    a: "Not currently. At $9.99 for lifetime, we think the price is already student-friendly.",
  },
  {
    q: "Will future major versions cost extra?",
    a: "No. Every update, feature or bugfix, is included in your original purchase, forever.",
  },
] as const;
