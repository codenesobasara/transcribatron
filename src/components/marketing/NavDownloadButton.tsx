"use client";
import Link from "next/link";
import { track } from "@vercel/analytics/react";
import { Button } from "@/components/ui/button";
import { ComingSoonDialog } from "./ComingSoonDialog";
import { useIsApple, useIsIos } from "@/lib/platform-client";
import { siteConfig } from "@/lib/site-config";

// iOS visitors go straight to the App Store; Windows/Android get the
// coming-soon dialog; Macs keep the /download placeholder until the Mac App
// Store listing exists. Detection is client-side because the Nav renders in
// the root layout, where reading request headers would opt every page into
// dynamic rendering.
export function NavDownloadButton() {
  const isIos = useIsIos();
  const isApple = useIsApple();

  if (isIos) {
    return (
      <Button asChild variant="accent" size="sm">
        <a
          href={siteConfig.appStoreUrl}
          target="_blank"
          rel="noopener"
          onClick={() => track("cta_appstore_click", { platform: "ios", position: "nav" })}
        >
          Download
        </a>
      </Button>
    );
  }

  if (!isApple) {
    return (
      <ComingSoonDialog position="nav">
        <Button variant="accent" size="sm">Download</Button>
      </ComingSoonDialog>
    );
  }

  return (
    <Button asChild variant="accent" size="sm">
      <Link href="/download" prefetch={false}>Download</Link>
    </Button>
  );
}
