import type { NextConfig } from "next";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(isProd && {
    basePath: "/MyPomodoro",
    assetPrefix: "/MyPomodoro/",
  }),
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
};

export default nextConfig;
