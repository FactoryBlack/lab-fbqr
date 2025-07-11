"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { NeoButton } from "./ui/neo-button"
import type { User } from "@supabase/supabase-js"
import Link from "next/link"

export default function AuthButton({ user }: { user: User | null }) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm hidden sm:inline">Hey, {user.email}</span>
      <NeoButton onClick={handleSignOut} variant="outline" size="sm">
        Logout
      </NeoButton>
    </div>
  ) : (
    <Link href="/login">
      <NeoButton variant="outline" size="sm">
        Login
      </NeoButton>
    </Link>
  )
}
