import type { Metadata } from "next"
import ClientPage from "./client-page"

export const metadata: Metadata = {
  title: "FBLK.IO - URL Shortener",
  description: "A fast and simple URL shortener for creating manageable, dynamic links. Part of The Factory Black Lab.",
  keywords: ["url shortener", "link shortener", "custom links", "dynamic links", "fblkio"],
  openGraph: {
    title: "FBLK.IO - URL Shortener",
    description: "A fast and simple URL shortener for creating manageable, dynamic links.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "The FBLK.IO URL Shortener interface.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FBLK.IO - URL Shortener",
    description: "A fast and simple URL shortener for creating manageable, dynamic links.",
    images: ["/og.png"],
  },
}

export default function FblkIoPage() {
  return <ClientPage />
}
