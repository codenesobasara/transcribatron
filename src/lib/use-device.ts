"use client";
import { useEffect, useState } from "react";

export type Device = "iphone" | "mac";

export function useDevice(): Device {
  const [device, setDevice] = useState<Device>("iphone");

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ua = navigator.userAgent;

    if (/iPhone/.test(ua) || /iPad/.test(ua)) {
      setDevice("iphone");
      return;
    }
    if (
      /Macintosh/.test(ua) &&
      typeof document !== "undefined" &&
      "ontouchend" in document
    ) {
      setDevice("iphone");
      return;
    }
    if (/Macintosh|Mac OS X/.test(ua)) {
      setDevice("mac");
      return;
    }
  }, []);

  return device;
}
