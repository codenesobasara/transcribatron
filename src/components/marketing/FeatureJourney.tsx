import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { FeatureShot } from "./FeatureShot";
import { Reveal } from "./Reveal";
import type { FeatureCopy } from "@/lib/copy/features";

function Connector({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("w-0 border-l-2 border-dashed border-accent/30", className)}
    />
  );
}

interface FeatureJourneyProps {
  items: readonly FeatureCopy[];
}

// Vertical thread layout: a dashed line runs down the center, threading
// through each feature's centered title, copy, and device shot.
export function FeatureJourney({ items }: FeatureJourneyProps) {
  return (
    <section className="py-8 md:py-12">
      <Container>
        <div className="flex flex-col items-center text-center">
          {items.map((f, i) => (
            <Reveal key={f.title} className="flex flex-col items-center">
              <h3 className="font-serif text-4xl md:text-5xl leading-tight tracking-tight text-ink max-w-2xl">
                {f.title}
              </h3>
              <p className="mt-5 text-lg text-ink-2 max-w-xl">{f.body}</p>
              {f.bullets && (
                <ul className="mt-6 flex flex-col items-center gap-2 text-ink-2">
                  {f.bullets.map((b, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Connector className="h-16 md:h-24 mt-8" />
              <FeatureShot src={f.screenshot.src} alt={f.screenshot.alt} />
              {i < items.length - 1 && <Connector className="h-16 md:h-24 mt-8" />}
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
