"use client"

import { Download, Copy, Check, Trash2 } from "lucide-react"
import { NeoButton } from "@/components/ui/neo-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

  const getApiUrl = (config: any) => {
    const params = new URLSearchParams({ config: JSON.stringify(config) })
    return `/api/generate-qr-svg?${params.toString()}`
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
    const response = await fetch(getApiUrl(qrConfig))
    const blob = await response.blob()
    downloadFile(blob, `qr-code-${Date.now()}.svg`)
  }

  const handleDownloadPng = async () => {
    const svgUrl = getApiUrl(qrConfig)
    const image = new Image()
    image.crossOrigin = "anonymous"
    image.src = svgUrl

    image.onload = () => {
      const canvas = document.createElement("canvas")
      const scale = 4
      canvas.width = image.width * scale
      canvas.height = image.height * scale
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
          if (blob) {
            downloadFile(blob, `qr-code-${Date.now()}.png`)
          }
        }, "image/png")
      }
    }
    image.onerror = () => {
      toast.error("PNG Download Failed", { description: "Could not load QR code image." })
    }
  }

  const handleCopy = async () => {
    try {
      const response = await fetch(getApiUrl(qrConfig))
      const svgText = await response.text()
      await navigator.clipboard.writeText(svgText)
      toast("Copied!", { description: "SVG code copied to clipboard." })
      setCopiedId(qrCodeResult.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      toast.error("Copy Failed", { description: "Could not copy SVG code." })
    }
  }

  return (
    <div className="bg-[var(--neo-white)] border-[var(--neo-border-width)] border-[var(--neo-text)] p-3 rounded-md space-y-3">
      <div className="flex items-start gap-3">
        <img
          src={thumbnail || getApiUrl({ ...qrConfig, width: 64 })}
          alt={`QR for ${text}`}
          className="w-16 h-16 flex-shrink-0 bg-white p-1 border-[var(--neo-border-width)] border-[var(--neo-text)]"
        />
        <div className="flex-1 min-w-0">
          <p className="font-mono text-sm truncate" title={text}>
            {text}
          </p>
          <p className="text-xs text-gray-500 font-mono">{new Date(qrCodeResult.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <NeoButton variant="outline" size="icon" className="flex-1" onClick={handleCopy}>
          {isCopied ? <Check size={16} /> : <Copy size={16} />}
        </NeoButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <NeoButton variant="outline" size="icon" className="flex-1">
              <Download size={16} />
            </NeoButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleDownloadSvg}>SVG</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadPng}>PNG</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <NeoButton variant="destructive" size="icon" className="flex-1" onClick={() => onRemove(qrCodeResult.id)}>
          <Trash2 size={16} />
        </NeoButton>
      </div>
    </div>
  )
}
