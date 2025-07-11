import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data, error } = await supabase.from("qr_collections").select("qr_codes").eq("user_id", user.id)

    if (error) throw error

    // If user has no collections yet, return an empty array
    const collections = data.map((item) => ({ qr_codes: item.qr_codes }))

    return NextResponse.json({ collections })
  } catch (error: any) {
    console.error("Load error:", error)
    return NextResponse.json({ error: `Failed to load collections: ${error.message}` }, { status: 500 })
  }
}
