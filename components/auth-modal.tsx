"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCard } from "@/components/ui/neo-card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Mail, Chrome } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  redirectTo?: string
}

export default function AuthModal({ isOpen, onClose, redirectTo }: AuthModalProps) {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      "http://localhost:3000/"
    // Make sure to include `https` in production
    url = url.includes("http") ? url : `https://${url}`
    // Make sure to include a trailing `/`
    url = url.charAt(url.length - 1) === "/" ? url : `${url}/`
    if (redirectTo) {
      url = `${url}${redirectTo.startsWith("/") ? redirectTo.substring(1) : redirectTo}`
    }
    return url
  }

  const handleOAuthLogin = async (provider: "google") => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getURL(),
      },
    })
    setLoading(false)
  }

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setError("")
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getURL(),
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage("Check your email for the login link!")
    }
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-md w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <NeoCard className="p-8 text-center">
                <h2 className="font-heading text-4xl mb-2">JOIN THE LAB</h2>
                <p className="text-muted-foreground mb-6">
                  Log in to save your QR code collections and manage your short links.
                </p>
                <div className="space-y-4">
                  <NeoButton
                    variant="default"
                    size="lg"
                    className="w-full"
                    onClick={() => handleOAuthLogin("google")}
                    disabled={loading}
                  >
                    <Chrome className="w-5 h-5 mr-2" />
                    Continue with Google
                  </NeoButton>

                  <div className="flex items-center my-4">
                    <div className="flex-grow border-t-2 border-border" />
                    <span className="flex-shrink-0 px-4 text-muted-foreground text-xs uppercase">Or continue with</span>
                    <div className="flex-grow border-t-2 border-border" />
                  </div>

                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-neo-interactive-bg text-center"
                    />
                    <NeoButton
                      type="submit"
                      variant="secondary"
                      size="lg"
                      className="w-full"
                      disabled={loading || !email}
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      {loading ? "Sending..." : "Continue with Email"}
                    </NeoButton>
                  </form>
                  {message && <p className="text-sm text-center mt-4 text-green-600">{message}</p>}
                  {error && <p className="text-sm text-center mt-4 text-red-600">{error}</p>}
                </div>
              </NeoCard>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
