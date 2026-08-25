import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [
    "localhost",  // Just the hostname
    "192.168.12.77"  
  ],
};



export default nextConfig;
