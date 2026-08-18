"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getSocket } from "@/lib/socket"
import { useAuthStore } from "@/stores/auth-store"

export function useAppSession() {
    const router = useRouter()
    const status = useAuthStore((state) => state.status)
    const load = useAuthStore((state) => state.load)

    useEffect(() => {
        void load()
    }, [load])

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/signin")
            return
        }

        if (status !== "ready") {
            return
        }

        const socket = getSocket()

        if (!socket.connected) {
            socket.connect()
        }

        let didToast = false

        const onConnectError = () => {
            if (didToast) {
                return
            }

            didToast = true
            toast.error("اتصال زنده برقرار نشد")
        }

        const onConnect = () => {
            didToast = false
        }

        socket.on("connect_error", onConnectError)
        socket.on("connect", onConnect)

        return () => {
            socket.off("connect_error", onConnectError)
            socket.off("connect", onConnect)
        }
    }, [status, router])

    return {
        status,
        user: useAuthStore((state) => state.user),
    }
}
