import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-sans",
})

const siteUrl = "https://lab.factory.black"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | The Factory Black Lab",
    default: "The Factory Black Lab",
  },
  description: "A collection of helpful tools for designers and developers by The Factory Black.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "The Factory Black Lab",
    description: "A collection of helpful tools for designers and developers by The Factory Black.",
    url: siteUrl,
    siteName: "The Factory Black Lab",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "The Factory Black Lab user interface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Factory Black Lab",
    description: "A collection of helpful tools for designers and developers by The Factory Black.",
    images: ["/og.png"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <body className="font-sans">
        <Suspense fallback={null}>{children}</Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
