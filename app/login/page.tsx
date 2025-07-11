"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { NeoButton } from "@/components/ui/neo-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NeoCard, NeoCardContent, NeoCardHeader, NeoCardTitle } from "@/components/ui/neo-card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
    } else {
      // A confirmation email will be sent.
      setError("Check your email for a confirmation link!")
      router.push("/")
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push("/")
      router.refresh() // Important to refresh server-side user session
    }
  }

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 dot-grid-bg">
      <NeoCard className="w-full max-w-sm">
        <NeoCardHeader>
          <NeoCardTitle>Login / Sign Up</NeoCardTitle>
        </NeoCardHeader>
        <NeoCardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2">
              <NeoButton onClick={handleSignIn} className="flex-1">
                Sign In
              </NeoButton>
              <NeoButton onClick={handleSignUp} variant="outline" className="flex-1">
                Sign Up
              </NeoButton>
            </div>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-dashed border-neo-text" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-neo-bg px-2 text-neo-text">Or continue with</span>
            </div>
          </div>
          <NeoButton onClick={handleGoogleSignIn} variant="outline" className="w-full">
            Sign in with Google
          </NeoButton>
        </NeoCardContent>
      </NeoCard>
    </div>
  )
}
