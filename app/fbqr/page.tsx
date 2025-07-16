import type { Metadata } from "next"
import ClientPage from "./ClientPage"

const siteUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
const ogImageUrl = `${siteUrl}/og.png`

export const metadata: Metadata = {
  title: "FBQR - QR Code Generator",
  description:
    "Create, customize, and manage high-quality QR codes with advanced styling options. Part of The Factory Black Lab.",
  keywords: ["qr code", "generator", "custom qr code", "svg qr code", "png qr code", "qr code with logo", "fbqr"],
  openGraph: {
    title: "FBQR - QR Code Generator",
    description: "Create, customize, and manage high-quality QR codes with advanced styling options.",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "The FBQR QR Code Generator interface.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FBQR - QR Code Generator",
    description: "Create, customize, and manage high-quality QR codes with advanced styling options.",
    images: [ogImageUrl],
  },
}

export default function FbqrPage() {
  return <ClientPage />
}
