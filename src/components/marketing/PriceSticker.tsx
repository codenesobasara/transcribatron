import { cn } from "@/lib/utils";

interface PriceStickerProps {
  /** Small sticker for tight spots (e.g. beside the mobile hero title):
      price + "once" only, no trial line. */
  compact?: boolean;
  className?: string;
}

// The "peel sticker" price callout: tilted orange gradient badge with a sheen
// and a bottom lip so it reads dimensional, not flat. Shared across hero variants.
export function PriceSticker({ compact = false, className }: PriceStickerProps) {
  return (
    <div
      className={cn("hero-rise-in", !compact && "mt-8", className)}
      style={{ animationDelay: "0.95s" }}
    >
      <div
        className={cn(
          "inline-flex flex-col items-start rounded-2xl bg-gradient-to-b from-[#FF7A1F] to-[#E35D00] text-bg ring-1 ring-[#B84A00]/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_3px_0_0_#B84A00,0_18px_30px_-12px_rgba(0,0,0,0.65),0_7px_16px_-8px_rgba(227,93,0,0.28)]",
          compact ? "-rotate-3 px-3.5 py-2.5" : "-rotate-2 px-6 py-4"
        )}
      >
        <div className={cn("flex items-baseline", compact ? "gap-1.5" : "gap-2.5")}>
          <span
            className={cn(
              "font-serif leading-none",
              compact ? "text-3xl" : "text-5xl md:text-6xl"
            )}
          >
            $9.99
          </span>
          <span
            className={cn(
              "font-bold uppercase tracking-wider",
              compact ? "text-xs" : "text-base"
            )}
          >
            once
          </span>
        </div>
        {!compact && (
          <div className="mt-1.5 text-sm font-semibold">
            Free trial &middot; no subscription, ever
          </div>
        )}
      </div>
    </div>
  );
}
