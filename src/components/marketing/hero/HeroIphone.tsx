import { Container } from "@/components/layout/Container";
import { HeroCopy } from "../HeroCopy";
import { PriceSticker } from "../PriceSticker";
import { HeroCtas } from "../HeroCtas";
import { IphoneShot } from "../IphoneShot";
import { DeviceSwitcher } from "../DeviceView";

interface HeroVariantProps {
  appStoreUrl?: string | null;
  macAppStoreUrl?: string | null;
}

// Desktop: copy/sticker/badges on the left, framed iPhone shot (with callout
// pills) on the right. Mobile: compact price sticker beside the headline, then
// paragraph → phone → device switcher → badges, sized to keep the header above
// the fold. Default hero for phones + unknown mobile.
export function HeroIphone({ appStoreUrl, macAppStoreUrl }: HeroVariantProps) {
  return (
    <section className="relative lg:min-h-[85vh] flex items-center pt-10 pb-14 md:py-24 overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-16 items-center max-w-4xl mx-auto">
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
            <IphoneShot />
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
