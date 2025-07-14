import ClientPage from "./client-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LAB02/FBLK.IO",
  description: "A simple, fast, and dynamic URL shortener.",
  openGraph: {
    title: "LAB02/FBLK.IO",
    description: "A simple, fast, and dynamic URL shortener.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "The FBLK.IO user interface",
      },
    ],
  },
  twitter: {
    title: "LAB02/FBLK.IO",
    description: "A simple, fast, and dynamic URL shortener.",
    images: ["/og.png"],
  },
}

export default function FblkIoPage() {
  return <ClientPage />
}
