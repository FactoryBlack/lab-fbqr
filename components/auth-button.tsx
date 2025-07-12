"use client"

import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { NeoButton } from "@/components/ui/neo-button"
import type { User } from "@supabase/supabase-js"

interface AuthButtonProps {
  user: User | null
  onLoginClick: () => void
}

export default function AuthButton({ user, onLoginClick }: AuthButtonProps) {
  const supabase = createClient()
  const { toast } = useToast()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast({ title: "Logged out." })
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-sans hidden sm:inline">{user.email}</span>
        <NeoButton onClick={handleLogout} variant="secondary" className="uppercase w-auto">
          Logout
        </NeoButton>
      </div>
    )
  }

  return (
    <NeoButton onClick={onLoginClick} className="uppercase w-auto">
      Login / Signup
    </NeoButton>
  )
}
