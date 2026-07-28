import "@fontsource-variable/inter";
import "@fontsource/instrument-serif";
import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";

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
        <Nav />
        <main>{children}</main>
        <Footer />
        {process.env.NEXT_PUBLIC_VERCEL_ENV === "production" && <Analytics />}
        {process.env.NEXT_PUBLIC_VERCEL_ENV === "production" && <SpeedInsights />}
      </body>
    </html>
  );
}
