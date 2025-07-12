"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { useDebouncedCallback } from "use-debounce"
import ConfigPanel from "@/components/config-panel"
import PreviewPanel from "@/components/preview-panel"
import CollectionPanel from "@/components/collection-panel"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import AuthModal from "@/components/auth-modal"
import AuthButton from "@/components/auth-button"
import { VerticalDivider } from "@/components/vertical-divider"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { QRCodeResult, QRStyleOptions } from "@/types"

export default function QRGeneratorPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [text, setText] = useState("https://lab.factory.black")
  const [originalUrl, setOriginalUrl] = useState<string | undefined>(undefined)
  const [qrCodes, setQrCodes] = useState<QRCodeResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isShortening, setIsShortening] = useState(false)
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
        setQrCodes([])
        setIsCollectionLoaded(false)
      }
    })

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  useEffect(() => {
    const loadCollection = async () => {
      if (user && !isCollectionLoaded) {
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
          setIsCollectionLoaded(true)
        }
      }
    }
    loadCollection()
  }, [user, isCollectionLoaded])

  const [style, setStyle] = useState<QRStyleOptions>({
    width: 300,
    dotsOptions: { color: "#1c1c1c", type: "square" },
    backgroundOptions: { color: "transparent" },
    cornersSquareOptions: { color: "#1c1c1c", type: "square" },
    cornersDotOptions: { type: "inherit", color: "#1c1c1c" },
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

  const handleRemoveLogo = () => {
    setLogoPreview(null)
    toast("Logo Removed")
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

  const handleLoadQrCode = (qrCodeToLoad: QRCodeResult) => {
    const { qrConfig, text, originalUrl } = qrCodeToLoad
    const { data, image, ...styleOptions } = qrConfig

    setText(text)
    setOriginalUrl(originalUrl)
    setStyle(styleOptions)
    setLogoPreview(image || null)

    toast("Style Loaded", { description: "Configuration has been applied from your collection." })
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
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} redirectTo="/fbqr" />
      <div className="p-4 sm:p-6 md:p-8">
        <main
          className="bg-[var(--neo-bg)] border-2 border-black flex flex-col min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)]"
          style={{ boxShadow: `8px 8px 0px #000` }}
        >
          <header className="flex items-stretch justify-between w-full flex-shrink-0 border-b-2 border-b-black">
            <div className="p-4 flex items-center">
              <h1 className="font-heading text-5xl md:text-6xl">
                <span className="hidden lg:inline">
                  LAB01<span className="text-[var(--neo-accent)]">/</span>
                </span>
                FBQR
              </h1>
            </div>
            <div className="border-l-2 border-l-black p-4 flex items-center">
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
              onLogoUpload={handleLogoUpload}
              logoPreview={logoPreview}
              onRemoveLogo={handleRemoveLogo}
              onShortenUrl={handleShortenUrl}
              isShortening={isShortening}
            />
            <VerticalDivider />
            <PreviewPanel text={text} style={style} logoPreview={logoPreview} onSizeChange={handleSizeChange} />
            <VerticalDivider />
            <CollectionPanel
              qrCodes={qrCodes}
              onRemove={handleRemoveQrCode}
              onLoad={handleLoadQrCode}
              user={user}
              isLoading={!isCollectionLoaded}
            />
          </div>

          {/* Mobile & Tablet Layout */}
          <div className="lg:hidden flex-1 min-h-0">
            <ScrollArea className="h-full">
              <div className="flex flex-col">
                <div className="border-b-2 border-b-black">
                  <PreviewPanel text={text} style={style} logoPreview={logoPreview} onSizeChange={handleSizeChange} />
                </div>
                <div className="border-b-2 border-b-black">
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
                    onRemoveLogo={handleRemoveLogo}
                    onShortenUrl={handleShortenUrl}
                    isShortening={isShortening}
                  />
                </div>
                <CollectionPanel
                  qrCodes={qrCodes}
                  onRemove={handleRemoveQrCode}
                  onLoad={handleLoadQrCode}
                  user={user}
                  isLoading={!isCollectionLoaded}
                />
              </div>
            </ScrollArea>
          </div>
        </main>
      </div>
    </>
  )
}
