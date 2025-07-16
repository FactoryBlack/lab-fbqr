import type { Metadata } from "next"
import { Suspense } from "react"
import ClientPage from "./ClientPage"
import { Skeleton } from "@/components/ui/skeleton"

// Using the absolute production URL to ensure crawlers can find the image.
const productionUrl = "https://lab.factory.black"
const ogImageUrl = `${productionUrl}/og.png`

export const metadata: Metadata = {
  title: "FBQR",
  description: "A brutalist-inspired, highly customizable QR code generator.",
  openGraph: {
    title: "FBQR | The Factory Black Lab",
    description: "A brutalist-inspired, highly customizable QR code generator.",
    url: `${productionUrl}/fbqr`,
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
