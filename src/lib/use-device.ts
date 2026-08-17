"use client";
import { useEffect, useState } from "react";

export type Device = "iphone" | "mac";

export function useDevice(): Device {
  const [device, setDevice] = useState<Device>("iphone");

  useEffect(() => {
    if (typeof navigator === "undefined") return;

    // Manual override for previewing a device shot on any machine:
    // e.g. /?device=mac or /?device=iphone
    const override = new URLSearchParams(window.location.search).get("device");
    if (override === "mac" || override === "iphone") {
      setDevice(override);
      return;
    }

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
