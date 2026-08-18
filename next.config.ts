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
            {
                source: "/api/socket.io/:path*",
                destination: `${process.env.API_URL}/socket.io/:path*`,
            }
        ]
    },
}

export default nextConfig
