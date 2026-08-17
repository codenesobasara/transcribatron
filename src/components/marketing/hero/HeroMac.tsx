import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { HeroCopy } from "../HeroCopy";
import { PriceSticker } from "../PriceSticker";
import { HeroCtas } from "../HeroCtas";
import { HeroCallouts } from "../HeroCallouts";
import { DeviceSwitcher } from "../DeviceView";
import { heroCalloutsMac } from "@/lib/hero-callouts";
import heroMac from "../../../../Assets/Images/Mac hero image.png";

interface HeroVariantProps {
  appStoreUrl?: string | null;
  macAppStoreUrl?: string | null;
}

// Mac hero. Copy on the left; on wide desktop (xl+) a LARGE Mac window sits
// beside it and bleeds off the right edge for scale, with callout pills
// overlaid. Below `xl` the same window renders full-width in the flow instead.
export function HeroMac({ appStoreUrl, macAppStoreUrl }: HeroVariantProps) {
  return (
    <section className="relative xl:min-h-[85vh] flex items-center pt-10 pb-14 md:py-24 overflow-hidden">
      <Container className="relative z-10">
        <div className="max-w-xl">
          <HeroCopy titleAside={<PriceSticker compact className="xl:hidden" />} />
          <div className="hidden xl:block">
            <PriceSticker />
            <HeroCtas appStoreUrl={appStoreUrl} macAppStoreUrl={macAppStoreUrl} />
            <DeviceSwitcher className="mt-8" />
          </div>
          {/* Below wide-desktop the window can't bleed off the edge, so show it
              full-width in the flow. Same mobile order as the other hero
              variants: shot → device switcher → badges. */}
          <div className="xl:hidden mt-6 flex flex-col items-center">
            <div className="hero-phone-in relative w-full" style={{ animationDelay: "0.1s" }}>
              <div className="phone-shadow overflow-hidden rounded-xl ring-1 ring-white/10">
                <Image
                  src={heroMac}
                  alt="Transcribatron on Mac"
                  priority
                  sizes="(min-width: 640px) 576px, 92vw"
                  className="w-full h-auto"
                />
              </div>
              <HeroCallouts callouts={heroCalloutsMac} />
            </div>
            <DeviceSwitcher className="mt-6" />
            <HeroCtas appStoreUrl={appStoreUrl} macAppStoreUrl={macAppStoreUrl} />
          </div>
        </div>
      </Container>

      {/* Wide desktop: big Mac window, vertically centered, bleeding off the right.
          z-20 keeps it (and its clickable pills) ABOVE the copy Container — the
          Container is full-width, so without this its empty right half would
          intercept every click meant for the pills. It never overlaps the copy,
          so sitting on top is safe. */}
      <div
        className="hero-phone-in hidden xl:block absolute top-1/2 -translate-y-1/2 left-[52%] right-[-12%] z-20"
        style={{ animationDelay: "0.1s" }}
      >
        <div className="relative">
          <div className="phone-shadow overflow-hidden rounded-xl ring-1 ring-white/10">
            <Image
              src={heroMac}
              alt="Transcribatron on Mac"
              priority
              sizes="64vw"
              className="w-full h-auto"
            />
          </div>
          <HeroCallouts callouts={heroCalloutsMac} />
        </div>
      </div>
    </section>
  );
}
