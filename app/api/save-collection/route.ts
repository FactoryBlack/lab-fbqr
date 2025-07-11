import { neon } from "@neondatabase/serverless"
import { nanoid } from "nanoid"
import { type NextRequest, NextResponse } from "next/server"

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { qrCodes } = await request.json()

    if (!qrCodes || !Array.isArray(qrCodes) || qrCodes.length === 0) {
      return NextResponse.json({ error: "No QR codes provided" }, { status: 400 })
    }

    let pin: string
    let attempts = 0
    const maxAttempts = 5

    // Loop to prevent rare PIN collisions
    while (attempts < maxAttempts) {
      pin = nanoid(6)
      try {
        await sql`INSERT INTO qr_collections (pin, qr_codes) VALUES (${pin}, ${JSON.stringify(qrCodes)})`
        // If insert is successful, return the PIN
        return NextResponse.json({ pin })
      } catch (error) {
        // Check if it's a unique constraint violation
        if (error.code === "23505") {
          // "unique_violation"
          attempts++
        } else {
          // If it's another error, throw it
          throw error
        }
      }
    }

    // If we exit the loop, we failed to find a unique PIN
    return NextResponse.json({ error: "Failed to generate a unique PIN" }, { status: 500 })
  } catch (error) {
    console.error("Save error:", error)
    return NextResponse.json(
      {
        error: `Failed to save collection. Ensure Neon database is connected and schema is applied. Original error: ${error.message}`,
      },
      { status: 500 },
    )
  }
}
