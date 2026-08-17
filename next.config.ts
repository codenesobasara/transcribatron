import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow phones/tablets on the LAN to load dev assets (see AGENTS.md note on
  // cross-origin blocking of /_next/* in dev).
  allowedDevOrigins: ["10.0.0.198"],
};

export default nextConfig;
