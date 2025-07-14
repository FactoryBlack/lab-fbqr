"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateUsername(prevState: any, formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: true, message: "You must be logged in to do that." }
  }

  const username = formData.get("username") as string

  // Here you would typically update the user's profile in your database
  // For this example, we'll just log it and pretend it worked.
  console.log(`Updating username for ${user.id} to: ${username}`)

  // Simulate a database operation
  await new Promise((res) => setTimeout(res, 1000))

  revalidatePath("/account")
  return { message: `Username updated to "${username}"!`, error: false }
}
