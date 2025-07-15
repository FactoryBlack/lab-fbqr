"use client"

import type React from "react"

import { useState, useEffect, useTransition } from "react"
import type { User } from "@supabase/supabase-js"
import { motion, AnimatePresence } from "framer-motion"
import { LinkIcon as Url, Link, Copy, Trash2 } from "lucide-react"

import { NeoInput } from "@/components/ui/neo-input"
import { NeoButton } from "@/components/ui/neo-button"
import { useToast } from "@/hooks/use-toast"
import type { ShortLink } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

const SkeletonLinkItem = () => (
  <div className="p-4 bg-[#cccccc] border-2 border-b-4 border-r-4 border-[#1c1c1c] space-y-3">
    <div className="flex items-center gap-4">
      <Skeleton className="w-10 h-10 bg-black/10" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 bg-black/10" />
        <Skeleton className="h-3 w-1/2 bg-black/10" />
      </div>
    </div>
    <div className="flex items-center justify-end gap-2">
      <Skeleton className="h-10 w-10 bg-black/10" />
      <Skeleton className="h-10 w-10 bg-black/10" />
    </div>
  </div>
)

export default function FblkIoClientPage({ user }: { user: User | null }) {
  const [originalUrl, setOriginalUrl] = useState("")
  const [links, setLinks] = useState<ShortLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  useEffect(() => {
    const fetchLinks = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }
      try {
        const response = await fetch("/api/short-links")
        if (response.ok) {
          const data = await response.json()
          setLinks(data)
        } else {
          throw new Error("Failed to fetch links")
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load your links.",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchLinks()
  }, [user, toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!originalUrl) return

    startTransition(async () => {
      try {
        const response = await fetch("/api/short-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ original_url: originalUrl }),
        })

        if (response.ok) {
          const newLink = await response.json()
          setLinks((prevLinks) => [newLink, ...prevLinks])
          setOriginalUrl("")
          toast({
            variant: "success",
            title: "Success!",
            description: "Your new short link is ready.",
          })
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create short link")
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: (error as Error).message,
        })
      }
    })
  }

  const handleDelete = async (id: string) => {
    const originalLinks = [...links]
    setLinks(links.filter((link) => link.id !== id))

    try {
      const response = await fetch(`/api/short-links/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete link")
      toast({
        variant: "success",
        title: "Deleted",
        description: "The short link has been removed.",
      })
    } catch (error) {
      setLinks(originalLinks)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete the link.",
      })
    }
  }

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "Copied!",
      description: "The link is now in your clipboard.",
    })
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-start gap-2">
          <NeoInput
            type="url"
            placeholder="https://your-very-long-url.com/goes-here"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            disabled={isPending || !user}
            className="flex-grow"
            containerClassName="flex-grow"
          />
          <NeoButton type="submit" disabled={isPending || !user} className="w-full sm:w-auto">
            {isPending ? "Shortening..." : "Shorten Link"}
          </NeoButton>
        </form>
        {!user && (
          <p className="text-sm text-center mt-2 font-sans text-neo-text/70">Please log in to create short links.</p>
        )}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <>
            <SkeletonLinkItem />
            <SkeletonLinkItem />
            <SkeletonLinkItem />
          </>
        ) : (
          <AnimatePresence>
            {links.map((link) => (
              <motion.div
                key={link.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-[#cccccc] border-2 border-b-4 border-r-4 border-[#1c1c1c]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link className="w-5 h-5 text-neo-text/80 flex-shrink-0" />
                      <p className="font-mono text-lg font-bold text-neo-text break-all">{link.short_url}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Url className="w-4 h-4 text-neo-text/50 flex-shrink-0" />
                      <p className="font-mono text-xs text-neo-text/50 break-all">{link.original_url}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <NeoButton variant="icon" size="sm" onClick={() => handleCopy(link.short_url)}>
                      <Copy className="w-5 h-5" />
                    </NeoButton>
                    <NeoButton variant="icon" size="sm" onClick={() => handleDelete(link.id)}>
                      <Trash2 className="w-5 h-5" />
                    </NeoButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {!isLoading && links.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-black/20">
            <p className="font-sans font-bold text-neo-text/80">No links yet.</p>
            <p className="font-sans text-sm text-neo-text/60">Your shortened links will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
