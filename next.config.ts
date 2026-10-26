import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        agentFeedback: true,
        authInterrupts: true
    },

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
    reactStrictMode: false
};

export default nextConfig;
