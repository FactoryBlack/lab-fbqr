import type { Metadata } from "next"
import ClientPage from "./ClientPage" // Assuming you want to default to showing the QR generator

export const metadata: Metadata = {
  title: "The Factory Black Lab | Developer & Designer Utilities",
  description:
    "Welcome to The Factory Black Lab. A suite of powerful, design-focused tools including a QR code generator (FBQR) and a URL shortener (FBLK.IO).",
}

export default function HomePage() {
  return (
    <>
      <ClientPage />
    </>
  )
}
