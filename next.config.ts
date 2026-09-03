import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: false,
  experimental: {
    serverActions: {
      // The standalone Worker is the public browser origin for injected UI automation.
      allowedOrigins: ["agentbridge-webmcp-noapi-adapter.agentbridge-noapi.workers.dev"],
    },
  },
};

export default nextConfig;
