"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { toast } from "sonner"
import { PinModal } from "@/components/pin-modal"
import { HeaderBar } from "@/components/header-bar"
import { ConfigPanel, type QRStyleOptions } from "@/components/config-panel"
import { PreviewPanel } from "@/components/preview-panel"
import { CollectionPanel } from "@/components/collection-panel"
import { NeoButton } from "@/components/ui/neo-button"

export interface QRCodeResult {
  id: string
  text: string
  qrConfig: QRStyleOptions & { data: string; image?: string | null }
  createdAt: string
}

export default function QRGeneratorPage() {
  const [text, setText] = useState("https://vercel.com")
  const [qrCodes, setQrCodes] = useState<QRCodeResult[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [pinToLoad, setPinToLoad] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [savedPin, setSavedPin] = useState<string | null>(null)

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
      if (prev.width === size) {
        return prev
      }
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
      toast("Logo Added", {
        description: "Error correction boosted to High for best scanning.",
      })
    }
  }

  const handleGenerateClick = async () => {
    if (!text.trim()) {
      toast.error("Error", { description: "Content cannot be empty." })
      return
    }

    setIsGenerating(true)
    const id = Date.now().toString()

    const newQrCode: QRCodeResult = {
      id,
      text,
      qrConfig: {
        ...style,
        data: text,
        image: logoPreview,
      },
      createdAt: new Date().toISOString(),
    }
    setQrCodes((prev) => [newQrCode, ...prev])
    setIsGenerating(false)
    toast("QR Code Added", { description: "Added to your collection." })
  }

  const handleRemoveQrCode = (id: string) => {
    setQrCodes((prev) => prev.filter((qr) => qr.id !== id))
    toast("Removed from collection")
  }

  const handleSaveCollection = async () => {
    if (qrCodes.length === 0) {
      toast.error("Empty Collection", { description: "Generate at least one QR code." })
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
        setSavedPin(data.pin)
      } else {
        throw new Error(data.error || "Failed to save")
      }
    } catch (error: any) {
      toast.error("Save Failed", {
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadCollection = async () => {
    if (!pinToLoad.trim()) return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/load-collection?pin=${pinToLoad.trim()}`)
      const data = await response.json()
      if (response.ok) {
        setQrCodes(data.qrCodes)
        toast("Collection Loaded", { description: `Successfully loaded collection for PIN ${pinToLoad}.` })
        setPinToLoad("")
      } else {
        throw new Error(data.error || "Failed to load")
      }
    } catch (error: any) {
      toast.error("Load Failed", { description: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 dot-grid-bg -z-10" />
      <PinModal pin={savedPin} onClose={() => setSavedPin(null)} />

      <div className="min-h-screen p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-8">
            <HeaderBar
              pinToLoad={pinToLoad}
              onPinChange={setPinToLoad}
              onLoadClick={handleLoadCollection}
              isLoading={isLoading}
            />
            <ConfigPanel
              text={text}
              onTextChange={setText}
              styleOptions={style}
              onStyleChange={handleStyleChange}
              onGenerateClick={handleGenerateClick}
              isGenerating={isGenerating}
              onLogoUpload={handleLogoUpload}
              logoPreview={logoPreview}
            />
          </div>

          <div className="space-y-8">
            <PreviewPanel text={text} style={style} logoPreview={logoPreview} onSizeChange={handleSizeChange} />
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-3xl">Collection</h2>
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
