import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const pin = searchParams.get("pin")

  if (!pin) {
    return NextResponse.json({ error: "PIN is required" }, { status: 400 })
  }

  try {
    const result = await sql`SELECT qr_codes FROM qr_collections WHERE pin = ${pin}`

    if (result.length === 0) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    return NextResponse.json({ qrCodes: result[0].qr_codes })
  } catch (error) {
    console.error("Load error:", error)
    return NextResponse.json({ error: `Failed to load collection. Original error: ${error.message}` }, { status: 500 })
  }
}
