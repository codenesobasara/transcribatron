"use client";
import { useDeviceView } from "./DeviceView";
import { HeroIphone } from "./hero/HeroIphone";
import { HeroIpad } from "./hero/HeroIpad";
import { HeroMac } from "./hero/HeroMac";

interface HeroProps {
  appStoreUrl?: string | null;
  macAppStoreUrl?: string | null;
}

// Renders the hero variant for the currently-selected device view (starts at
// the server-detected device; the DeviceSwitcher can change it).
export function Hero({ appStoreUrl, macAppStoreUrl }: HeroProps) {
  const { device } = useDeviceView();
  const shared = { appStoreUrl, macAppStoreUrl };
  if (device === "mac") return <HeroMac {...shared} />;
  if (device === "ipad") return <HeroIpad {...shared} />;
  return <HeroIphone {...shared} />;
}
