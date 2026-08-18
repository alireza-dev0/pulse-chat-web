"use client"

import { create } from "zustand"
import api from "@/lib/api"
import type { CurrentUser } from "@/types/chat"

type AuthState = {
    user: CurrentUser | null
    status: "idle" | "loading" | "ready" | "unauthenticated"
    load: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    status: "idle",
    load: async () => {
        set({ status: "loading" })

        try {
            const { data } = await api.get<CurrentUser>("/auth/me")
            set({ user: data, status: "ready" })
        } catch {
            set({ user: null, status: "unauthenticated" })
        }
    },
}))
