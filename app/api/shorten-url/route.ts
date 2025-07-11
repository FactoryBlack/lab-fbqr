import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { nanoid } from "nanoid"

export async function POST(request: Request) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { url } = await request.json()

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    // Generate a unique short code
    const short_code = nanoid(7)

    const { error } = await supabase.from("short_links").insert({ original_url: url, short_code, user_id: user.id })

    if (error) {
      console.error("Supabase error:", error)
      throw new Error("Could not create short link.")
    }

    const shortUrl = `https://fblk.io/${short_code}`
    return NextResponse.json({ shortUrl })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to shorten URL" }, { status: 500 })
  }
}
