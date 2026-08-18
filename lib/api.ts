import axios, { isAxiosError } from "axios"

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
})

export function getErrorMessage(error: unknown) {
    if (isAxiosError(error)) {
        const message = error.response?.data?.message
        if (Array.isArray(message)) {
            return message.join("\n")
        }
        if (typeof message === "string") {
            return message
        }
    }

    return "خطایی رخ داد. دوباره تلاش کنید."
}

export default api