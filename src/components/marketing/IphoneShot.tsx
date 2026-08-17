import Image from "next/image";
import { HeroCallouts } from "./HeroCallouts";
import { heroCallouts } from "@/lib/hero-callouts";
import heroIphone from "../../../Assets/Images/Hero Image 1.png";

// The framed iPhone shot + its callout overlay. Shared by the iPhone hero and
// the Mac hero's narrow-screen fallback (where a Mac window makes no sense).
export function IphoneShot() {
  return (
    <div className="relative w-fit">
      <div className="phone-shadow">
        <Image
          src={heroIphone}
          alt="Transcribatron on iPhone"
          priority
          sizes="(min-width: 1024px) 408px, (min-width: 768px) 384px, 280px"
          className="h-[44svh] w-auto md:h-auto md:w-[384px] lg:w-[408px]"
        />
      </div>
      <HeroCallouts callouts={heroCallouts} />
    </div>
  );
}
