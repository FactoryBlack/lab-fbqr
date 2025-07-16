"use client"

import { NeoButton } from "@/components/ui/neo-button"
import { useToast } from "@/hooks/use-toast"
import type { QRCodeResult } from "@/types"

interface CollectionItemProps {
  qrCodeResult: QRCodeResult
  onRemove: (id: string) => void
  onLoad: (qrCodeResult: QRCodeResult) => void
}

export function CollectionItem({ qrCodeResult, onRemove, onLoad }: CollectionItemProps) {
  const { qrConfig, thumbnail, text } = qrCodeResult
  const { toast } = useToast()

  const fetchQrSvgBlob = async () => {
    const response = await fetch("/api/generate-qr-svg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(qrConfig),
    })
    if (!response.ok) {
      throw new Error("Failed to fetch QR code SVG.")
    }
    // Correctly parse the JSON and create a blob from the SVG string
    const { svg } = await response.json()
    return new Blob([svg], { type: "image/svg+xml" })
  }

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadSvg = async () => {
    try {
      const blob = await fetchQrSvgBlob()
      downloadFile(blob, `qr-code-${Date.now()}.svg`)
    } catch (error: any) {
      toast({ variant: "destructive", title: "SVG Download Failed", description: error.message })
    }
  }

  const handleDownloadPng = async () => {
    try {
      const svgBlob = await fetchQrSvgBlob()
      const url = URL.createObjectURL(svgBlob)

      const image = new Image()
      image.crossOrigin = "anonymous"

      image.onload = () => {
        const canvas = document.createElement("canvas")
        const scale = 4
        canvas.width = qrConfig.width * scale
        canvas.height = qrConfig.width * scale
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
          canvas.toBlob((blob) => {
            if (blob) {
              downloadFile(blob, `qr-code-${Date.now()}.png`)
            }
          }, "image/png")
        }
        URL.revokeObjectURL(url)
      }

      image.onerror = () => {
        URL.revokeObjectURL(url)
        toast({ variant: "destructive", title: "PNG Download Failed", description: "Could not load QR code image." })
      }

      image.src = url
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "PNG Download Failed",
        description: error.message || "An error occurred.",
      })
    }
  }

  return (
    <div className="bg-transparent border-b border-b-neo-text/20 last:border-b-0 pb-3 space-y-3">
      <div className="flex items-center gap-4">
        <img
          src={thumbnail || "/placeholder.svg"}
          alt={`QR for ${text}`}
          className="w-16 h-16 flex-shrink-0 bg-white p-1 border-[var(--neo-border-width)] border-[var(--neo-text)]"
        />
        <div className="flex-1 min-w-0">
          <p className="font-sans text-base font-bold truncate" title={text}>
            {text}
          </p>
          <p className="text-sm text-gray-600 font-sans">{new Date(qrCodeResult.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <NeoButton variant="secondary" size="sm" onClick={() => onLoad(qrCodeResult)}>
          LOAD
        </NeoButton>
        <NeoButton variant="default" size="sm" onClick={handleDownloadSvg}>
          SVG
        </NeoButton>
        <NeoButton variant="default" size="sm" onClick={handleDownloadPng}>
          PNG
        </NeoButton>
        <NeoButton variant="destructive" size="sm" onClick={() => onRemove(qrCodeResult.id)}>
          DEL
        </NeoButton>
      </div>
    </div>
  )
}
