"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import api from "@/lib/api"

type SignupValues = {
    name: string
    email: string
    password: string
}

function getErrorMessage(error: unknown) {
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

export function useSignup() {
    const router = useRouter()
    const form = useForm<SignupValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    const onSubmit = form.handleSubmit(
        async (values) => {
            try {
                const { data } = await api.post<{ message: string }>(
                    "/auth/signup",
                    values
                )
                toast.success(data.message)
                router.push("/")
            } catch (error) {
                toast.error(getErrorMessage(error))
            }
        },
        (errors) => {
            Object.values(errors).forEach((error) => {
                if (error?.message) {
                    toast.error(error.message)
                }
            })
        }
    )

    return {
        register: form.register,
        errors: form.formState.errors,
        isSubmitting: form.formState.isSubmitting,
        onSubmit,
    }
}
