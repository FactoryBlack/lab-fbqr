"use client"

import { createClient } from "@/lib/supabase/client"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCard } from "@/components/ui/neo-card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Github, Chrome } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  redirectTo?: string
}

export default function AuthModal({ isOpen, onClose, redirectTo }: AuthModalProps) {
  const supabase = createClient()

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

  const handleOAuthLogin = async (provider: "google" | "github") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getURL(),
      },
    })
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
              <NeoCard className="p-8 text-center bg-page-bg-alt">
                <h2 className="font-heading text-4xl mb-2">JOIN THE LAB</h2>
                <p className="text-neo-text-secondary mb-6">
                  Log in to save your QR code collections and manage your short links.
                </p>
                <div className="space-y-4">
                  <NeoButton variant="primary" size="lg" className="w-full" onClick={() => handleOAuthLogin("google")}>
                    <Chrome className="w-5 h-5 mr-2" />
                    Continue with Google
                  </NeoButton>
                  <NeoButton variant="primary" size="lg" className="w-full" onClick={() => handleOAuthLogin("github")}>
                    <Github className="w-5 h-5 mr-2" />
                    Continue with GitHub
                  </NeoButton>
                </div>
              </NeoCard>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
