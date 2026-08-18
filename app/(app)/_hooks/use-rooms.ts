"use client"

import { useCallback, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import api, { getErrorMessage } from "@/lib/api"
import { getSocket } from "@/lib/socket"
import { useRoomsStore } from "@/stores/rooms-store"
import type { Room } from "@/types/chat"

export function useRoomsSync(enabled: boolean) {
    const router = useRouter()
    const pathname = usePathname()
    const setRooms = useRoomsStore((state) => state.setRooms)
    const addRoom = useRoomsStore((state) => state.addRoom)
    const removeRoom = useRoomsStore((state) => state.removeRoom)

    useEffect(() => {
        if (!enabled) {
            return
        }

        let cancelled = false

        async function load() {
            try {
                const { data } = await api.get<Room[]>("/room")
                if (!cancelled) {
                    setRooms(data)
                }
            } catch (error) {
                if (!cancelled) {
                    toast.error(getErrorMessage(error))
                }
            }
        }

        void load()

        return () => {
            cancelled = true
        }
    }, [enabled, setRooms])

    useEffect(() => {
        if (!enabled) {
            return
        }

        const socket = getSocket()

        const onCreated = (room: Room) => {
            addRoom(room)
            toast.success(`اتاق «${room.name}» ساخته شد`)
        }

        const onDeleted = (room: Room) => {
            removeRoom(room.id)
            toast.success(`اتاق «${room.name}» حذف شد`)

            if (pathname === `/room/${room.id}`) {
                router.replace("/")
            }
        }

        socket.on("room_created", onCreated)
        socket.on("room_deleted", onDeleted)

        return () => {
            socket.off("room_created", onCreated)
            socket.off("room_deleted", onDeleted)
        }
    }, [enabled, addRoom, removeRoom, pathname, router])
}

export function useRooms() {
    const router = useRouter()
    const pathname = usePathname()
    const rooms = useRoomsStore((state) => state.rooms)
    const addRoom = useRoomsStore((state) => state.addRoom)
    const removeRoom = useRoomsStore((state) => state.removeRoom)

    const createRoom = useCallback(
        async (name: string) => {
            const { data } = await api.post<Room>("/room", { name })
            addRoom(data)
            return data
        },
        [addRoom]
    )

    const deleteRoom = useCallback(
        async (id: string) => {
            await api.delete<Room>(`/room/${id}`)
            removeRoom(id)

            if (pathname === `/room/${id}`) {
                router.replace("/")
            }
        },
        [pathname, removeRoom, router]
    )

    return {
        rooms,
        createRoom,
        deleteRoom,
    }
}
