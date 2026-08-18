"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import api, { getErrorMessage } from "@/lib/api"
import { getSocket } from "@/lib/socket"
import { useAuthStore } from "@/stores/auth-store"
import type {
    ChatMessage,
    ChatUser,
    MemberStatus,
    UserRoomStatus,
} from "@/types/chat"

type RoomStatusesPayload = {
    roomId: string
    statuses: Record<string, UserRoomStatus>
}

type UserStatusPayload = {
    roomId: string
    user: ChatUser
    status: UserRoomStatus
}

type RoomUserPayload = {
    roomId: string
    user: ChatUser
}

function mergeStatuses(
    current: Record<string, MemberStatus>,
    statuses: Record<string, UserRoomStatus>
) {
    const next: Record<string, MemberStatus> = {}

    for (const [userId, status] of Object.entries(statuses)) {
        if (status === "offline") {
            continue
        }

        next[userId] = {
            name: current[userId]?.name,
            status,
        }
    }

    return next
}

export function useRoomChat(roomId: string) {
    const user = useAuthStore((state) => state.user)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [members, setMembers] = useState<Record<string, MemberStatus>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [draft, setDraft] = useState("")
    const typingRef = useRef(false)
    const stopTypingTimeout = useRef<number | undefined>(undefined)

    useEffect(() => {
        const socket = getSocket()
        let cancelled = false

        setIsLoading(true)
        setMessages([])
        setMembers({})
        setDraft("")
        typingRef.current = false

        const onStatuses = (payload: RoomStatusesPayload) => {
            if (payload.roomId !== roomId) {
                return
            }

            setMembers((current) => mergeStatuses(current, payload.statuses))
        }

        const onUserStatus = (payload: UserStatusPayload) => {
            if (payload.roomId !== roomId) {
                return
            }

            setMembers((current) => {
                if (payload.status === "offline") {
                    const next = { ...current }
                    delete next[payload.user.id]
                    return next
                }

                return {
                    ...current,
                    [payload.user.id]: {
                        name: payload.user.name,
                        status: payload.status,
                    },
                }
            })
        }

        const onJoined = (payload: RoomUserPayload) => {
            if (payload.roomId !== roomId) {
                return
            }

            setMembers((current) => ({
                ...current,
                [payload.user.id]: {
                    name: payload.user.name,
                    status: current[payload.user.id]?.status ?? "online",
                },
            }))
        }

        const onLeft = (payload: RoomUserPayload) => {
            if (payload.roomId !== roomId) {
                return
            }

            setMembers((current) => {
                const next = { ...current }
                delete next[payload.user.id]
                return next
            })
        }

        const onMessage = (message: ChatMessage) => {
            if (message.roomId && message.roomId !== roomId) {
                return
            }
            setMembers((current) => ({
                ...current,
                [message.user.id]: {
                    name: message.user.name,
                    status: current[message.user.id]?.status ?? "online",
                },
            }))

            setMessages((current) => {
                if (current.some((item) => item.id === message.id)) {
                    return current
                }

                return [...current, message]
            })
        }

        socket.on("room_statuses", onStatuses)
        socket.on("user_status", onUserStatus)
        socket.on("joined_room", onJoined)
        socket.on("left_room", onLeft)
        socket.on("message", onMessage)

        let requested = false

        async function loadMessages() {
            if (requested || cancelled) {
                return
            }

            requested = true

            try {
                const { data } = await api.get<ChatMessage[]>(
                    `/room/${roomId}/messages`
                )

                if (cancelled) {
                    return
                }

                setMessages([...data].reverse())
                setMembers((current) => {
                    const next = { ...current }

                    for (const message of data) {
                        const existing = next[message.user.id]
                        if (existing) {
                            next[message.user.id] = {
                                ...existing,
                                name: message.user.name,
                            }
                        }
                    }

                    return next
                })
            } catch (error) {
                if (!cancelled) {
                    toast.error(getErrorMessage(error))
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false)
                }
            }
        }

        const onJoinedStatuses = (payload: RoomStatusesPayload) => {
            if (payload.roomId !== roomId) {
                return
            }

            socket.off("room_statuses", onJoinedStatuses)
            void loadMessages()
        }

        socket.on("room_statuses", onJoinedStatuses)

        const join = () => {
            socket.emit("joined_room", { roomId })
        }

        if (socket.connected) {
            join()
        } else {
            socket.once("connect", join)
        }

        const fallback = window.setTimeout(() => {
            if (!cancelled) {
                void loadMessages()
            }
        }, 1500)

        return () => {
            cancelled = true
            window.clearTimeout(fallback)
            window.clearTimeout(stopTypingTimeout.current)
            socket.off("room_statuses", onJoinedStatuses)
            socket.off("connect", join)
            socket.emit("left_room", { roomId })
            socket.off("room_statuses", onStatuses)
            socket.off("user_status", onUserStatus)
            socket.off("joined_room", onJoined)
            socket.off("left_room", onLeft)
            socket.off("message", onMessage)
        }
    }, [roomId])

    const statusText = useMemo(() => {
        const others = Object.entries(members).filter(
            ([id]) => id !== user?.id
        )
        const typing = others.filter(([, member]) => member.status === "typing")
        const typingNames = typing
            .map(([, member]) => member.name)
            .filter((name): name is string => Boolean(name))
        const onlineCount = Object.values(members).filter(
            (member) => member.status === "online" || member.status === "typing"
        ).length

        if (typing.length === 1) {
            return `${typingNames[0] ?? "یکی از اعضا"} در حال نوشتن است`
        }

        if (typing.length === 2) {
            const first = typingNames[0] ?? "یک نفر"
            const second = typingNames[1] ?? "یک نفر دیگر"
            return `${first} و ${second} در حال نوشتن هستند`
        }

        if (typing.length > 2) {
            const first = typingNames[0] ?? "یک نفر"
            return `${first} و ${typing.length - 1} نفر دیگر در حال نوشتن هستند`
        }

        return `${onlineCount} نفر آنلاین`
    }, [members, user?.id])

    function emitStopTyping() {
        if (!typingRef.current) {
            return
        }

        typingRef.current = false
        getSocket().emit("stop_typing", { roomId })
    }

    function handleDraftChange(value: string) {
        setDraft(value)

        const socket = getSocket()

        if (value.trim() && !typingRef.current) {
            typingRef.current = true
            socket.emit("typing", { roomId })
        }

        window.clearTimeout(stopTypingTimeout.current)
        stopTypingTimeout.current = window.setTimeout(() => {
            emitStopTyping()
        }, 1500)

        if (!value.trim()) {
            window.clearTimeout(stopTypingTimeout.current)
            emitStopTyping()
        }
    }

    function sendMessage() {
        const text = draft.trim()

        if (!text) {
            return
        }

        window.clearTimeout(stopTypingTimeout.current)
        emitStopTyping()
        getSocket().emit("send_message", { roomId, message: text })
        setDraft("")
    }

    return {
        user,
        messages,
        isLoading,
        draft,
        statusText,
        handleDraftChange,
        sendMessage,
    }
}
