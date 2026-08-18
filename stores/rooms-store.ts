"use client"

import { create } from "zustand"
import type { Room } from "@/types/chat"

type RoomsState = {
    rooms: Room[]
    setRooms: (rooms: Room[]) => void
    addRoom: (room: Room) => void
    removeRoom: (id: string) => void
}

export const useRoomsStore = create<RoomsState>((set) => ({
    rooms: [],
    setRooms: (rooms) => set({ rooms }),
    addRoom: (room) =>
        set((state) => {
            if (state.rooms.some((item) => item.id === room.id)) {
                return state
            }

            return { rooms: [room, ...state.rooms] }
        }),
    removeRoom: (id) =>
        set((state) => ({
            rooms: state.rooms.filter((room) => room.id !== id),
        })),
}))
