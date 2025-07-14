"use client"
import { useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import AuthModal from "@/components/auth-modal"
import AuthButton from "@/components/auth-button"
import { VerticalDivider } from "@/components/vertical-divider"
import { NeoCard, NeoCardContent } from "@/components/ui/neo-card"
import { NeoButton } from "@/components/ui/neo-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function ShortenerPage() {
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
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} redirectTo="/shortener" />
      <div className="p-4 sm:p-6 md:p-8">
        <main
          className="bg-background border-2 border-foreground flex flex-col min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)]"
          style={{ boxShadow: `8px 8px 0px var(--neo-text)` }}
        >
          <header className="flex items-stretch justify-between w-full flex-shrink-0 border-b-2 border-b-foreground">
            <div className="p-4 flex items-center">
              <Link href="/" className="font-heading text-5xl md:text-6xl hover:opacity-80 transition-opacity">
                FBLK<span className="text-primary">/</span>IO
              </Link>
            </div>
            <div className="border-l-2 border-l-foreground p-4 flex items-center gap-4">
              {user && (
                <Link href="/account" className="font-sans font-bold uppercase text-sm hover:underline hidden sm:block">
                  Account
                </Link>
              )}
              <AuthButton user={user} onLoginClick={() => setIsAuthModalOpen(true)} />
              <ThemeToggle />
            </div>
          </header>

          {/* Main content area */}
          <div className="flex-1 grid lg:grid-cols-[1fr_auto_1fr] min-h-0 w-full">
            {/* Left Panel: Create Link */}
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                <h2 className="font-heading text-3xl">Create New Link</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="long-url">Long URL</Label>
                    <Input id="long-url" placeholder="https://example.com/very/long/url" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="short-path">Custom Path (Optional)</Label>
                    <div className="flex items-center">
                      <span className="font-sans font-bold pr-2 text-muted-foreground">fblk.io/</span>
                      <Input id="short-path" placeholder="my-link" />
                    </div>
                  </div>
                  <NeoButton>Shorten URL</NeoButton>
                </div>
              </div>
            </ScrollArea>

            <VerticalDivider className="hidden lg:block" />

            {/* Right Panel: My Links */}
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6 border-t-2 border-foreground lg:border-t-0">
                <h2 className="font-heading text-3xl">My Links</h2>
                <NeoCard>
                  <NeoCardContent className="p-6 text-center font-sans">
                    {user ? "Your shortened links will appear here." : "Log in to see your links."}
                  </NeoCardContent>
                </NeoCard>
              </div>
            </ScrollArea>
          </div>
        </main>
      </div>
    </>
  )
}
