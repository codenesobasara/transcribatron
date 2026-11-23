"use client";
import { track } from "@vercel/analytics/react";
import { Button } from "@/components/ui/button";
import { ComingSoonDialog } from "./ComingSoonDialog";
import { useIsApple, useIsIos } from "@/lib/platform-client";
import { siteConfig } from "@/lib/site-config";

// Apple visitors (iPhone, iPad, Mac) go straight to the App Store;
// Windows/Android get the coming-soon dialog. Detection is client-side
// because the Nav renders in the root layout, where reading request headers
// would opt every page into dynamic rendering.
export function NavDownloadButton() {
  const isIos = useIsIos();
  const isApple = useIsApple();

  if (!isApple) {
    return (
      <ComingSoonDialog position="nav">
        <Button variant="accent" size="sm">Download</Button>
      </ComingSoonDialog>
    );
  }

  const platform = isIos ? "ios" : "mac";
  return (
    <Button asChild variant="accent" size="sm">
      <a
        href={isIos ? siteConfig.appStoreUrl : siteConfig.macAppStoreUrl}
        target="_blank"
        rel="noopener"
        onClick={() => track("cta_appstore_click", { platform, position: "nav" })}
      >
        Download
      </a>
    </Button>
  );
}
