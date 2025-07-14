import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: {
    template: "%s | App Boilerplate",
    default: "Brutalist App Boilerplate",
  },
  description: "A boilerplate for building apps with a brutalist design.",
  icons: {
    icon: "/favicon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable}`} suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
