import type { NextConfig } from "next";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isGitHubPages =
  process.env.GITHUB_ACTIONS === "true" && Boolean(repoName);

const config: NextConfig = {
  devIndicators: false,
  output: "export",
  images: {
    unoptimized: true,
  },
  ...(isGitHubPages
    ? {
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }
    : {}),
};
export default config;
