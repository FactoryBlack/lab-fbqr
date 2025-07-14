import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// PUT: Update an existing short link
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { url } = await request.json()
  const { id } = params

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("short_links")
    .update({ original_url: url })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: "Failed to update link or link not found" }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE: Delete a short link
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = params

  const { error } = await supabase.from("short_links").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    return NextResponse.json({ error: "Failed to delete link or link not found" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
