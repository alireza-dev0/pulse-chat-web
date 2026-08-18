"use client"

import { CreateRoomDialog } from "@/app/(app)/_components/create-room-dialog"
import { RoomList } from "@/app/(app)/_components/room-list"

export default function HomePage() {
    return (
        <>
            <div className="flex h-svh flex-col md:hidden">
                <header className="flex items-center justify-between border-b px-4 py-3">
                    <h1 className="text-base font-semibold">اتاق‌ها</h1>
                    <CreateRoomDialog />
                </header>
                <div className="min-h-0 flex-1 overflow-y-auto">
                    <RoomList />
                </div>
            </div>
            <div className="hidden h-full min-h-svh items-center justify-center md:flex">
                <p className="text-sm text-muted-foreground">
                    یک اتاق را انتخاب کنید تا گفتگو شروع شود.
                </p>
            </div>
        </>
    )
}
