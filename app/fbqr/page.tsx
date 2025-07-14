import ClientPage from "./ClientPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LAB01/FBQR",
  description: "A Swiss-Tech Brutalist QR Code Generator.",
}

export default function QRGeneratorPage() {
  return <ClientPage />
}
