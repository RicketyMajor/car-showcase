import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Headless UI is a barrel-file package: a plain named import pulls the whole
    // entry point. This rewrites those imports to direct paths at build time
    // while keeping full type safety at the call site.
    optimizePackageImports: ["@headlessui/react"],
  },
};

export default nextConfig;
