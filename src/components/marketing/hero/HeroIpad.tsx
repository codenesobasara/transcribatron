import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { HeroCopy } from "../HeroCopy";
import { PriceSticker } from "../PriceSticker";
import { HeroCtas } from "../HeroCtas";
import { HeroCallouts } from "../HeroCallouts";
import { DeviceSwitcher } from "../DeviceView";
import { heroCalloutsIpad } from "@/lib/hero-callouts";
import heroIpad from "../../../../Assets/Images/Ipad-Hero.png";

interface HeroVariantProps {
  appStoreUrl?: string | null;
  macAppStoreUrl?: string | null;
}

// iPad hero: copy on the left, framed portrait iPad shot on the right with the
// callout pills overlaid. Same shape as the iPhone hero, sized up for the
// larger 3:4 device. Mobile: compact price sticker beside the headline, then
// paragraph → iPad → device switcher → badges, centered.
export function HeroIpad({ appStoreUrl, macAppStoreUrl }: HeroVariantProps) {
  return (
    <section className="relative lg:min-h-[85vh] flex items-center pt-10 pb-14 md:py-24 overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-14 items-center max-w-5xl mx-auto">
          <div>
            <HeroCopy titleAside={<PriceSticker compact className="lg:hidden" />} />
            <div className="hidden lg:block">
              <PriceSticker />
              <HeroCtas appStoreUrl={appStoreUrl} macAppStoreUrl={macAppStoreUrl} />
              <DeviceSwitcher className="mt-8" />
            </div>
          </div>
          <div
            className="hero-phone-in flex justify-center lg:justify-end"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="relative w-fit">
              <div className="phone-shadow">
                <Image
                  src={heroIpad}
                  alt="Transcribatron on iPad"
                  priority
                  sizes="(min-width: 1024px) 480px, (min-width: 768px) 440px, 300px"
                  className="h-[44svh] w-auto md:h-auto md:w-[440px] lg:w-[480px]"
                />
              </div>
              <HeroCallouts callouts={heroCalloutsIpad} />
            </div>
          </div>
          <div className="lg:hidden flex flex-col items-center">
            <DeviceSwitcher />
            <HeroCtas appStoreUrl={appStoreUrl} macAppStoreUrl={macAppStoreUrl} />
          </div>
        </div>
      </Container>
    </section>
  );
}
