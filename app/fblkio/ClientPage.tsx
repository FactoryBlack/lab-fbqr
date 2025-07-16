"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"
import { AnimatePresence, motion } from "framer-motion"
import { NeoButton } from "@/components/ui/neo-button"
import { Input } from "@/components/ui/input"
import { NeoCard, NeoCardContent } from "@/components/ui/neo-card"
import AuthModal from "@/components/auth-modal"
import { Skeleton } from "@/components/ui/skeleton"
import { Copy, Edit, Trash2, Check, X } from "lucide-react"
import { PageHeader } from "@/components/page-header"

interface ShortLink {
  id: number
  short_code: string
  original_url: string
  created_at: string
}

function LinkSkeleton() {
  return (
    <NeoCard className="shadow-[4px_4px_0px_var(--neo-text)] opacity-50">
      <NeoCardContent className="p-4 flex items-center gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-48 bg-black/10" />
          <Skeleton className="h-4 w-full bg-black/10" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 bg-black/10" />
          <Skeleton className="h-9 w-9 bg-black/10" />
          <Skeleton className="h-9 w-9 bg-black/10" />
        </div>
      </NeoCardContent>
    </NeoCard>
  )
}

export default function FblkIoClientPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [longUrl, setLongUrl] = useState("")
  const [links, setLinks] = useState<ShortLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null)
  const [editingUrl, setEditingUrl] = useState("")

  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    return () => subscription.unsubscribe()
  }, [supabase.auth])

  useEffect(() => {
    const fetchLinks = async () => {
      if (!user) {
        setLinks([])
        setIsLoading(false)
        return
      }
      setIsLoading(true)
      try {
        const response = await fetch("/api/short-links")
        if (!response.ok) throw new Error("Failed to fetch links.")
        const data = await response.json()
        setLinks(data)
      } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message })
      } finally {
        setIsLoading(false)
      }
    }
    fetchLinks()
  }, [user, toast])

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }
    if (!longUrl.trim()) {
      toast({ variant: "destructive", title: "Error", description: "URL cannot be empty." })
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/short-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: longUrl }),
      })
      const newLink = await response.json()
      if (!response.ok) throw new Error(newLink.error || "Failed to shorten URL.")

      setLinks([newLink, ...links])
      setLongUrl("")
      toast({ variant: "success", title: "Success!", description: `Created short link: ${newLink.shortUrl}` })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (id: number) => {
    const originalLinks = [...links]
    const optimisticUpdatedLinks = links.map((l) => (l.id === id ? { ...l, original_url: editingUrl } : l))
    setLinks(optimisticUpdatedLinks)
    setEditingLinkId(null)
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/short-links/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: editingUrl }),
      })
      if (!response.ok) throw new Error("Failed to update link.")
      toast({ variant: "success", title: "Link Updated" })
    } catch (error: any) {
      setLinks(originalLinks)
      toast({ variant: "destructive", title: "Error", description: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    const originalLinks = [...links]
    const optimisticLinks = links.filter((l) => l.id !== id)
    setLinks(optimisticLinks)

    try {
      const response = await fetch(`/api/short-links/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete link.")
      toast({ title: "Link Deleted" })
    } catch (error: any) {
      setLinks(originalLinks)
      toast({ variant: "destructive", title: "Error", description: error.message })
    }
  }

  const handleCopy = (shortCode: string) => {
    navigator.clipboard.writeText(`https://fblk.io/${shortCode}`)
    toast({ variant: "success", title: "Copied to clipboard!" })
  }

  const startEditing = (link: ShortLink) => {
    setEditingLinkId(link.id)
    setEditingUrl(link.original_url)
  }

  return (
    <>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} redirectTo="/fblkio" />
      <div className="bg-page-bg min-h-screen p-4 sm:p-6 md:p-8">
        <main
          className="bg-[#EAEAEA] border-2 border-[#1c1c1c] flex flex-col min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)]"
          style={{ boxShadow: `8px 8px 0px #1c1c1c` }}
        >
          <PageHeader title="FBLK.IO" user={user} onLoginClick={() => setIsAuthModalOpen(true)} />

          <div className="p-6 border-b-2 border-b-[#1c1c1c]">
            <form onSubmit={handleShorten} className="flex flex-col sm:flex-row gap-4">
              <Input
                type="url"
                placeholder="Enter a long URL to make it short..."
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="flex-1"
                required
              />
              <NeoButton type="submit" disabled={isSubmitting} className="sm:w-auto uppercase">
                {isSubmitting && !editingLinkId ? "Shortening..." : "Shorten"}
              </NeoButton>
            </form>
          </div>

          <div className="flex-1 p-6 space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <LinkSkeleton />
                <LinkSkeleton />
                <LinkSkeleton />
              </div>
            ) : !user ? (
              <div className="text-center py-10">
                <p className="font-sans font-bold text-lg">Please log in to manage your links.</p>
              </div>
            ) : links.length === 0 ? (
              <div className="text-center py-10">
                <p className="font-sans font-bold text-lg">No links yet. Create one above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {links.map((link) => (
                    <motion.div
                      key={link.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                    >
                      <NeoCard className="shadow-[4px_4px_0px_var(--neo-text)]">
                        <NeoCardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="relative">
                              <a
                                href={`https://fblk.io/${link.short_code}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-sans font-bold text-lg hover:underline overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]"
                              >
                                fblk.io/{link.short_code}
                              </a>
                              <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#EAEAEA] to-transparent pointer-events-none" />
                            </div>
                            {editingLinkId === link.id ? (
                              <div className="flex gap-2 items-center">
                                <Input
                                  value={editingUrl}
                                  onChange={(e) => setEditingUrl(e.target.value)}
                                  className="h-9 text-sm"
                                />
                                <NeoButton
                                  size="icon"
                                  className="h-9 w-9 flex-shrink-0"
                                  onClick={() => handleUpdate(link.id)}
                                  disabled={isSubmitting}
                                >
                                  <Check size={18} />
                                </NeoButton>
                                <NeoButton
                                  size="icon"
                                  variant="destructive"
                                  className="h-9 w-9 flex-shrink-0"
                                  onClick={() => setEditingLinkId(null)}
                                >
                                  <X size={18} />
                                </NeoButton>
                              </div>
                            ) : (
                              <div className="relative">
                                <p
                                  className="font-sans text-sm text-neo-text/70 overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:1]"
                                  title={link.original_url}
                                >
                                  {link.original_url}
                                </p>
                                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#EAEAEA] to-transparent pointer-events-none" />
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 self-start sm:self-center">
                            <NeoButton
                              size="icon"
                              variant="secondary"
                              className="h-9 w-9"
                              onClick={() => handleCopy(link.short_code)}
                            >
                              <Copy size={16} />
                            </NeoButton>
                            <NeoButton
                              size="icon"
                              variant="secondary"
                              className="h-9 w-9"
                              onClick={() => startEditing(link)}
                            >
                              <Edit size={16} />
                            </NeoButton>
                            <NeoButton
                              size="icon"
                              variant="destructive"
                              className="h-9 w-9"
                              onClick={() => handleDelete(link.id)}
                            >
                              <Trash2 size={16} />
                            </NeoButton>
                          </div>
                        </NeoCardContent>
                      </NeoCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
