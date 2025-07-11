"use client"

import { NeoButton } from "@/components/ui/neo-button"
import { toast } from "sonner"
import type { QRCodeResult } from "@/app/page"

interface CollectionItemProps {
  qrCodeResult: QRCodeResult
  isCopied: boolean
  setCopiedId: (id: string | null) => void
  onRemove: (id: string) => void
}

export function CollectionItem({ qrCodeResult, isCopied, setCopiedId, onRemove }: CollectionItemProps) {
  const { qrConfig, thumbnail, text } = qrCodeResult

  const fetchQrSvgBlob = async () => {
    const response = await fetch("/api/generate-qr-svg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(qrConfig),
    })
    if (!response.ok) {
      throw new Error("Failed to fetch QR code SVG.")
    }
    return response.blob()
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
      toast.error("SVG Download Failed", { description: error.message })
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
        toast.error("PNG Download Failed", { description: "Could not load QR code image." })
      }

      image.src = url
    } catch (error: any) {
      toast.error("PNG Download Failed", { description: error.message || "An error occurred." })
    }
  }

  const handleCopy = async () => {
    try {
      const response = await fetch("/api/generate-qr-svg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(qrConfig),
      })
      if (!response.ok) throw new Error("Failed to fetch SVG for copying.")
      const svgText = await response.text()
      await navigator.clipboard.writeText(svgText)
      toast("Copied!", { description: "SVG code copied to clipboard." })
      setCopiedId(qrCodeResult.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error: any) {
      toast.error("Copy Failed", { description: error.message || "Could not copy SVG code." })
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
        <NeoButton variant="outline" size="sm" onClick={handleCopy}>
          {isCopied ? "COPIED" : "COPY"}
        </NeoButton>
        <NeoButton variant="outline" size="sm" onClick={handleDownloadSvg}>
          SVG
        </NeoButton>
        <NeoButton variant="outline" size="sm" onClick={handleDownloadPng}>
          PNG
        </NeoButton>
        <NeoButton variant="destructive" size="sm" onClick={() => onRemove(qrCodeResult.id)}>
          DEL
        </NeoButton>
      </div>
    </div>
  )
}
