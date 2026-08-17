"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { HeroCallout } from "@/lib/hero-callouts";
import { CalloutPill } from "./CalloutPill";

const ACCENT = "#FF6B00";

// Wide screens (xl+) have room to float pills beside the phone; below that the
// pills overlay the phone instead. Tracks the same breakpoint reactively.
function useMinWidth(px: number) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${px}px)`);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [px]);
  return matches;
}

interface HeroCalloutsProps {
  className?: string;
  callouts: readonly HeroCallout[];
}

// Overlay that floats annotation pills over the hero phone shot. Sized to the
// phone box via inset-0; a measured pixel size lets the SVG draw straight
// leader lines from each pill to its anchor point on the screenshot.
export function HeroCallouts({ className, callouts }: HeroCalloutsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ w, h }, setSize] = useState({ w: 0, h: 0 });
  const isWide = useMinWidth(1280); // xl: pills float beside the phone
  const posOf = (c: HeroCallout) => (isWide ? c.pill : c.pillMobile);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      ref={ref}
      className={cn("pointer-events-none absolute inset-0 overflow-visible", className)}
    >
      <svg
        width={w}
        height={h}
        className="pointer-events-none absolute inset-0 overflow-visible"
        fill="none"
        aria-hidden
      >
        {w > 0 &&
          callouts.map((c, i) => {
            const pos = posOf(c);
            const ax = (c.anchor.x / 100) * w;
            const ay = (c.anchor.y / 100) * h;
            const px = (pos.x / 100) * w;
            const py = (pos.y / 100) * h;
            return (
              <g
                key={c.id}
                className="callout-line-in"
                style={{ animationDelay: `${1.05 + i * 0.15}s` }}
              >
                <line
                  x1={px}
                  y1={py}
                  x2={ax}
                  y2={ay}
                  stroke={ACCENT}
                  strokeOpacity={0.5}
                  strokeWidth={1.5}
                  strokeDasharray="4 5"
                />
                <circle cx={ax} cy={ay} r={9} fill={ACCENT} fillOpacity={0.16} />
                <circle cx={ax} cy={ay} r={3.5} fill={ACCENT} />
              </g>
            );
          })}
      </svg>

      {callouts.map((c, i) => {
        const pos = posOf(c);
        return (
          <CalloutPill
            key={c.id}
            label={c.label}
            left={pos.x}
            top={pos.y}
            delay={1.15 + i * 0.15}
            compact={!isWide}
            onClick={() => scrollTo(c.targetId)}
          />
        );
      })}
    </div>
  );
}
