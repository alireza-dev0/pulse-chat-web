"use client"

import { io, type Socket } from "socket.io-client"

let socket: Socket | null = null

function createSocket() {
    const directApiUrl = process.env.NEXT_PUBLIC_API_URL

    if (directApiUrl) {
        // const url = new URL(directApiUrl)
        // url.hostname = window.location.hostname

        return io("https://pulse-chat-api-5fez.onrender.com", {
            withCredentials: true,
            autoConnect: false,
        })
    }

    return io({
        path: "/api/socket.io",
        withCredentials: true,
        autoConnect: false,
    })
}

export function getSocket() {
    if (!socket) {
        socket = createSocket()
    }

    return socket
}
