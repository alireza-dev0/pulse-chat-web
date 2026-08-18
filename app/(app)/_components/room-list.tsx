"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete02Icon } from "@hugeicons/core-free-icons"
import { getErrorMessage } from "@/lib/api"
import { cn } from "@/lib/utils"
import { useRooms } from "@/app/(app)/_hooks/use-rooms"
import { useAuthStore } from "@/stores/auth-store"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    Button,
} from "@/components/ui"
import type { Room } from "@/types/chat"

export function RoomList() {
    const pathname = usePathname()
    const { rooms, deleteRoom } = useRooms()
    const user = useAuthStore((state) => state.user)
    const [pendingRoom, setPendingRoom] = useState<Room | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    async function confirmDelete() {
        if (!pendingRoom) {
            return
        }

        setIsDeleting(true)

        try {
            await deleteRoom(pendingRoom.id)
            setPendingRoom(null)
        } catch (error) {
            toast.error(getErrorMessage(error))
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <div className="flex flex-col gap-1 p-2">
                {rooms.length === 0 ? (
                    <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                        هنوز اتاقی ساخته نشده است.
                    </p>
                ) : (
                    rooms.map((room) => {
                        const href = `/room/${room.id}`
                        const isActive = pathname === href
                        const isOwner = room.ownerId === user?.id

                        return (
                            <div
                                key={room.id}
                                className="group relative flex items-center"
                            >
                                <Link
                                    href={href}
                                    className={cn(
                                        "min-w-0 flex-1 rounded-md px-3 py-2 text-sm hover:bg-muted",
                                        isActive &&
                                            "bg-muted font-medium text-foreground"
                                    )}
                                >
                                    <span className="block truncate pe-8">
                                        {room.name}
                                    </span>
                                </Link>
                                {isOwner ? (
                                    <Button
                                        type="button"
                                        size="icon-xs"
                                        variant="ghost"
                                        className="absolute inset-e-1 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                        aria-label={`حذف ${room.name}`}
                                        onClick={() => setPendingRoom(room)}
                                    >
                                        <HugeiconsIcon
                                            icon={Delete02Icon}
                                            strokeWidth={2}
                                        />
                                    </Button>
                                ) : null}
                            </div>
                        )
                    })
                )}
            </div>

            <AlertDialog
                open={Boolean(pendingRoom)}
                onOpenChange={(open) => {
                    if (!open && !isDeleting) {
                        setPendingRoom(null)
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>حذف اتاق</AlertDialogTitle>
                        <AlertDialogDescription>
                            اتاق «{pendingRoom?.name}» حذف شود؟ این کار قابل
                            بازگشت نیست.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            انصراف
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={(event) => {
                                event.preventDefault()
                                void confirmDelete()
                            }}
                        >
                            حذف
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
