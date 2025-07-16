import type { Metadata } from "next"
import { Suspense } from "react"
import ClientPage from "./ClientPage"
import { Skeleton } from "@/components/ui/skeleton"

const siteUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
const ogImageUrl = `${siteUrl}/og.png`

export const metadata: Metadata = {
  title: "FBQR",
  description: "A brutalist-inspired, highly customizable QR code generator.",
  openGraph: {
    title: "FBQR | The Factory Black Lab",
    description: "A brutalist-inspired, highly customizable QR code generator.",
    url: `${siteUrl}/fbqr`,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "The FBQR QR Code Generator tool.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FBQR | The Factory Black Lab",
    description: "A brutalist-inspired, highly customizable QR code generator.",
    images: [ogImageUrl],
  },
}

export default function FBQRPage() {
  return (
    <Suspense fallback={<Skeleton className="h-screen w-full" />}>
      <ClientPage />
    </Suspense>
  )
}
