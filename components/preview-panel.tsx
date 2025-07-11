"use client"

import { useEffect, useState, useCallback } from "react"
import { useDebounce } from "use-debounce"
import jsQR from "jsqr"
import { ValidationStatus, type Status as ValidationState } from "./validation-status"
import useResizeObserver from "use-resize-observer"
import type { QRStyleOptions } from "./config-panel"
import { Loader2 } from "lucide-react"

interface PreviewPanelProps {
  text: string
  style: QRStyleOptions
  logoPreview: string | null
  onSizeChange: (size: number) => void
}

export function PreviewPanel({ text, style, logoPreview, onSizeChange }: PreviewPanelProps) {
  const [svgContent, setSvgContent] = useState<string>("")
  const [validationStatus, setValidationStatus] = useState<ValidationState>("idle")
  const [isLoading, setIsLoading] = useState(false)

  const { ref: containerRef, width } = useResizeObserver<HTMLDivElement>()

  useEffect(() => {
    if (width) {
      onSizeChange(width)
    }
  }, [width, onSizeChange])

  const [debouncedText] = useDebounce(text, 500)
  const [debouncedStyle] = useDebounce(style, 500)
  const [debouncedLogo] = useDebounce(logoPreview, 500)

  const validateQRCode = useCallback(async (svgData: string, originalText: string) => {
    if (!svgData) return
    setValidationStatus("checking")
    const image = new Image()
    image.crossOrigin = "anonymous"
    image.src = `data:image/svg+xml;base64,${btoa(svgData)}`

    image.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = image.width
      canvas.height = image.height
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        setValidationStatus("invalid")
        return
      }
      ctx.drawImage(image, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code && code.data === originalText.trim()) {
        setValidationStatus("valid")
      } else {
        setValidationStatus("invalid")
      }
    }
    image.onerror = () => {
      setValidationStatus("invalid")
    }
  }, [])

  useEffect(() => {
    if (!debouncedText.trim()) {
      setSvgContent("")
      setValidationStatus("idle")
      return
    }

    setIsLoading(true)
    const fetchQrCode = async () => {
      try {
        const response = await fetch("/api/generate-qr-svg", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...debouncedStyle,
            data: debouncedText,
            image: debouncedLogo,
          }),
        })
        if (!response.ok) throw new Error("Failed to generate QR code")
        const svg = await response.text()
        setSvgContent(svg)
        validateQRCode(svg, debouncedText)
      } catch (error) {
        console.error(error)
        setValidationStatus("invalid")
      } finally {
        setIsLoading(false)
      }
    }

    fetchQrCode()
  }, [debouncedText, debouncedStyle, debouncedLogo, validateQRCode])

  return (
    <div className="flex flex-col h-full p-6">
      <div
        ref={containerRef}
        className="aspect-square bg-[var(--neo-off-white)] border-[var(--neo-border-width)] border-[var(--neo-text)] flex items-center justify-center p-4 md:p-8 relative flex-shrink-0"
      >
        {isLoading && !svgContent && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50">
            <Loader2 className="animate-spin h-8 w-8 text-black" />
          </div>
        )}
        {svgContent && (
          <img
            className="w-full h-full object-contain"
            src={`data:image/svg+xml;base64,${btoa(svgContent)}`}
            alt="Generated QR Code"
          />
        )}
      </div>
      <div className="pt-4 flex-1 flex flex-col justify-end">
        <ValidationStatus status={validationStatus} />
      </div>
    </div>
  )
}
