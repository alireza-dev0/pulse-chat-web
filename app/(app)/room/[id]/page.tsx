"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { useRoomChat } from "@/app/(app)/room/[id]/_hooks/use-room-chat"
import { useRoomsStore } from "@/stores/rooms-store"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
    Avatar,
    AvatarFallback,
    Bubble,
    BubbleContent,
    Button,
    Message,
    MessageContent,
    MessageHeader,
    Spinner,
    Textarea,
} from "@/components/ui"

export default function RoomPage() {
    const params = useParams<{ id: string }>()
    const roomId = params.id
    const room = useRoomsStore((state) =>
        state.rooms.find((item) => item.id === roomId)
    )
    const {
        user,
        messages,
        isLoading,
        draft,
        statusText,
        handleDraftChange,
        sendMessage,
    } = useRoomChat(roomId)
    const scrollerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const node = scrollerRef.current
        if (!node) {
            return
        }

        node.scrollTop = node.scrollHeight
    }, [messages])

    return (
        <div className="flex h-svh min-h-0 flex-col">
            <header className="flex items-center gap-3 border-b px-3 py-2.5">
                <Link
                    href="/"
                    aria-label="بازگشت"
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "icon-sm" }),
                        "md:hidden"
                    )}
                >
                    <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
                </Link>
                <div className="min-w-0">
                    <h1 className="truncate text-sm font-semibold">
                        {room?.name ?? "اتاق"}
                    </h1>
                    <p className="truncate text-xs text-muted-foreground">
                        {statusText}
                    </p>
                </div>
            </header>

            <div
                ref={scrollerRef}
                className="min-h-0 flex-1 overflow-y-auto px-3 py-4"
            >
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <Spinner className="size-6" />
                    </div>
                ) : messages.length === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                        هنوز پیامی در این اتاق نیست.
                    </p>
                ) : (
                    <div className="flex flex-col gap-3" dir="ltr">
                        {messages.map((message) => {
                            const isOwn = message.user.id === user?.id

                            return (
                                <Message
                                    key={message.id}
                                    align={isOwn ? "end" : "start"}
                                >
                                    {!isOwn ? (
                                        <Avatar size="sm">
                                            <AvatarFallback>
                                                {message.user.name.slice(0, 1)}
                                            </AvatarFallback>
                                        </Avatar>
                                    ) : null}
                                    <MessageContent>
                                        {!isOwn ? (
                                            <MessageHeader className="w-min" dir="rtl">
                                                {message.user.name}
                                            </MessageHeader>
                                        ) : null}
                                        <Bubble
                                            align={isOwn ? "end" : "start"}
                                            variant={
                                                isOwn ? "default" : "secondary"
                                            }
                                        >
                                            <BubbleContent dir="rtl">
                                                {message.text}
                                            </BubbleContent>
                                        </Bubble>
                                    </MessageContent>
                                </Message>
                            )
                        })}
                    </div>
                )}
            </div>

            <form
                className="flex items-end gap-2 border-t p-3"
                onSubmit={(event) => {
                    event.preventDefault()
                    sendMessage()
                }}
            >
                <Textarea
                    value={draft}
                    onChange={(event) =>
                        handleDraftChange(event.target.value)
                    }
                    onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault()
                            sendMessage()
                        }
                    }}
                    placeholder="پیام خود را بنویسید..."
                    className="min-h-10 max-h-32 resize-none"
                    rows={1}
                />
                <Button nativeButton type="submit" aria-label="ارسال">
                    ارسال
                </Button>
            </form>
        </div>
    )
}
