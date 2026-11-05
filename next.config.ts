import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        agentFeedback: true,
        authInterrupts: true
    },
  allowedDevOrigins: ['172.16.42.4'],

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.public.blob.vercel-storage.com"
            }
        ]
    },
    
    
    cacheComponents: true,
    partialPrefetching: true,
    turbopack: {
        rules: {
            "*.css": {
                loaders: ["@tailwindcss/turbopack"],
                as: "*.css",
            },
        },
    },
    reactStrictMode: false,
    
    
    headers() {
        return [
            {
                source: "/",
                headers: [
                    {
                        key: "Access-Control-Allow-Origin",
                        value: "https://localhost:5000/",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET,POST"
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Content-Type"
                    }
                ]
            },
        ]
    }
};

export default nextConfig;
