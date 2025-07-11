import { kv } from "@vercel/kv"
import { nanoid } from "nanoid"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { qrCodes } = await request.json()

    if (!qrCodes || !Array.isArray(qrCodes) || qrCodes.length === 0) {
      return NextResponse.json({ error: "No QR codes provided" }, { status: 400 })
    }

    // Generate a unique, 6-character alphanumeric PIN
    const pin = nanoid(6)

    // Save the collection to Vercel KV with a TTL (Time To Live) of 30 days
    await kv.set(`qr-collection-${pin}`, qrCodes, { ex: 60 * 60 * 24 * 30 })

    return NextResponse.json({ pin })
  } catch (error: any) {
    console.error("Save error:", error)
    return NextResponse.json(
      { error: `Failed to save collection. Ensure Vercel KV is connected. Original error: ${error.message}` },
      { status: 500 },
    )
  }
}
