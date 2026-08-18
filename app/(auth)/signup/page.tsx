"use client"

import Link from "next/link"
import { Button, Input, Label, Spinner } from "@/components/ui"
import { useSignup } from "./_hooks/use-signup"

export default function SignupPage() {
    const { register, errors, isSubmitting, onSubmit } = useSignup()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold">ثبت‌نام</h1>
                <p className="text-sm text-muted-foreground">
                    حساب جدید بسازید و شروع کنید.
                </p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="name">نام</Label>
                    <Input
                        id="name"
                        type="text"
                        autoComplete="name"
                        placeholder="علی"
                        aria-invalid={Boolean(errors.name)}
                        {...register("name", {
                            required: "نام الزامی است",
                        })}
                    />
                </div>

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
                        autoComplete="new-password"
                        aria-invalid={Boolean(errors.password)}
                        {...register("password", {
                            required: "رمز عبور الزامی است",
                        })}
                    />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? <Spinner /> : null}
                    ثبت‌نام
                </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                قبلاً ثبت‌نام کرده‌اید؟{" "}
                <Link
                    href="/signin"
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                    وارد شوید
                </Link>
            </p>
        </div>
    )
}
