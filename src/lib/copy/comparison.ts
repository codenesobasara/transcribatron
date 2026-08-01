import type { Cell, ComparisonRow } from "@/components/marketing/ComparisonTable";

// Terse cell builders keep the matrix readable.
const yes = (note?: string): Cell => ({ state: "yes", note });
const no = (note?: string): Cell => ({ state: "no", note });
const part = (note?: string): Cell => ({ state: "partial", note });

export const comparisonCompetitors = [
  "Wispr Flow",
  "Superwhisper",
  "MacWhisper",
  "Granola",
  "VoiceInk",
] as const;

type Comp = (typeof comparisonCompetitors)[number];

function row(
  feature: string,
  transcribatron: Cell,
  cells: Record<Comp, Cell>
): ComparisonRow {
  return { feature, transcribatron, competitors: cells };
}

export const comparisonRows: readonly ComparisonRow[] = [
  row("One-time purchase available", yes("$9.99"), {
    "Wispr Flow": no(),
    Superwhisper: yes("$249.99"),
    MacWhisper: yes("€64"),
    Granola: no(),
    VoiceInk: yes("From $29*"),
  }),
  row("No subscription required", yes(), {
    "Wispr Flow": no(),
    Superwhisper: part(),
    MacWhisper: yes(),
    Granola: no(),
    VoiceInk: yes(),
  }),
  row("Mac system-wide dictation", yes(), {
    "Wispr Flow": yes(),
    Superwhisper: yes(),
    MacWhisper: yes(),
    Granola: no(),
    VoiceInk: yes(),
  }),
  row("iPhone dictation keyboard", yes(), {
    "Wispr Flow": yes(),
    Superwhisper: yes(),
    MacWhisper: no(),
    Granola: no(),
    VoiceInk: part("Beta"),
  }),
  row("Local / offline transcription", yes(), {
    "Wispr Flow": no(),
    Superwhisper: yes(),
    MacWhisper: yes(),
    Granola: no(),
    VoiceInk: yes(),
  }),
  row("Built-in local AI cleanup", yes(), {
    "Wispr Flow": no(),
    Superwhisper: yes(),
    MacWhisper: part("External local setup"),
    Granola: no(),
    VoiceInk: part(),
  }),
  row("Cloud AI optional, not required", yes(), {
    "Wispr Flow": no(),
    Superwhisper: yes(),
    MacWhisper: yes(),
    Granola: no(),
    VoiceInk: yes(),
  }),
  row("Bring your own API key", yes(), {
    "Wispr Flow": no(),
    Superwhisper: yes(),
    MacWhisper: yes(),
    Granola: no(),
    VoiceInk: part(),
  }),
  row("Meeting recording and transcription", yes(), {
    "Wispr Flow": yes("Cloud required"),
    Superwhisper: yes(),
    MacWhisper: yes(),
    Granola: yes(),
    VoiceInk: no(),
  }),
  row("Meeting summaries and analysis", yes(), {
    "Wispr Flow": yes(),
    Superwhisper: part("Custom modes"),
    MacWhisper: part("Prompts"),
    Granola: yes(),
    VoiceInk: no(),
  }),
  row("Chat with meeting transcripts", yes(), {
    "Wispr Flow": no(),
    Superwhisper: no(),
    MacWhisper: no(),
    Granola: yes(),
    VoiceInk: no(),
  }),
  row("Live AI meeting coach", yes(), {
    "Wispr Flow": no(),
    Superwhisper: no(),
    MacWhisper: no(),
    Granola: no(),
    VoiceInk: no(),
  }),
  row("Speaker identification", yes("Voiceprints"), {
    "Wispr Flow": part(),
    Superwhisper: part(),
    MacWhisper: yes("Speaker recognition"),
    Granola: yes("Speaker tags"),
    VoiceInk: no(),
  }),
  row("Import audio and video files", yes(), {
    "Wispr Flow": no(),
    Superwhisper: yes(),
    MacWhisper: yes(),
    Granola: no(),
    VoiceInk: no(),
  }),
  row("Analyze PDFs, documents, links and scans", yes(), {
    "Wispr Flow": no(),
    Superwhisper: no(),
    MacWhisper: no(),
    Granola: no(),
    VoiceInk: no(),
  }),
  row("Read documents and transcripts aloud", yes(), {
    "Wispr Flow": no(),
    Superwhisper: no(),
    MacWhisper: no(),
    Granola: no(),
    VoiceInk: no(),
  }),
  row("Karaoke highlighting and speed reading", yes(), {
    "Wispr Flow": no(),
    Superwhisper: no(),
    MacWhisper: no(),
    Granola: no(),
    VoiceInk: no(),
  }),
  row("Bidirectional Obsidian sync", yes(), {
    "Wispr Flow": no(),
    Superwhisper: no(),
    MacWhisper: part("Export / integration"),
    Granola: no(),
    VoiceInk: no(),
  }),
  row("Local and cloud model choice", yes(), {
    "Wispr Flow": no("Cloud only"),
    Superwhisper: yes(),
    MacWhisper: yes(),
    Granola: no("Cloud only"),
    VoiceInk: part(),
  }),
  row("iPhone and Mac included", yes(), {
    "Wispr Flow": yes(),
    Superwhisper: yes(),
    MacWhisper: no("Mac only"),
    Granola: yes(),
    VoiceInk: part("iOS beta"),
  }),
  row("One app covering all these workflows", yes(), {
    "Wispr Flow": no(),
    Superwhisper: no(),
    MacWhisper: no(),
    Granola: no(),
    VoiceInk: no(),
  }),
];
