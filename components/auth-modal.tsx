"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { NeoButton } from "@/components/ui/neo-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NeoCard, NeoCardContent, NeoCardHeader, NeoCardTitle } from "./ui/neo-card"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  redirectTo?: string
}

export function AuthModal({ isOpen, onClose, redirectTo = "/" }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: callbackUrl,
        },
      })
      if (error) {
        setError(error.message)
      } else {
        setMessage("Check your email for a confirmation link!")
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        router.refresh()
        onClose()
      }
    }
  }

  const handleGoogleSignIn = async () => {
    const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
      },
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm"
          >
            <NeoCard>
              <NeoCardHeader>
                <NeoCardTitle>{isSignUp ? "Create Account" : "Sign In"}</NeoCardTitle>
                <button onClick={onClose} className="absolute top-4 right-4 text-neo-text/70 hover:text-neo-text">
                  <X size={24} />
                </button>
              </NeoCardHeader>
              <NeoCardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                  {message && <p className="text-sm text-green-600">{message}</p>}
                  <NeoButton type="submit" className="w-full">
                    {isSignUp ? "Sign Up" : "Sign In"}
                  </NeoButton>
                </form>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-dashed border-neo-text" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-neo-bg px-2 text-neo-text">Or</span>
                  </div>
                </div>

                <NeoButton onClick={handleGoogleSignIn} variant="outline" className="w-full">
                  Continue with Google
                </NeoButton>

                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError(null)
                    setMessage(null)
                  }}
                  className="w-full text-center text-sm mt-4 hover:underline"
                >
                  {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                </button>
              </NeoCardContent>
            </NeoCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
