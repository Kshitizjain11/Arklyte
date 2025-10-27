import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  /* config options here */
  env:{
    NEXT_PUBLIC_DOMAIN:"https://arklyte-kappa.vercel.app/",
    NEXT_PUBLIC_STRIPE_KEY:"pk_test_51SM5BiRSHpTsBC0HIVBNI6I0xT3OZZ850DWgNgRkPzMv8H4Eej0qu2m4knCk6yr6jGTnzMRTAnBYbEdpeMJQYROF00D7XDl7z1"
  },
  images:{
    remotePatterns:[
      {hostname:"imgcld.yatra.com"}
    ]
  },
  typescript:{
    ignoreBuildErrors:true
  },
  eslint:{
    ignoreDuringBuilds:true
  }
};

export default nextConfig;
