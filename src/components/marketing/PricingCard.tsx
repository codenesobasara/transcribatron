import { Check } from "lucide-react";
import { AppStoreBadge } from "./AppStoreBadge";

interface PricingCardProps {
  price: { display: string; caption: string };
  includes: readonly string[];
  appStoreUrl?: string | null;
  macAppStoreUrl?: string | null;
  showMacBadge?: boolean;
}

export function PricingCard({ price, includes, appStoreUrl, macAppStoreUrl, showMacBadge = true }: PricingCardProps) {
  return (
    <div className="rounded-2xl border border-sep bg-surface p-8 md:p-12 max-w-2xl mx-auto text-center shadow-sm">
      <div className="text-sm font-medium text-accent tracking-wide uppercase">Lifetime</div>
      <div className="mt-2 font-serif text-6xl md:text-7xl text-ink">{price.display}</div>
      <div className="mt-2 text-ink-2">{price.caption}</div>

      <ul className="mt-8 space-y-3 text-left max-w-md mx-auto">
        {includes.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-ink-2">
            <Check className="w-5 h-5 text-positive shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <AppStoreBadge platform="ios" href={appStoreUrl} position="pricing" />
        {showMacBadge && <AppStoreBadge platform="mac" href={macAppStoreUrl} position="pricing" />}
      </div>
    </div>
  );
}
