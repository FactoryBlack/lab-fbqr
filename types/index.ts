export type Gradient = {
  type: "linear" | "radial"
  rotation: number
  colorStops: {
    offset: number
    color: string
  }[]
}

export type CornerSquareType = "square" | "rounded" | "extra-rounded" | "dot" | "classy" | "classy-rounded"
export type CornerDotType = "square" | "rounded" | "extra-rounded" | "dot" | "classy" | "classy-rounded" | "inherit"

export type QRStyleOptions = {
  width: number
  dotsOptions: {
    type: "square" | "rounded" | "dots" | "classy" | "classy-rounded" | "extra-rounded" | "fluid" | "fluid-smooth"
    color?: string
    gradient?: Gradient
  }
  backgroundOptions: {
    color?: string
    gradient?: Gradient
  }
  cornersSquareOptions: {
    type: CornerSquareType | null
    color?: string
    gradient?: Gradient
  }
  cornersDotOptions?: {
    type: CornerDotType | null
    color?: string
    gradient?: Gradient
  }
  imageOptions: {
    imageSize: number
    hideBackgroundDots: boolean
    margin: number
  }
  qrOptions: {
    errorCorrectionLevel: "L" | "M" | "Q" | "H"
  }
}

export type QRCodeResult = {
  id: string
  text: string
  style: QRStyleOptions
  logo: string | null
  svg: string
  shortUrl?: string
}
