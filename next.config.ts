import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [],
        localPatterns: [
            {
                pathname: "/avatars/**",
            },
        ],
    },
}

export default nextConfig