import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; img-src 'self' data: blob:;",
    domains: ["images.unsplash.com", "img.freepik.com", "wallpapercave.com"],
  },
};

export default nextConfig;
