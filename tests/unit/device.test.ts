import { describe, it, expect, vi, beforeEach } from "vitest";

let currentUa = "";
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "user-agent": currentUa }),
}));

import { resolveIsIos, resolveIsMac } from "@/lib/device";

const UA = {
  macSafari:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15",
  macChrome:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  iphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
  windows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  android:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
};

describe("resolveIsMac", () => {
  beforeEach(() => {
    currentUa = "";
  });

  it.each([
    ["macSafari", true],
    ["macChrome", true],
    ["iphone", false],
    ["windows", false],
    ["android", false],
  ] as const)("%s → %s", async (key, expected) => {
    currentUa = UA[key];
    expect(await resolveIsMac()).toBe(expected);
  });

  it("honours ?device= overrides regardless of the real user agent", async () => {
    currentUa = UA.windows;
    expect(await resolveIsMac("mac")).toBe(true);
    currentUa = UA.macSafari;
    expect(await resolveIsMac("iphone")).toBe(false);
    expect(await resolveIsMac("ipad")).toBe(false);
  });

  it("ignores unknown overrides", async () => {
    currentUa = UA.macSafari;
    expect(await resolveIsMac("toaster")).toBe(true);
  });
});

describe("resolveIsIos", () => {
  it("stays false on a Mac and true on an iPhone", async () => {
    currentUa = UA.macSafari;
    expect(await resolveIsIos()).toBe(false);
    currentUa = UA.iphone;
    expect(await resolveIsIos()).toBe(true);
  });
});
