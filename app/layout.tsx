import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "QR-BRUTAL",
  description: "A Swiss-Tech Brutalist QR Code Generator",
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <body className="font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
