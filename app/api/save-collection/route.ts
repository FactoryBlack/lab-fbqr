import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { qrCodes } = await request.json()

    if (!qrCodes || !Array.isArray(qrCodes)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    // This is a simple "upsert" logic. It replaces the user's entire collection
    // with the current one from the client. A more complex app might allow multiple named collections.
    const { error } = await supabase
      .from("qr_collections")
      .upsert({ user_id: user.id, qr_codes: qrCodes, updated_at: new Date().toISOString() }, { onConflict: "user_id" })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Save error:", error)
    return NextResponse.json({ error: `Failed to save collection: ${error.message}` }, { status: 500 })
  }
}
