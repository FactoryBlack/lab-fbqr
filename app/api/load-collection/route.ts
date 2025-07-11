import { kv } from "@vercel/kv"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const pin = searchParams.get("pin")

  if (!pin) {
    return NextResponse.json({ error: "PIN is required" }, { status: 400 })
  }

  try {
    const qrCodes = await kv.get(`qr-collection-${pin}`)

    if (!qrCodes) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    return NextResponse.json({ qrCodes })
  } catch (error) {
    console.error("Load error:", error)
    return NextResponse.json({ error: "Failed to load collection" }, { status: 500 })
  }
}
