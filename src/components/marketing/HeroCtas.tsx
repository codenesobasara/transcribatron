import { AppStoreBadge } from "./AppStoreBadge";

interface HeroCtasProps {
  appStoreUrl?: string | null;
  macAppStoreUrl?: string | null;
  showMacBadge?: boolean;
}

// The App Store download badges. Shared across hero variants. The Mac badge
// is hidden for iPhone/iPad visitors (no point advertising the Mac store there).
export function HeroCtas({ appStoreUrl, macAppStoreUrl, showMacBadge = true }: HeroCtasProps) {
  return (
    <div
      className="hero-rise-in mt-8 flex flex-wrap gap-3"
      style={{ animationDelay: "1.1s" }}
    >
      <AppStoreBadge platform="ios" href={appStoreUrl} position="hero" />
      {showMacBadge && <AppStoreBadge platform="mac" href={macAppStoreUrl} position="hero" />}
    </div>
  );
}
