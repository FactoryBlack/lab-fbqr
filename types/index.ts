import type React from "react"
import type { DOT_TYPES, CORNER_SQUARE_TYPES, CORNER_DOT_TYPES } from "@/lib/constants"

export type Gradient = {
  type: "linear" | "radial"
  rotation?: number
  colorStops: {
    offset: number
    color: string
  }[]
}

export type DotType = (typeof DOT_TYPES)[number]
export type CornerSquareType = (typeof CORNER_SQUARE_TYPES)[number]
export type CornerDotType = (typeof CORNER_DOT_TYPES)[number]

export interface DotsOptions {
  type: DotType
  color?: string
  useGradient: boolean
  gradient: Gradient
}

export interface CornersSquareOptions {
  type: CornerSquareType | null
  color?: string
  useGradient: boolean
  gradient: Gradient
}

export interface CornersDotOptions {
  type: CornerDotType | null
  color?: string
  useGradient: boolean
  gradient: Gradient
}

export interface BackgroundOptions {
  color?: string
  useGradient: boolean
  gradient: Gradient
}

export interface QRStyleOptions {
  width: number
  dotsOptions: DotsOptions
  backgroundOptions: BackgroundOptions
  cornersSquareOptions: CornersSquareOptions
  cornersDotOptions: CornersDotOptions
  imageOptions: {
    imageSize: number
    hideBackgroundDots: boolean
    margin: number
  }
  qrOptions: {
    errorCorrectionLevel: "L" | "M" | "Q" | "H"
  }
}

export interface Config {
  data: string
  dotsOptions: QRStyleOptions["dotsOptions"]
  cornersSquareOptions: QRStyleOptions["cornersSquareOptions"]
  cornersDotOptions: QRStyleOptions["cornersDotOptions"]
  backgroundOptions: QRStyleOptions["backgroundOptions"]
  logoOptions: {
    logoSize: number
    margin: number
  }
  logo: string | null
}

export interface ConfigPanelProps {
  text: string
  onTextChange: (value: string) => void
  styleOptions: QRStyleOptions
  onStyleChange: (newOptions: Partial<QRStyleOptions>) => void
  onGenerateClick: () => void
  isGenerating: boolean
  onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  logoPreview: string | null
  onRemoveLogo: () => void
  onShortenUrl: () => Promise<void>
  isShortening: boolean
}
