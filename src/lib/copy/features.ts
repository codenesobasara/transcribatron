import type { StaticImageData } from "next/image";
import section2Iphone from "../../../Assets/Images/Home Page section 2/Transcriptioon app Privacy Screenshot Iphone.png";
import section2Ipad from "../../../Assets/Images/Home Page section 2/Transcriptioon app Privacy Screenshot Ipad.png";
import section2Mac from "../../../Assets/Images/Home Page section 2/Transcription app mac scrrenshot.png";
import section3Iphone from "../../../Assets/Images/Home PAge Section 3/transcribatron diarization iphone.png";
import section3Ipad from "../../../Assets/Images/Home PAge Section 3/transcribatron diarization ipad.png";
import section3Mac from "../../../Assets/Images/Home PAge Section 3/transcribatron diarization mac.png";
import section4Iphone from "../../../Assets/Images/Secttion 4/Transcribatron analyze transcriptions with ai iphone.png";
import section4Ipad from "../../../Assets/Images/Secttion 4/Transcribatron analyze transcriptions with ai ipad.png";
import section4Mac from "../../../Assets/Images/Secttion 4/Transcribatron analyze transcriptions with ai mac.png";
import section5Iphone from "../../../Assets/Images/Section 5/transcribatron transcription app sync with obsedian and apple notes Iphone.png";
import section5Ipad from "../../../Assets/Images/Section 5/transcribatron transcription app sync with obsedian and apple notes ipad.png";
import section5Mac from "../../../Assets/Images/Section 5/transcribatron transcription app sync with obsedian and apple notes mac.png";

export interface FeatureCopy {
  /** Anchor id for in-page scroll targets (e.g. hero callout pills). */
  id: string;
  title: string;
  body: string;
  bullets: readonly string[];
  /** Pre-framed device shots (bezel/window already baked in) — rendered plain.
      Picked by the server-resolved device; iPhone is the fallback. */
  shots?: { iphone?: StaticImageData; ipad?: StaticImageData; mac?: StaticImageData };
  /** Device hint for the placeholder frame on features without real shots yet. */
  screenshot: { device: "iphone" | "mac"; alt: string; src?: string };
}

export const featuresJourney: readonly FeatureCopy[] = [
  {
    id: "feature-record",
    title: "Get more than a transcript",
    body:
      "Templates teach Transcribatron what to pull out of any conversation — action items, decisions, follow-ups, whatever matters. Every recording and import comes back as structured notes, not a wall of text.",
    bullets: [
      "Built-in templates, or make your own for any kind of conversation",
      "Action items, decisions, dates, learnings — pulled out automatically",
      "Works on any recording or import, meeting or not",
    ] as const,
    shots: { iphone: section2Iphone, ipad: section2Ipad, mac: section2Mac },
    screenshot: { device: "iphone", alt: "Analysis templates — what Transcribatron pulls out of a conversation" },
  },
  {
    id: "feature-speakers",
    title: "Know who's talking",
    body:
      "Speaker diarization labels each voice, and voiceprint enrollment remembers people. Meet Sarah once and she's 'Sarah' in every future meeting.",
    bullets: [
      "Auto-labels 'Speaker 1', 'Speaker 2' out of the box",
      "Enroll named voiceprints with a 15-second sample",
      "Reidentifies across meetings without cloud upload",
    ] as const,
    shots: { iphone: section3Iphone, ipad: section3Ipad, mac: section3Mac },
    screenshot: { device: "mac", alt: "Transcript with named speaker labels" },
  },
  {
    id: "feature-analyze",
    title: "Clean and analyze with AI, your choice of model",
    body:
      "Remove filler, fix grammar, structure as bullets, extract action items. Runs locally on Qwen or Phi, or bring your own API key for Claude, GPT, Gemini, or Grok.",
    bullets: [
      "12 built-in templates + unlimited custom",
      "'Write like Hemingway' or 'Turn into a sales email'",
      "Chat with the transcript, ask questions about the meeting",
    ] as const,
    shots: { iphone: section4Iphone, ipad: section4Ipad, mac: section4Mac },
    screenshot: { device: "mac", alt: "AI cleanup and analysis panel" },
  },
  {
    id: "feature-sync",
    title: "Yours forever. Sync with the tools you use",
    body:
      "Bidirectional Obsidian sync, Apple Notes export, subtitle export (.srt/.vtt), and an MCP server so Claude Code can read your meetings.",
    bullets: [
      "iCloud sync across your devices, at no cost",
      "Import audio, video, podcasts, PDFs, articles, screenshots",
      "Never a subscription, never an ad, never tracked",
    ] as const,
    shots: { iphone: section5Iphone, ipad: section5Ipad, mac: section5Mac },
    screenshot: { device: "mac", alt: "Obsidian sync and Apple Notes export" },
  },
];
