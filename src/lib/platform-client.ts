"use client";
import { useSyncExternalStore } from "react";

// Platform never changes after load, so subscribing is a no-op.
const subscribe = () => () => {};

const isIosSnapshot = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  // iPadOS Safari reports a Macintosh UA; touch points give it away.
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const isAppleSnapshot = () =>
  isIosSnapshot() || /Macintosh|Mac OS X/.test(navigator.userAgent);

// Server snapshots pick the safe fallback for no-JS visitors and crawlers:
// not iOS (no App Store link claimed) but Apple (CTAs render as plain links
// or inert badges rather than dialog triggers that need JS to do anything).
export const useIsIos = () => useSyncExternalStore(subscribe, isIosSnapshot, () => false);
export const useIsApple = () => useSyncExternalStore(subscribe, isAppleSnapshot, () => true);
