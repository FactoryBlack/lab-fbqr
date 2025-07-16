import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-sans",
})

const siteUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
const ogImageUrl = `${siteUrl}/og.png`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Factory Black Lab",
    template: "%s | The Factory Black Lab",
  },
  description:
    "A suite of powerful, design-focused tools for developers and designers. Generate QR codes, shorten URLs, and more.",
  keywords: [
    "developer tools",
    "designer utilities",
    "qr code generator",
    "url shortener",
    "factory black lab",
    "fbqr",
    "fblkio",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "The Factory Black Lab",
    description: "A suite of powerful, design-focused tools for developers and designers.",
    url: siteUrl,
    siteName: "The Factory Black Lab",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "The Factory Black Lab suite of tools.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Factory Black Lab",
    description: "A suite of powerful, design-focused tools for developers and designers.",
    images: [ogImageUrl],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", montserrat.variable)}>
        <Suspense fallback={null}>
          {children}
          <Toaster />
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
