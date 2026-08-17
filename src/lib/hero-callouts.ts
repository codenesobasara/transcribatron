// Floating annotation pills over the hero phone shot. Each points a leader
// line at a spot ON the screenshot (`anchor`) and, when clicked, scrolls to a
// feature section (`targetId`). All coordinates are percentages of the phone
// image box (0–100), so they're easy to nudge without touching layout code.
// `pill` may sit outside 0–100 to float the pill beside the phone.

export interface HeroCallout {
  id: string;
  label: string;
  /** Feature section id to scroll to on click (see src/lib/copy/features.ts). */
  targetId: string;
  /** Point on the screenshot the leader line points at. */
  anchor: { x: number; y: number };
  /** Center of the floating pill on wide (xl+) screens — floats beside the phone. */
  pill: { x: number; y: number };
  /** Center of the pill on narrow screens — overlays the phone (no side room). */
  pillMobile: { x: number; y: number };
}

export const heroCallouts: readonly HeroCallout[] = [
  {
    id: "ask",
    label: "More than a transcript",
    targetId: "feature-record",
    anchor: { x: 34, y: 30 },
    pill: { x: 110, y: 19 },
    pillMobile: { x: 60, y: 15 },
  },
  {
    id: "summary",
    label: "AI summary & actions",
    targetId: "feature-analyze",
    anchor: { x: 26, y: 50 },
    pill: { x: 112, y: 43 },
    pillMobile: { x: 66, y: 44 },
  },
  {
    id: "speaker",
    label: "Know who's talking",
    targetId: "feature-speakers",
    anchor: { x: 30, y: 82 },
    pill: { x: 110, y: 67 },
    pillMobile: { x: 62, y: 70 },
  },
  {
    id: "transcripts",
    label: "Yours forever",
    targetId: "feature-sync",
    anchor: { x: 52, y: 91 },
    pill: { x: 114, y: 91 },
    pillMobile: { x: 58, y: 85 },
  },
] as const;

// Same four callouts, re-anchored to the Mac window layout (sidebar + main
// content, not a phone). Pills overlay the window's emptier right side and
// point left at each feature. Mac hero only renders on desktop, so `pill` and
// `pillMobile` are the same overlay positions.
export const heroCalloutsMac: readonly HeroCallout[] = [
  {
    id: "ask",
    label: "More than a transcript",
    targetId: "feature-record",
    anchor: { x: 26, y: 29 },
    pill: { x: 54, y: 19 },
    pillMobile: { x: 54, y: 19 },
  },
  {
    id: "summary",
    label: "AI summary & actions",
    targetId: "feature-analyze",
    anchor: { x: 18, y: 43 },
    pill: { x: 52, y: 45 },
    pillMobile: { x: 52, y: 45 },
  },
  {
    id: "speaker",
    label: "Know who's talking",
    targetId: "feature-speakers",
    anchor: { x: 20, y: 63 },
    pill: { x: 50, y: 66 },
    pillMobile: { x: 50, y: 66 },
  },
  {
    id: "transcripts",
    label: "Yours forever",
    targetId: "feature-sync",
    anchor: { x: 9, y: 21 },
    pill: { x: 36, y: 9 },
    pillMobile: { x: 36, y: 9 },
  },
] as const;

// Same four callouts, re-anchored to the portrait iPad shot. Pills overlay the
// window (iPad viewers are mostly < xl, and it looks consistent), so `pill` and
// `pillMobile` share the same overlay positions.
export const heroCalloutsIpad: readonly HeroCallout[] = [
  {
    id: "ask",
    label: "More than a transcript",
    targetId: "feature-record",
    anchor: { x: 16, y: 17 },
    pill: { x: 56, y: 11 },
    pillMobile: { x: 56, y: 11 },
  },
  {
    id: "summary",
    label: "AI summary & actions",
    targetId: "feature-analyze",
    anchor: { x: 13, y: 28 },
    pill: { x: 60, y: 27 },
    pillMobile: { x: 60, y: 27 },
  },
  {
    id: "speaker",
    label: "Know who's talking",
    targetId: "feature-speakers",
    anchor: { x: 15, y: 38 },
    pill: { x: 56, y: 40 },
    pillMobile: { x: 56, y: 40 },
  },
  {
    id: "transcripts",
    label: "Yours forever",
    targetId: "feature-sync",
    anchor: { x: 50, y: 91 },
    pill: { x: 52, y: 80 },
    pillMobile: { x: 52, y: 80 },
  },
] as const;
