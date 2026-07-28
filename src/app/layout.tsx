import "@fontsource-variable/inter";
import "@fontsource/instrument-serif";
import "./globals.css";
import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
