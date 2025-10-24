import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  /* config options here */
  env:{
    NEXT_PUBLIC_DOMAIN:"http://localhost:3000"
  },
  images:{
    remotePatterns:[
      {hostname:"imgcld.yatra.com"}
    ]
  }
};

export default nextConfig;
