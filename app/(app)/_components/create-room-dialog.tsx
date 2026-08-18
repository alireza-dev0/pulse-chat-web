"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon } from "@hugeicons/core-free-icons"
import { getErrorMessage } from "@/lib/api"
import { useRooms } from "@/app/(app)/_hooks/use-rooms"
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
} from "@/components/ui"

type CreateRoomValues = {
    name: string
}

export function CreateRoomDialog() {
    const { createRoom } = useRooms()
    const [open, setOpen] = useState(false)
    const form = useForm<CreateRoomValues>({
        defaultValues: { name: "" },
    })

    const onSubmit = form.handleSubmit(
        async (values) => {
            try {
                await createRoom(values.name)
                form.reset()
                setOpen(false)
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() => setOpen(true)}
                aria-label="ساخت اتاق"
            >
                <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>اتاق جدید</DialogTitle>
                    <DialogDescription>
                        یک نام برای اتاق انتخاب کنید.
                    </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="room-name">نام اتاق</Label>
                        <Input
                            id="room-name"
                            autoComplete="off"
                            {...form.register("name", {
                                required: "نام اتاق الزامی است",
                            })}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                        >
                            ساختن
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
