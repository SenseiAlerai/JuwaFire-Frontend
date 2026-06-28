import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow accessing the dev server (HMR + client assets) from phones/other
  // devices on the LAN. Add your PC's local IP here.
  allowedDevOrigins: ["192.168.1.68"],
};

export default nextConfig;
