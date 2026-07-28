import { Container } from "@/components/layout/Container";
import { AppStoreBadge } from "./AppStoreBadge";
import { Screenshot } from "./Screenshot";

interface HeroProps {
  appStoreUrl?: string | null;
  macAppStoreUrl?: string | null;
}

export function Hero({ appStoreUrl, macAppStoreUrl }: HeroProps) {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.02] tracking-tight text-ink">
              Say more.<br />
              <span className="text-accent">Spend less.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-ink-2 max-w-xl">
              The all-in-one voice-to-text for iPhone and Mac. Dictate anywhere,
              record meetings, transcribe imports — pay once. No subscription.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <AppStoreBadge platform="ios" href={appStoreUrl} position="hero" />
              <AppStoreBadge platform="mac" href={macAppStoreUrl} position="hero" />
            </div>
            <div className="mt-6 text-sm text-ink-3">
              $9.99 once. Free updates. On-device by default.
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              <Screenshot device="mac" alt="Transcribatron on Mac" priority className="w-[500px] max-w-full" />
              <div className="absolute -bottom-8 -left-8 md:-left-16 w-32 md:w-40">
                <Screenshot device="iphone" alt="Transcribatron on iPhone" priority />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
