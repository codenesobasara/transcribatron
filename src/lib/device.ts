import { headers } from "next/headers";
import { userAgent } from "next/server";

export type Device = "iphone" | "ipad" | "mac";

const OVERRIDES = new Set<Device>(["iphone", "ipad", "mac"]);

// Server-side device resolution. Reading the request headers opts the page into
// dynamic rendering (intended) and lets us render ONLY the matching hero — no
// client flash, correct Core Web Vitals, and crawlers get real HTML.
//
// Mapping (per product decision): phones → iphone, tablets → ipad, everything
// else (Mac, Windows, Linux desktop, bots) → mac.
//
// This is also the seam where region/locale + localized screenshots will plug
// in later (same request-time context).
//
// Known limitation: modern iPadOS Safari reports a "Macintosh" UA with no
// tablet marker, so it currently resolves to `mac`. Refine with a client-side
// touch check once the iPad shot exists and iPad traffic matters.
export async function resolveDevice(override?: string): Promise<Device> {
  if (override && OVERRIDES.has(override as Device)) {
    return override as Device;
  }

  const { device } = userAgent({ headers: await headers() });
  if (device.type === "mobile") return "iphone";
  if (device.type === "tablet") return "ipad";
  return "mac";
}
