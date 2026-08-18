import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    allowedDevOrigins: [
        "10.216.218.38",
    ],
    rewrites: async () => {
        return [
            {
                source: "/api/:path*",
                destination: `${process.env.API_URL}/:path*`,
            },
        ]
    },
}

export default nextConfig
