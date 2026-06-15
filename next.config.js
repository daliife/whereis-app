/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // If deploying to https://username.github.io/whereis-app/ (not a custom domain),
  // set NEXT_PUBLIC_BASE_PATH=/whereis-app in your CI environment.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
};

module.exports = nextConfig;
