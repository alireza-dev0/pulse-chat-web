import local from "next/font/local"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"

const font = local({
    src: [
        {
            path: "../public/fonts/Estedad-Bold.woff2",
            weight: "700",
            style: "normal",
        },
        {
            path: "../public/fonts/Estedad-Medium.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "../public/fonts/Estedad-Regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../public/fonts/Estedad-SemiBold.woff2",
            weight: "600",
            style: "normal",
        },
    ],
})

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="fa-IR"
            dir="rtl"
            suppressHydrationWarning
            className={cn("antialiased", font.className)}
        >
            <body>
                <ThemeProvider>{children}</ThemeProvider>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        className: `bg-card text-card-foreground ${font.className}`,
                    }}
                ></Toaster>
            </body>
        </html>
    )
}
