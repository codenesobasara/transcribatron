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
] as const;
