"use client"

import { useEffect, useState, useCallback } from "react"
import { useDebounce } from "use-debounce"
import jsQR from "jsqr"
import { ValidationStatus, type Status as ValidationState } from "./validation-status"
import useResizeObserver from "use-resize-observer"
import type { QRStyleOptions } from "./config-panel"

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
    <div className="space-y-4">
      <h2 className="font-heading text-3xl">Live Preview</h2>
      <div
        ref={containerRef}
        className="aspect-square bg-[var(--neo-off-white)] border-[var(--neo-border-width)] border-[var(--neo-text)] flex items-center justify-center p-4 md:p-8 rounded-lg relative"
      >
        {isLoading && !svgContent && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50">
            <svg
              className="animate-spin h-8 w-8 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
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
      <ValidationStatus status={validationStatus} />
    </div>
  )
}
