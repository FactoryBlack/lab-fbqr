"use client"
import AuthButton from "./auth-button"
import type { User } from "@supabase/supabase-js"

interface HeaderBarProps {
  user: User | null
  onLoginClick: () => void
}

export function HeaderBar({ user, onLoginClick }: HeaderBarProps) {
  return (
    <header className="max-w-screen-2xl mx-auto flex items-center justify-between">
      <h1 className="font-heading text-5xl md:text-7xl">QR-BRUTAL</h1>
      <AuthButton user={user} onLoginClick={onLoginClick} />
    </header>
  )
}
