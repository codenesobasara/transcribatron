"use client";
import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import type { Device } from "@/lib/device";

interface DeviceViewValue {
  device: Device;
  setDevice: (d: Device) => void;
}

const DeviceViewContext = createContext<DeviceViewValue | null>(null);

// Holds the "which device shot to show" state for the whole page. Starts at the
// server-detected device (so SSR renders the right variant with no flash), then
// the DeviceSwitcher lets visitors preview any device.
export function DeviceViewProvider({
  initial,
  children,
}: {
  initial: Device;
  children: React.ReactNode;
}) {
  const [device, setDevice] = useState<Device>(initial);
  return (
    <DeviceViewContext.Provider value={{ device, setDevice }}>
      {children}
    </DeviceViewContext.Provider>
  );
}

export function useDeviceView(): DeviceViewValue {
  const ctx = useContext(DeviceViewContext);
  if (!ctx) throw new Error("useDeviceView must be used within a DeviceViewProvider");
  return ctx;
}

const DEVICES: { id: Device; label: string }[] = [
  { id: "iphone", label: "iPhone" },
  { id: "ipad", label: "iPad" },
  { id: "mac", label: "Mac" },
];

// The iPhone · iPad · Mac toggle. Highlights the active device; clicking one
// switches the whole page's device view.
export function DeviceSwitcher({ className }: { className?: string }) {
  const { device, setDevice } = useDeviceView();
  return (
    <div
      role="group"
      aria-label="Preview on a different device"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-sep bg-surface/50 p-1 backdrop-blur-sm",
        className
      )}
    >
      {DEVICES.map((d) => {
        const active = device === d.id;
        return (
          <button
            key={d.id}
            type="button"
            onClick={() => setDevice(d.id)}
            aria-pressed={active}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              active ? "bg-accent text-bg" : "text-ink-2 hover:text-ink"
            )}
          >
            {d.label}
          </button>
        );
      })}
    </div>
  );
}
