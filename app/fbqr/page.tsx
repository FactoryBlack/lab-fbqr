import ClientPage from "./ClientPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LAB01/FBQR",
  description: "A highly customizable QR code generator with dynamic link support.",
  openGraph: {
    title: "LAB01/FBQR",
    description: "A highly customizable QR code generator with dynamic link support.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "The FBQR user interface",
      },
    ],
  },
  twitter: {
    title: "LAB01/FBQR",
    description: "A highly customizable QR code generator with dynamic link support.",
    images: ["/og.png"],
  },
}

export default function QRGeneratorPage() {
  return <ClientPage />
}
