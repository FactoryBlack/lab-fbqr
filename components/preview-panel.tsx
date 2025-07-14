"use client"

import { useEffect, useState, useRef } from "react"
import { useDebounce } from "use-debounce"
import jsQR from "jsqr"
import { QrStatusIndicator, type Status as ValidationState } from "./qr-status-indicator"
import useResizeObserver from "use-resize-observer"
import type { QRStyleOptions } from "@/types"
import { motion, AnimatePresence } from "framer-motion"

const Loader = () => (
  <motion.div
    className="w-16 h-16 border-4 border-t-transparent border-black rounded-full"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
  />
)

interface PreviewPanelProps {
  text: string
  style: QRStyleOptions
  logoPreview: string | null
  onSizeChange: (size: number) => void
}

const VALIDATION_CANVAS_SIZE = 400
const DENSITY_WARNING_THRESHOLD = 25 // QR Code Version above which we show a warning

export default function PreviewPanel({ text, style, logoPreview, onSizeChange }: PreviewPanelProps) {
  const [svgContent, setSvgContent] = useState<string>("")
  const [validationStatus, setValidationStatus] = useState<ValidationState>("idle")
  const [isLoading, setIsLoading] = useState(false)
  const validationRef = useRef(0)

  const { ref: containerRef, width } = useResizeObserver<HTMLDivElement>()

  useEffect(() => {
    if (width) {
      onSizeChange(width)
    }
  }, [width, onSizeChange])

  const [debouncedText] = useDebounce(text, 500)
  const [debouncedStyle] = useDebounce(style, 500)
  const [debouncedLogo] = useDebounce(logoPreview, 500)

  useEffect(() => {
    if (!debouncedText.trim()) {
      setSvgContent("")
      setValidationStatus("idle")
      return
    }

    const currentValidationId = ++validationRef.current
    setIsLoading(true)
    setValidationStatus("checking")

    const processQrCode = async () => {
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

        if (validationRef.current !== currentValidationId) return
        if (!response.ok) throw new Error("Failed to generate QR code")

        const { svg, version } = await response.json()
        if (validationRef.current !== currentValidationId) return

        setSvgContent(svg)

        const image = new Image()
        image.crossOrigin = "anonymous"
        image.src = `data:image/svg+xml;base64,${btoa(svg)}`

        image.onload = () => {
          if (validationRef.current !== currentValidationId) return

          const canvas = document.createElement("canvas")
          canvas.width = VALIDATION_CANVAS_SIZE
          canvas.height = VALIDATION_CANVAS_SIZE
          const ctx = canvas.getContext("2d", { willReadFrequently: true })
          if (!ctx) {
            setValidationStatus("invalid")
            return
          }
          ctx.drawImage(image, 0, 0, VALIDATION_CANVAS_SIZE, VALIDATION_CANVAS_SIZE)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height)

          if (validationRef.current !== currentValidationId) return

          if (code && code.data === debouncedText.trim()) {
            if (version > DENSITY_WARNING_THRESHOLD) {
              setValidationStatus("warning")
            } else {
              setValidationStatus("valid")
            }
          } else {
            setValidationStatus("invalid")
          }
        }

        image.onerror = () => {
          if (validationRef.current !== currentValidationId) return
          setValidationStatus("invalid")
        }
      } catch (error) {
        if (validationRef.current === currentValidationId) {
          console.error(error)
          setValidationStatus("invalid")
        }
      } finally {
        if (validationRef.current === currentValidationId) {
          setIsLoading(false)
        }
      }
    }

    processQrCode()
  }, [debouncedText, debouncedStyle, debouncedLogo, onSizeChange])

  return (
    <div className="flex flex-col h-full items-start justify-start p-6">
      <div className="w-full sticky top-6">
        <div
          ref={containerRef}
          className="w-full lg:max-w-[70vh] mx-auto aspect-square bg-[var(--neo-interactive-bg)] border-2 border-black flex items-center justify-center p-4 md:p-8 relative"
          style={{ boxShadow: `8px 8px 0px #000` }}
        >
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-[var(--neo-interactive-bg)]/80 z-20"
              >
                <Loader />
              </motion.div>
            )}
          </AnimatePresence>

          {svgContent && (
            <img
              className="w-full h-full object-contain"
              src={`data:image/svg+xml;base64,${btoa(svgContent)}`}
              alt="Generated QR Code"
            />
          )}

          <QrStatusIndicator status={validationStatus} />
        </div>
      </div>
    </div>
  )
}
