"use client";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { cn } from "@/lib/utils";
import { Screenshot } from "./Screenshot";
import { useDeviceView, DeviceSwitcher } from "./DeviceView";

interface FeatureShotProps {
  alt: string;
  /** Device hint for the placeholder frame when there's no real shot. */
  placeholderDevice: "iphone" | "mac";
  /** Pre-framed device shots (bezel/window baked in). */
  shots?: { iphone?: StaticImageData; ipad?: StaticImageData; mac?: StaticImageData };
}

function Framed({
  src,
  alt,
  className,
  sizes,
  mac = false,
}: {
  src: StaticImageData;
  alt: string;
  className?: string;
  sizes: string;
  mac?: boolean;
}) {
  return (
    <div
      className={cn(
        "phone-shadow mx-auto",
        mac && "overflow-hidden rounded-xl ring-1 ring-white/10",
        className
      )}
    >
      <Image src={src} alt={alt} sizes={sizes} className="h-auto w-full" />
    </div>
  );
}

// Shows the pre-framed shot for the selected device view, plus the device
// switcher underneath. A Mac (landscape) shot renders large on desktop and
// falls back to the iPhone shot on mobile, so every section needs an `iphone`
// shot. Features without real shots fall back to the placeholder skeleton.
export function FeatureShot({ alt, placeholderDevice, shots }: FeatureShotProps) {
  const { device } = useDeviceView();
  const iphone = shots?.iphone;

  // No real shots (or missing the required iPhone fallback) → placeholder.
  if (!shots || !iphone) {
    return (
      <Screenshot
        device={placeholderDevice}
        alt={alt}
        className={placeholderDevice === "iphone" ? "w-[260px]" : "w-full max-w-md"}
      />
    );
  }

  let shot: React.ReactNode;
  if (device === "mac" && shots.mac) {
    shot = (
      <>
        <Framed
          mac
          src={shots.mac}
          alt={alt}
          sizes="(min-width: 1024px) 1024px, 92vw"
          className="hidden w-full max-w-5xl lg:block"
        />
        <Framed src={iphone} alt={alt} sizes="300px" className="w-[300px] lg:hidden" />
      </>
    );
  } else if (device === "ipad" && shots.ipad) {
    shot = (
      <Framed
        src={shots.ipad}
        alt={alt}
        sizes="(min-width: 1024px) 520px, 60vw"
        className="w-[340px] sm:w-[440px] lg:w-[520px]"
      />
    );
  } else {
    shot = <Framed src={iphone} alt={alt} sizes="320px" className="w-[300px] md:w-[320px]" />;
  }

  return (
    <div className="flex flex-col items-center">
      {shot}
      <DeviceSwitcher className="mt-6" />
    </div>
  );
}
