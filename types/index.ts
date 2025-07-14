import type React from "react"
import type { SVGProps } from "react"

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export type ContentType = "url" | "text" | "email" | "phone" | "sms" | "wifi"

export interface Gradient {
  type: "linear" | "radial"
  rotation?: number
  colorStops: {
    offset: number
    color: string
  }[]
}

export interface DotsOptions {
  type: "square" | "rounded" | "extra-rounded" | "classy" | "classy-rounded" | "dots" | "fluid" | "fluid-smooth"
  color: string
  useGradient?: boolean
  gradient?: Gradient
}

export interface CornersSquareOptions {
  type: "square" | "rounded" | "extra-rounded" | "dot" | "classy" | "classy-rounded"
  color?: string
  useGradient?: boolean
  gradient?: Gradient
}

export interface CornersDotOptions {
  type: "inherit" | "square" | "rounded" | "extra-rounded" | "dot" | "classy" | "classy-rounded"
  color?: string
  useGradient?: boolean
  gradient?: Gradient
}

export interface BackgroundOptions {
  color: string
  useGradient?: boolean
  gradient?: Gradient
}

export interface ImageOptions {
  src: string | null
  hideBackgroundDots: boolean
  imageSize: number
  margin: number
}

export interface QRStyleOptions {
  width?: number
  dotsOptions: DotsOptions
  backgroundOptions: BackgroundOptions
  cornersSquareOptions: CornersSquareOptions
  cornersDotOptions: CornersDotOptions
  qrOptions?: {
    errorCorrectionLevel?: "L" | "M" | "Q" | "H"
  }
  imageOptions: ImageOptions
  data?: string
  image?: string | null
}

export interface QRCodeResult {
  id: string
  text: string
  originalUrl?: string
  qrConfig: QRStyleOptions
  thumbnail: string
  createdAt: string
}

export interface ConfigPanelProps {
  text: string
  onTextChange: (text: string) => void
  styleOptions: QRStyleOptions
  onStyleChange: (options: Partial<QRStyleOptions>) => void
  onGenerateClick: () => void
  isGenerating: boolean
  onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  logoPreview: string | null
  onRemoveLogo: () => void
  onShortenUrl: () => Promise<void>
  isShortening: boolean
}
