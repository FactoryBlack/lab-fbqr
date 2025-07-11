"use client"
import AuthButton from "./auth-button"
import type { User } from "@supabase/supabase-js"

export function HeaderBar({ user }: { user: User | null }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <h1 className="font-heading text-4xl md:text-5xl">QR-BRUTAL</h1>
      <AuthButton user={user} />
    </div>
  )
}
