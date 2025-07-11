import { NextResponse } from "next/server"
import { nanoid } from "nanoid"
import { sql } from "@neondatabase/serverless"

export async function POST(request: Request) {
  try {
    const { qrCodes } = await request.json()

    if (!qrCodes || !Array.isArray(qrCodes) || qrCodes.length === 0) {
      return NextResponse.json({ error: "Invalid collection data" }, { status: 400 })
    }

    let pin
    let attempts = 0
    const maxAttempts = 10
    let success = false

    // Loop to handle potential PIN collisions
    while (!success && attempts < maxAttempts) {
      pin = nanoid(6)
      try {
        await sql`
          INSERT INTO qr_collections (pin, qr_codes)
          VALUES (${pin}, ${JSON.stringify(qrCodes)}::jsonb)
        `
        success = true
      } catch (error: any) {
        // Check if it's a unique constraint violation
        if (error.code === "23505") {
          // PIN already exists, try again
          attempts++
        } else {
          // Different error, throw it
          throw error
        }
      }
    }

    if (!success) {
      throw new Error("Failed to generate a unique PIN after multiple attempts.")
    }

    return NextResponse.json({ pin })
  } catch (error: any) {
    console.error("Save error:", error)
    return NextResponse.json({ error: `Failed to save collection: ${error.message}` }, { status: 500 })
  }
}
