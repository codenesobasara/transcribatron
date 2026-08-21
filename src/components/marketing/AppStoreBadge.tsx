"use client";
import Image from "next/image";
import { track } from "@vercel/analytics/react";
import { ComingSoonDialog } from "./ComingSoonDialog";
import { useIsApple } from "@/lib/platform-client";
import { cn } from "@/lib/utils";

interface AppStoreBadgeProps {
  platform: "ios" | "mac";
  href?: string | null;
  position?: string;
  size?: "default" | "sm";
  className?: string;
}

// Official Apple badge artwork (from Apple Marketing Tools). Intrinsic ratios differ per badge.
const BADGE = {
  ios: { src: "/badges/app-store.svg", alt: "Download on the App Store", w: 120, h: 40 },
  mac: { src: "/badges/mac-app-store.svg", alt: "Download on the Mac App Store", w: 156, h: 40 },
} as const;

export function AppStoreBadge({ platform, href, position = "unknown", size = "default", className }: AppStoreBadgeProps) {
  const badge = BADGE[platform];
  const disabled = !href;
  const isApple = useIsApple();
  const height = size === "sm" ? 40 : 52;

  const img = (
    <Image
      src={badge.src}
      alt={badge.alt}
      width={badge.w}
      height={badge.h}
      unoptimized
      priority={position === "hero"}
      className={cn("w-auto", className)}
      style={{ height }}
    />
  );

  if (disabled) {
    // Windows/Android visitors get the coming-soon dialog instead of a dead
    // badge; Apple platforms without a link (Mac, pre-launch) stay inert.
    if (!isApple) {
      return (
        <ComingSoonDialog position={position}>
          <button type="button" aria-label={badge.alt} className="inline-flex cursor-pointer transition-opacity hover:opacity-80">
            {img}
          </button>
        </ComingSoonDialog>
      );
    }
    return <span className="inline-flex" role="img" aria-label={badge.alt}>{img}</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={badge.alt}
      className="inline-flex transition-opacity hover:opacity-80"
      onClick={() => track("cta_appstore_click", { platform, position })}
    >
      {img}
    </a>
  );
}
