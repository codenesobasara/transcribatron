"use client";
import { cn } from "@/lib/utils";

interface CalloutPillProps {
  label: string;
  onClick: () => void;
  /** left/top in % of the overlay box. */
  left: number;
  top: number;
  /** base animation-delay (seconds) so pills stagger in after the phone. */
  delay: number;
  /** Tighter sizing for narrow screens where the pill overlays the phone. */
  compact?: boolean;
}

// A round, transparent pill with an orange low-opacity border. Centering lives
// on the outer wrapper (a static transform) so the button underneath is free to
// run its own transforms: an intro pop, then an infinite attention wiggle. The
// two animations are declared together in `.callout-anim` (globals.css); the
// inline two-value animation-delay times the wiggle to start as the intro ends.
export function CalloutPill({ label, onClick, left, top, delay, compact = false }: CalloutPillProps) {
  return (
    <div
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${left}%`, top: `${top}%` }}
    >
      <button
        type="button"
        onClick={onClick}
        style={{ animationDelay: `${delay}s, ${delay + 0.5}s` }}
        className={cn(
          "callout-anim group pointer-events-auto flex items-center whitespace-nowrap rounded-full border border-accent/40 bg-bg/40 font-medium text-ink shadow-lg shadow-black/20 backdrop-blur-md transition-colors hover:border-accent/80 hover:bg-bg/60 motion-reduce:animate-none",
          compact ? "gap-1.5 py-1 pl-2 pr-2.5 text-xs" : "gap-2 py-1.5 pl-3 pr-4 text-sm"
        )}
      >
        <span
          className={cn(
            "shrink-0 rounded-full bg-accent transition-transform group-hover:scale-125",
            compact ? "h-1 w-1" : "h-1.5 w-1.5"
          )}
        />
        {label}
      </button>
    </div>
  );
}
