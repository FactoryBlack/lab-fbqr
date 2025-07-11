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
import { AuthModal } from "@/components/auth-modal" // Import the new modal

// In the QRCodeResult interface, add originalUrl
export interface QRCodeResult {
  id: string
  text: string
  originalUrl?: string // Add this line
  qrConfig: QRStyleOptions & { data: string; image?: string | null }
  createdAt: string
}

// In the QRGeneratorPage component, add the new state for the checkbox
export default function QRGeneratorPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false) // State for modal
  const [text, setText] = useState("https://vercel.com")
  const [qrCodes, setQrCodes] = useState<QRCodeResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  // ... other states
  const [shouldShortenUrl, setShouldShortenUrl] = useState(false)
  // ...

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  // Load collections if user is logged in
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
        // If user logs out, clear the collection
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

  // Update the handleGenerateClick function
  const handleGenerateClick = async () => {
    if (!text.trim()) {
      toast.error("Error", { description: "Content cannot be empty." })
      return
    }

    let qrText = text
    let originalUrl: string | undefined = undefined

    if (shouldShortenUrl) {
      if (!user) {
        toast.error("Please log in to create a short link.")
        setIsAuthModalOpen(true)
        return
      }
      setIsGenerating(true)
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
        qrText = data.shortUrl
        originalUrl = text
        toast.success("URL shortened!", { description: `Your new link is: ${qrText}` })
      } catch (error: any) {
        toast.error("Shortening Failed", { description: error.message })
        setIsGenerating(false)
        return
      } finally {
        setIsGenerating(false)
      }
    }

    const newQrCode: QRCodeResult = {
      id: Date.now().toString(),
      text: qrText,
      originalUrl,
      qrConfig: { ...style, data: qrText, image: logoPreview },
      createdAt: new Date().toISOString(),
    }
    setQrCodes((prev) => [newQrCode, ...prev])
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
      // For simplicity, we save the entire current collection as "Default Collection"
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

  // In the return statement, pass the new state and handler to ConfigPanel
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
              onTextChange={setText}
              styleOptions={style}
              onStyleChange={handleStyleChange}
              onGenerateClick={handleGenerateClick}
              isGenerating={isGenerating}
              onLogoUpload={handleLogoUpload}
              logoPreview={logoPreview}
              shouldShortenUrl={shouldShortenUrl} // Add this
              onShouldShortenUrlChange={setShouldShortenUrl} // Add this
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
