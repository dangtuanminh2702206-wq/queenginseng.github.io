import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? "/queenginseng.github.io" : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isGitHubPages ? "/queenginseng.github.io" : "",
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
