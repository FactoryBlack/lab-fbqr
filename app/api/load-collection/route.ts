import { NextResponse } from "next/server"
import { sql } from "@neondatabase/serverless"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const pin = searchParams.get("pin")

  if (!pin) {
    return NextResponse.json({ error: "PIN is required" }, { status: 400 })
  }

  try {
    const { rows } = await sql`
      SELECT qr_codes FROM qr_collections WHERE pin = ${pin}
    `

    if (rows.length === 0) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    const collection = rows[0]
    return NextResponse.json({ qrCodes: collection.qr_codes })
  } catch (error: any) {
    console.error("Load error:", error)
    return NextResponse.json({ error: `Failed to load collection: ${error.message}` }, { status: 500 })
  }
}
