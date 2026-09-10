import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mobile IP ko allow kar rahe hain taaki JavaScript aur WebSocket load ho sake
  allowedDevOrigins: ["10.65.109.236", "localhost"],
};

export default nextConfig;