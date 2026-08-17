import { AppStoreBadge } from "./AppStoreBadge";

interface HeroCtasProps {
  appStoreUrl?: string | null;
  macAppStoreUrl?: string | null;
}

// The two App Store download badges. Shared across hero variants.
export function HeroCtas({ appStoreUrl, macAppStoreUrl }: HeroCtasProps) {
  return (
    <div
      className="hero-rise-in mt-8 flex flex-wrap gap-3"
      style={{ animationDelay: "1.1s" }}
    >
      <AppStoreBadge platform="ios" href={appStoreUrl} position="hero" />
      <AppStoreBadge platform="mac" href={macAppStoreUrl} position="hero" />
    </div>
  );
}
