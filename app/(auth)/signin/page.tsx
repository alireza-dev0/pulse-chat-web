"use client"

import Link from "next/link"
import { Button, Input, Label, Spinner } from "@/components/ui"
import { useSignin } from "./_hooks/use-signin"

export default function SigninPage() {
    const { register, errors, isSubmitting, onSubmit } = useSignin()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold">ورود</h1>
                <p className="text-sm text-muted-foreground">
                    برای ادامه وارد حساب خود شوید.
                </p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="email">ایمیل</Label>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="user@example.com"
                        aria-invalid={Boolean(errors.email)}
                        {...register("email", {
                            required: "ایمیل الزامی است",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "ایمیل معتبر نیست",
                            },
                        })}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="password">رمز عبور</Label>
                    <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        aria-invalid={Boolean(errors.password)}
                        {...register("password", {
                            required: "رمز عبور الزامی است",
                        })}
                    />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? <Spinner /> : null}
                    ورود
                </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                حساب ندارید؟{" "}
                <Link
                    href="/signup"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                    ثبت‌نام کنید
                </Link>
            </p>
        </div>
    )
}
