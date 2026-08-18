"use client"

import { Spinner } from "@/components/ui"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { CreateRoomDialog } from "@/app/(app)/_components/create-room-dialog"
import { RoomList } from "@/app/(app)/_components/room-list"
import { useAppSession } from "@/app/(app)/_hooks/use-app-session"
import { useRoomsSync } from "@/app/(app)/_hooks/use-rooms"

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const { status } = useAppSession()
    useRoomsSync(status === "ready")

    if (status !== "ready") {
        return (
            <div className="flex min-h-svh items-center justify-center">
                <Spinner className="size-6" />
            </div>
        )
    }

    return (
        <SidebarProvider className="min-h-svh">
            <Sidebar
                collapsible="none"
                side="right"
                className="hidden h-svh border-s md:flex"
            >
                <SidebarHeader className="flex-row items-center justify-between gap-2 px-3 py-3">
                    <h1 className="text-sm font-semibold">اتاق‌ها</h1>
                    <CreateRoomDialog />
                </SidebarHeader>
                <SidebarContent>
                    <RoomList />
                </SidebarContent>
            </Sidebar>
            <SidebarInset className="min-h-svh min-w-0">
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}
