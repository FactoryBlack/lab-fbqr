"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { NeoButton } from "@/components/ui/neo-button"
import { LogIn, LogOut } from "lucide-react"

interface AuthButtonProps {
  user: User | null
  onLoginClick: () => void
}

export default function AuthButton({ user, onLoginClick }: AuthButtonProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs text-muted-foreground">Logged In</p>
          <span className="font-sans font-bold text-sm">{user.email}</span>
        </div>
        <NeoButton onClick={handleSignOut} variant="destructive" size="icon" aria-label="Sign Out">
          <LogOut className="w-4 h-4" />
        </NeoButton>
      </div>
    )
  }

  return (
    <NeoButton onClick={onLoginClick} variant="default">
      <LogIn className="w-4 h-4 sm:mr-2" />
      <span className="hidden sm:inline">Login</span>
    </NeoButton>
  )
}
