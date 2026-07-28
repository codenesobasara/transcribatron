"use client";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface QrCodeProps {
  value: string;
  size?: number;
  className?: string;
  label?: string;
}

export function QrCode({ value, size = 160, className, label }: QrCodeProps) {
  return (
    <div className={cn("inline-flex flex-col items-center gap-2", className)}>
      <div className="bg-bg p-3 rounded-2xl border border-sep">
        <QRCodeSVG
          value={value}
          size={size}
          bgColor="transparent"
          fgColor="var(--color-ink)"
          level="M"
        />
      </div>
      {label && <div className="text-xs text-ink-3">{label}</div>}
    </div>
  );
}
