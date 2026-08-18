export type CurrentUser = {
    id: string
    email: string
    name: string
}

export type Room = {
    id: string
    name: string
    ownerId: string
}

export type ChatUser = {
    id: string
    name: string
}

export type ChatMessage = {
    id: string
    roomId?: string
    text: string
    user: ChatUser
    createdAt: string
}

export type UserRoomStatus = "online" | "offline" | "typing"

export type MemberStatus = {
    name?: string
    status: UserRoomStatus
}
