import type { Metadata } from "next"
import ClientPage from "./ClientPage"

export const metadata: Metadata = {
  title: "FBQR - QR Code Generator",
  description:
    "Create, customize, and manage high-quality QR codes with advanced styling options. Part of The Factory Black Lab.",
  openGraph: {
    title: "FBQR - QR Code Generator",
    description: "Create, customize, and manage high-quality QR codes with advanced styling options.",
    images: [
      {
        url: "/og.png",
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
    images: ["/og.png"],
  },
}

export default function FbqrPage() {
  return <ClientPage />
}
