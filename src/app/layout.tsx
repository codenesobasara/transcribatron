import "@fontsource-variable/inter";
import "@fontsource/instrument-serif";
import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: {
    default: "Transcribatron — Say more. Spend less.",
    template: "%s | Transcribatron",
  },
  description:
    "Transcribe meetings, dictations and imports on your iPhone and Mac. Pay once. No subscription.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-sans">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
