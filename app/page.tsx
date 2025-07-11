"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { useDebouncedCallback } from "use-debounce"
import { ConfigPanel, type QRStyleOptions } from "@/components/config-panel"
import { PreviewPanel } from "@/components/preview-panel"
import { CollectionPanel } from "@/components/collection-panel"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { AuthModal } from "@/components/auth-modal"
import AuthButton from "@/components/auth-button"
import { VerticalDivider } from "@/components/vertical-divider"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface QRCodeResult {
  id: string
  text: string
  originalUrl?: string
  qrConfig: QRStyleOptions & { data: string; image?: string | null }
  thumbnail?: string
  createdAt: string
}

export default function QRGeneratorPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [text, setText] = useState("https://lab.factory.black")
  const [originalUrl, setOriginalUrl] = useState<string | undefined>(undefined)
  const [qrCodes, setQrCodes] = useState<QRCodeResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isShortening, setIsShortening] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCollectionLoaded, setIsCollectionLoaded] = useState(false)
  const supabase = createClient()

  const saveCollectionDebounced = useDebouncedCallback(async (codesToSave: QRCodeResult[]) => {
    if (!user) return

    try {
      const response = await fetch("/api/save-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCodes: codesToSave }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || "Failed to save")
      }
      toast.success("Collection auto-saved!")
    } catch (error: any) {
      toast.error("Cloud Save Failed", { description: error.message })
    }
  }, 2000)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (!currentUser) {
        // User logged out, clear collection and reset flags
        setQrCodes([])
        setIsCollectionLoaded(false)
        setIsLoading(false)
      }
    })

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (!user) {
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  useEffect(() => {
    const loadCollection = async () => {
      if (user && !isCollectionLoaded) {
        setIsLoading(true)
        try {
          const response = await fetch("/api/get-collections")
          if (response.ok) {
            const data = await response.json()
            const allQrCodes = data.collections.flatMap((c: any) => c.qr_codes)
            setQrCodes(allQrCodes)
          } else {
            toast.error("Failed to load your collection.")
          }
        } catch (error) {
          toast.error("An error occurred while loading collection.")
        } finally {
          setIsLoading(false)
          setIsCollectionLoaded(true)
        }
      }
    }
    loadCollection()
  }, [user, isCollectionLoaded])

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

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-qr-svg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...style,
          width: 64,
          data: text,
          image: logoPreview,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate QR code thumbnail")

      const svgString = await response.text()
      const thumbnailDataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`

      const newQrCode: QRCodeResult = {
        id: Date.now().toString(),
        text: text,
        originalUrl: originalUrl,
        qrConfig: { ...style, data: text, image: logoPreview },
        thumbnail: thumbnailDataUrl,
        createdAt: new Date().toISOString(),
      }

      const newQrCodes = [newQrCode, ...qrCodes]
      setQrCodes(newQrCodes)
      if (user) {
        saveCollectionDebounced(newQrCodes)
      }

      setOriginalUrl(undefined)
      toast("QR Code Added", { description: "Added to your local collection." })
    } catch (error: any) {
      toast.error("Generation Failed", { description: error.message })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRemoveQrCode = (id: string) => {
    const newQrCodes = qrCodes.filter((qr) => qr.id !== id)
    setQrCodes(newQrCodes)
    if (user) {
      saveCollectionDebounced(newQrCodes)
    }
    toast("Removed from collection")
  }

  return (
    <>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <div className="fixed inset-0 dot-grid-bg -z-10" />
      <main className="min-h-screen p-4 sm:p-6 md:p-8 flex flex-col">
        <div
          className="bg-[var(--neo-bg)] border-[var(--neo-border-width)] border-[var(--neo-text)] flex-1 flex flex-col"
          style={{ boxShadow: `8px 8px 0px var(--neo-text)` }}
        >
          <header className="flex items-stretch justify-between w-full flex-shrink-0 border-b-[var(--neo-border-width)] border-b-[var(--neo-text)]">
            <div className="p-4">
              <h1 className="font-heading text-3xl md:text-4xl tracking-widest">LAB:01 - FBQR</h1>
            </div>
            <div className="border-l-[var(--neo-border-width)] border-l-[var(--neo-text)] p-4 flex items-center">
              <AuthButton user={user} onLoginClick={() => setIsAuthModalOpen(true)} />
            </div>
          </header>

          {/* Desktop Layout */}
          <div className="hidden lg:grid flex-1 lg:grid-cols-[400px_auto_1fr_auto_400px] min-h-0 w-full">
            <ConfigPanel
              text={text}
              onTextChange={(newText) => {
                setText(newText)
                setOriginalUrl(undefined)
              }}
              styleOptions={style}
              onStyleChange={handleStyleChange}
              onGenerateClick={handleGenerateClick}
              isGenerating={isGenerating || isShortening}
              isLoading={isLoading}
              onLogoUpload={handleLogoUpload}
              logoPreview={logoPreview}
              onShortenUrl={handleShortenUrl}
              isShortening={isShortening}
            />
            <VerticalDivider />
            <PreviewPanel text={text} style={style} logoPreview={logoPreview} onSizeChange={handleSizeChange} />
            <VerticalDivider />
            <CollectionPanel
              qrCodes={qrCodes}
              copiedId={copiedId}
              setCopiedId={setCopiedId}
              onRemove={handleRemoveQrCode}
              isLoading={isLoading}
              user={user}
            />
          </div>

          {/* Mobile & Tablet Layout */}
          <div className="lg:hidden flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="flex flex-col">
                <div className="border-b-[var(--neo-border-width)] border-b-[var(--neo-text)]">
                  <PreviewPanel text={text} style={style} logoPreview={logoPreview} onSizeChange={handleSizeChange} />
                </div>
                <div className="border-b-[var(--neo-border-width)] border-b-[var(--neo-text)]">
                  <ConfigPanel
                    text={text}
                    onTextChange={(newText) => {
                      setText(newText)
                      setOriginalUrl(undefined)
                    }}
                    styleOptions={style}
                    onStyleChange={handleStyleChange}
                    onGenerateClick={handleGenerateClick}
                    isGenerating={isGenerating || isShortening}
                    isLoading={isLoading}
                    onLogoUpload={handleLogoUpload}
                    logoPreview={logoPreview}
                    onShortenUrl={handleShortenUrl}
                    isShortening={isShortening}
                  />
                </div>
                <CollectionPanel
                  qrCodes={qrCodes}
                  copiedId={copiedId}
                  setCopiedId={setCopiedId}
                  onRemove={handleRemoveQrCode}
                  isLoading={isLoading}
                  user={user}
                />
              </div>
            </ScrollArea>
          </div>
        </div>
      </main>
    </>
  )
}
