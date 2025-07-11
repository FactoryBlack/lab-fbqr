"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { HeaderBar } from "@/components/header-bar"
import { ConfigPanel, type QRStyleOptions } from "@/components/config-panel"
import { PreviewPanel } from "@/components/preview-panel"
import { CollectionPanel } from "@/components/collection-panel"
import { NeoButton } from "@/components/ui/neo-button"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { AuthModal } from "@/components/auth-modal"

export interface QRCodeResult {
  id: string
  text: string
  originalUrl?: string
  qrConfig: QRStyleOptions & { data: string; image?: string | null }
  createdAt: string
}

export default function QRGeneratorPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [text, setText] = useState("https://vercel.com")
  const [originalUrl, setOriginalUrl] = useState<string | undefined>(undefined)
  const [qrCodes, setQrCodes] = useState<QRCodeResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isShortening, setIsShortening] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
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

  useEffect(() => {
    const loadCollections = async () => {
      if (user) {
        setIsLoading(true)
        try {
          const response = await fetch("/api/get-collections")
          if (response.ok) {
            const data = await response.json()
            const allQrCodes = data.collections.flatMap((c: any) => c.qr_codes)
            setQrCodes(allQrCodes)
          } else {
            toast.error("Failed to load your collections.")
          }
        } catch (error) {
          toast.error("An error occurred while loading collections.")
        } finally {
          setIsLoading(false)
        }
      } else {
        setQrCodes([])
      }
    }
    loadCollections()
  }, [user])

  const [style, setStyle] = useState<QRStyleOptions>({
    width: 300,
    dotsOptions: { color: "#292732", type: "square" },
    backgroundOptions: { color: "transparent" },
    cornersSquareOptions: { color: "#292732", type: "square" },
    cornersDotOptions: { type: "inherit", color: "#292732" },
    qrOptions: { errorCorrectionLevel: "H" },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.2,
      margin: 10,
    },
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const handleStyleChange = useCallback((newOptions: Partial<QRStyleOptions>) => {
    setStyle((prev) => ({ ...prev, ...newOptions }))
  }, [])

  const handleSizeChange = useCallback((size: number) => {
    setStyle((prev) => {
      if (prev.width === size) return prev
      return { ...prev, width: size }
    })
  }, [])

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setLogoPreview(e.target?.result as string)
      reader.readAsDataURL(file)
      setStyle((prev) => ({ ...prev, qrOptions: { ...prev.qrOptions, errorCorrectionLevel: "H" } }))
      toast("Logo Added", { description: "Error correction boosted for best scanning." })
    }
  }

  const handleShortenUrl = async () => {
    if (!user) {
      toast.error("Please log in to create a short link.")
      setIsAuthModalOpen(true)
      return
    }
    setIsShortening(true)
    try {
      const response = await fetch("/api/shorten-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: text }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to create short link.")
      }
      setOriginalUrl(text)
      setText(data.shortUrl)
      toast.success("URL shortened!", { description: `Your new link is: ${data.shortUrl}` })
    } catch (error: any) {
      toast.error("Shortening Failed", { description: error.message })
    } finally {
      setIsShortening(false)
    }
  }

  const handleGenerateClick = async () => {
    if (!text.trim()) {
      toast.error("Error", { description: "Content cannot be empty." })
      return
    }

    const newQrCode: QRCodeResult = {
      id: Date.now().toString(),
      text: text,
      originalUrl: originalUrl,
      qrConfig: { ...style, data: text, image: logoPreview },
      createdAt: new Date().toISOString(),
    }
    setQrCodes((prev) => [newQrCode, ...prev])
    setOriginalUrl(undefined) // Reset after adding to collection
    toast("QR Code Added", { description: "Added to your local collection." })
  }

  const handleRemoveQrCode = (id: string) => {
    setQrCodes((prev) => prev.filter((qr) => qr.id !== id))
    toast("Removed from local collection")
  }

  const handleSaveCollection = async () => {
    if (!user) {
      toast.error("Please log in to save your collection.")
      return
    }
    if (qrCodes.length === 0) {
      toast.error("Your collection is empty.")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/save-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCodes }),
      })
      const data = await response.json()
      if (response.ok) {
        toast.success("Collection saved successfully!")
      } else {
        throw new Error(data.error || "Failed to save")
      }
    } catch (error: any) {
      toast.error("Save Failed", { description: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <div className="fixed inset-0 dot-grid-bg -z-10" />
      <div className="min-h-screen p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-8">
            <HeaderBar user={user} onLoginClick={() => setIsAuthModalOpen(true)} />
            <ConfigPanel
              text={text}
              onTextChange={(newText) => {
                setText(newText)
                setOriginalUrl(undefined) // Reset if user types a new URL
              }}
              styleOptions={style}
              onStyleChange={handleStyleChange}
              onGenerateClick={handleGenerateClick}
              isGenerating={isGenerating || isShortening}
              onLogoUpload={handleLogoUpload}
              logoPreview={logoPreview}
              onShortenUrl={handleShortenUrl}
              isShortening={isShortening}
            />
          </div>
          <div className="space-y-8">
            <PreviewPanel text={text} style={style} logoPreview={logoPreview} onSizeChange={handleSizeChange} />
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-3xl">Collection</h2>
                {user && (
                  <div className="w-auto">
                    <NeoButton
                      size="sm"
                      onClick={handleSaveCollection}
                      disabled={isLoading || qrCodes.length === 0}
                      className="uppercase"
                    >
                      {isLoading ? "Saving..." : "Save Collection"}
                    </NeoButton>
                  </div>
                )}
              </div>
              <CollectionPanel
                qrCodes={qrCodes}
                copiedId={copiedId}
                setCopiedId={setCopiedId}
                onRemove={handleRemoveQrCode}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
