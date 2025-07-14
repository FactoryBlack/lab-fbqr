"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { NeoCard, NeoCardContent } from "@/components/ui/neo-card"
import AuthButton from "@/components/auth-button"
import AuthModal from "@/components/auth-modal"
import { ArrowRight } from "lucide-react"

const ToolLink = ({
  href,
  title,
  description,
  status,
}: {
  href: string
  title: string
  description: string
  status: "Live" | "Soon"
}) => (
  <Link href={href} className="block group">
    <NeoCard className="transition-all group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-[6px_6px_0px_var(--neo-text)]">
      <NeoCardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-heading text-3xl">{title}</h3>
            <p className="font-sans mt-1 text-base font-medium">{description}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`font-sans font-bold text-sm uppercase px-2 py-1 border-2 border-neo-text ${
                status === "Live" ? "bg-neo-accent" : "bg-neo-muted-bg"
              }`}
            >
              {status}
            </span>
            <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </NeoCardContent>
    </NeoCard>
  </Link>
)

export default function HubPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  return (
    <>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <div className="bg-page-bg min-h-screen p-4 sm:p-6 md:p-8">
        <main
          className="bg-[#EAEAEA] border-2 border-[#1c1c1c] flex flex-col min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)]"
          style={{ boxShadow: `8px 8px 0px #1c1c1c` }}
        >
          <header className="flex items-stretch justify-between w-full flex-shrink-0 border-b-2 border-b-[#1c1c1c]">
            <div className="p-4 flex items-center">
              <h1 className="font-heading text-5xl md:text-6xl">LAB</h1>
            </div>
            <div className="border-l-2 border-l-[#1c1c1c] p-4 flex items-center">
              <AuthButton user={user} onLoginClick={() => setIsAuthModalOpen(true)} />
            </div>
          </header>

          <div className="flex-1 p-6 space-y-8">
            <p className="font-sans text-lg max-w-2xl font-medium">
              A suite of powerful, design-focused tools for developers and designers.
            </p>
            <div className="space-y-6 max-w-4xl">
              <ToolLink href="/fbqr" title="LAB01/FBQR" description="A powerful QR code generator." status="Live" />
              <ToolLink
                href="/fblkio"
                title="LAB02/FBLK.IO"
                description="A simple and fast URL shortener."
                status="Live"
              />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
