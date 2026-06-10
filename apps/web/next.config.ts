import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/MyPomodoro",
  assetPrefix: "/MyPomodoro/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
