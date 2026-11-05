import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [
    "localhost",  // Just the hostname
    "192.168.12.77"  ,
    "https://optimize-backend-1-0-0.onrender.com/"
  ],

  output: "standalone",
};



export default nextConfig;
