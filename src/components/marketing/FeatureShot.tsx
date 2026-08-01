"use client";
import { Screenshot } from "./Screenshot";
import { useDevice } from "@/lib/use-device";

interface FeatureShotProps {
  alt: string;
  src?: string;
}

// Frames follow the viewer's device: iPhone visitors see phone frames,
// Mac visitors see MacBook frames, everyone else defaults to iPhone.
export function FeatureShot({ alt, src }: FeatureShotProps) {
  const device = useDevice();
  return (
    <Screenshot
      device={device}
      src={src}
      alt={alt}
      className={device === "iphone" ? "w-[260px]" : "w-full max-w-md"}
    />
  );
}
