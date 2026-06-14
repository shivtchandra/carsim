import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Home dir contains an unrelated lockfile; pin the workspace root so Turbopack doesn't infer it.
  turbopack: { root: __dirname },
};

export default nextConfig;
