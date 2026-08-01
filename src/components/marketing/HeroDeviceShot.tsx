"use client";
import Image from "next/image";
import { Screenshot } from "./Screenshot";
import { useDevice } from "@/lib/use-device";
import silverIphone from "../../../Assets/Images/Color=Silver.png";

interface HeroDeviceShotProps {
  altIphone: string;
  altMac: string;
}

export function HeroDeviceShot({ altIphone, altMac }: HeroDeviceShotProps) {
  const device = useDevice();

  if (device === "iphone") {
    // Pre-framed mockup — the bezel is baked into the PNG, so render it plain.
    return (
      <div className="phone-shadow">
        <Image
          src={silverIphone}
          alt={altIphone}
          priority
          sizes="(min-width: 1024px) 340px, (min-width: 768px) 320px, 280px"
          className="w-[280px] md:w-[320px] lg:w-[340px] h-auto"
        />
      </div>
    );
  }

  return (
    <div className="phone-shadow">
      <Screenshot device="mac" alt={altMac} priority className="w-full max-w-xl" />
    </div>
  );
}
