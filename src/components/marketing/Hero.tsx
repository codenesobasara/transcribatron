import { Container } from "@/components/layout/Container";
import { AppStoreBadge } from "./AppStoreBadge";
import { HeroDeviceShot } from "./HeroDeviceShot";

interface HeroProps {
  appStoreUrl?: string | null;
  macAppStoreUrl?: string | null;
}

export function Hero({ appStoreUrl, macAppStoreUrl }: HeroProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center py-20 md:py-24 overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center max-w-4xl mx-auto">
          <div>
            <h1
              className="hero-rise-in font-serif text-6xl md:text-8xl leading-[0.98] tracking-tight text-ink"
              style={{ animationDelay: "0.55s" }}
            >
              Say more.<br />
              <span className="text-accent">Spend less.</span>
            </h1>
            <p
              className="hero-rise-in mt-6 text-lg md:text-xl text-ink-2 max-w-xl"
              style={{ animationDelay: "0.8s" }}
            >
              The all-in-one voice-to-text for iPhone and Mac. Dictate anywhere,
              record meetings, transcribe imports. Pay once. No subscription.
            </p>
            <div
              className="hero-rise-in mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: "0.95s" }}
            >
              <AppStoreBadge platform="ios" href={appStoreUrl} position="hero" />
              <AppStoreBadge platform="mac" href={macAppStoreUrl} position="hero" />
            </div>
            <div
              className="hero-rise-in mt-6 text-sm text-ink-3"
              style={{ animationDelay: "1.1s" }}
            >
              Start with a free trial, then $9.99 once. No subscription, ever.
            </div>
          </div>
          <div
            className="hero-phone-in flex justify-center lg:justify-end"
            style={{ animationDelay: "0.1s" }}
          >
            <HeroDeviceShot
              altIphone="Transcribatron on iPhone"
              altMac="Transcribatron on Mac"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
