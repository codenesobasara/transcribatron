"use client";
import { track } from "@vercel/analytics/react";
import { cn } from "@/lib/utils";

interface AppStoreBadgeProps {
  platform: "ios" | "mac";
  href?: string | null;
  position?: string;
  className?: string;
}

export function AppStoreBadge({ platform, href, position = "unknown", className }: AppStoreBadgeProps) {
  const label = platform === "ios" ? "Download on the App Store" : "Download on the Mac App Store";
  const disabled = !href;

  const badge = (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-2xl bg-ink text-bg px-5 py-3 transition",
        !disabled && "hover:bg-ink-2",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <AppleGlyph className="w-8 h-8" />
      <div className="text-left leading-tight">
        <div className="text-[10px] uppercase tracking-wide opacity-80">
          {disabled ? "Coming soon" : "Download on the"}
        </div>
        <div className="text-lg font-semibold">
          {platform === "ios" ? "App Store" : "Mac App Store"}
        </div>
      </div>
    </div>
  );

  if (disabled) {
    return <div role="img" aria-label={`${label} — coming soon`}>{badge}</div>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      onClick={() => track("cta_appstore_click", { platform, position })}
    >
      {badge}
    </a>
  );
}

function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.04c-.03-2.86 2.34-4.24 2.44-4.31-1.33-1.95-3.4-2.22-4.14-2.25-1.76-.18-3.44 1.04-4.34 1.04-.9 0-2.28-1.01-3.75-.98-1.93.03-3.72 1.13-4.71 2.86-2.01 3.48-.52 8.63 1.44 11.46.96 1.38 2.11 2.94 3.61 2.88 1.45-.06 2-.94 3.75-.94 1.75 0 2.24.94 3.77.9 1.56-.03 2.55-1.4 3.5-2.79 1.11-1.6 1.56-3.16 1.58-3.24-.03-.01-3.03-1.16-3.06-4.63zM14.44 3.44c.8-.97 1.34-2.32 1.19-3.66-1.15.05-2.55.77-3.38 1.73-.74.87-1.39 2.24-1.22 3.55 1.29.1 2.6-.65 3.41-1.62z" />
    </svg>
  );
}
