"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { ConfigPanel, type QRStyleOptions } from "@/components/config-panel"
import { PreviewPanel } from "@/components/preview-panel"
import { CollectionPanel } from "@/components/collection-panel"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { AuthModal } from "@/components/auth-modal"
import QRCodeStyling from "qr-code-styling"
import AuthButton from "@/components/auth-button"
import { VerticalDivider } from "@/components/vertical-divider"

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

    const qrCodeStyling = new QRCodeStyling({
      width: 64,
      height: 64,
      ...style,
      data: text,
      image: logoPreview,
    })

    const svgString = await qrCodeStyling.getSvg()
    const thumbnailDataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`

    const newQrCode: QRCodeResult = {
      id: Date.now().toString(),
      text: text,
      originalUrl: originalUrl,
      qrConfig: { ...style, data: text, image: logoPreview },
      thumbnail: thumbnailDataUrl,
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
      <main className="h-screen max-h-screen overflow-hidden p-4 sm:p-6 md:p-8 flex flex-col">
        <header className="flex items-start justify-between w-full">
          <h1 className="font-heading text-5xl md:text-6xl tracking-widest">LAB:01 - FBQR</h1>
          <AuthButton user={user} onLoginClick={() => setIsAuthModalOpen(true)} />
        </header>

        <div className="flex-1 grid grid-cols-[1fr_auto_2fr_auto_1fr] gap-6 min-h-0 py-6">
          {/* Column 1: Config */}
          <div className="flex flex-col min-h-0">
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
              onLogoUpload={handleLogoUpload}
              logoPreview={logoPreview}
              onShortenUrl={handleShortenUrl}
              isShortening={isShortening}
            />
          </div>

          {/* Column 2: Divider */}
          <VerticalDivider>QR-BRUTAL V.01</VerticalDivider>

          {/* Column 3: Preview */}
          <div className="flex flex-col min-h-0">
            <PreviewPanel text={text} style={style} logoPreview={logoPreview} onSizeChange={handleSizeChange} />
          </div>

          {/* Column 4: Divider */}
          <VerticalDivider>COLLECTION</VerticalDivider>

          {/* Column 5: Collection */}
          <div className="flex flex-col min-h-0">
            <CollectionPanel
              qrCodes={qrCodes}
              copiedId={copiedId}
              setCopiedId={setCopiedId}
              onRemove={handleRemoveQrCode}
              onSave={handleSaveCollection}
              isLoading={isLoading}
              user={user}
            />
          </div>
        </div>
      </main>
    </>
  )
}
