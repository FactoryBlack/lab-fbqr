import ClientPage from "./client-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LAB02/FBLK.IO",
  description: "A simple, fast, and dynamic URL shortener.",
  openGraph: {
    title: "LAB02/FBLK.IO",
    description: "A simple, fast, and dynamic URL shortener.",
  },
  twitter: {
    title: "LAB02/FBLK.IO",
    description: "A simple, fast, and dynamic URL shortener.",
  },
}

export default function FblkIoPage() {
  return <ClientPage />
}
