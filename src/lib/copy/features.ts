export interface FeatureCopy {
  title: string;
  body: string;
  bullets: readonly string[];
  screenshot: { device: "iphone" | "mac"; alt: string; src?: string };
}

export const featuresJourney: readonly FeatureCopy[] = [
  {
    title: "Record meetings, get more than a transcript",
    body:
      "Hit record. Meeting Buddy listens in the background and gives you real-time coaching: angles you missed, questions to ask, moments to circle back to.",
    bullets: [
      "Personas: Negotiator, Reporter, Therapist, Closer, and more",
      "Auto-links to your calendar event and attendees",
      "Runs on-device, nothing is uploaded",
    ] as const,
    screenshot: { device: "iphone", alt: "Meeting Buddy live coaching a call" },
  },
  {
    title: "Know who's talking",
    body:
      "Speaker diarization labels each voice, and voiceprint enrollment remembers people. Meet Sarah once and she's 'Sarah' in every future meeting.",
    bullets: [
      "Auto-labels 'Speaker 1', 'Speaker 2' out of the box",
      "Enroll named voiceprints with a 15-second sample",
      "Reidentifies across meetings without cloud upload",
    ] as const,
    screenshot: { device: "mac", alt: "Transcript with named speaker labels" },
  },
  {
    title: "Clean and analyze with AI, your choice of model",
    body:
      "Remove filler, fix grammar, structure as bullets, extract action items. Runs locally on Qwen or Phi, or bring your own API key for Claude, GPT, Gemini, or Grok.",
    bullets: [
      "12 built-in templates + unlimited custom",
      "'Write like Hemingway' or 'Turn into a sales email'",
      "Chat with the transcript, ask questions about the meeting",
    ] as const,
    screenshot: { device: "mac", alt: "AI cleanup and analysis panel" },
  },
  {
    title: "Yours forever. Sync with the tools you use",
    body:
      "Bidirectional Obsidian sync, Apple Notes export, subtitle export (.srt/.vtt), and an MCP server so Claude Code can read your meetings.",
    bullets: [
      "iCloud sync across your devices, at no cost",
      "Import audio, video, podcasts, PDFs, articles, screenshots",
      "Never a subscription, never an ad, never tracked",
    ] as const,
    screenshot: { device: "mac", alt: "Obsidian sync and Apple Notes export" },
  },
];
