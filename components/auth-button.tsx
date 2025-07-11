"use client"

import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { NeoButton } from "@/components/ui/neo-button"
import type { User } from "@supabase/supabase-js"

interface AuthButtonProps {
  user: User | null
  onLoginClick: () => void
}

export default function AuthButton({ user, onLoginClick }: AuthButtonProps) {
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast("Logged out.")
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-mono hidden sm:inline">{user.email}</span>
        <NeoButton onClick={handleLogout} variant="outline" className="uppercase">
          Logout
        </NeoButton>
      </div>
    )
  }

  return (
    <NeoButton onClick={onLoginClick} className="uppercase">
      Login / Signup
    </NeoButton>
  )
}
