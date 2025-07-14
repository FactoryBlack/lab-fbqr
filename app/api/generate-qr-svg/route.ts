import { type NextRequest, NextResponse } from "next/server"
import qrcode, { type QRCode } from "qrcode"

// Helper to parse query params from a GET request
function getQrConfigFromRequest(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const configParam = searchParams.get("config")
  if (configParam) {
    try {
      return JSON.parse(configParam)
    } catch (e) {
      console.error("Failed to parse config JSON from URL", e)
      return null
    }
  }
  return null
}

export async function GET(request: NextRequest) {
  const config = getQrConfigFromRequest(request)
  if (!config) {
    return NextResponse.json({ error: "Invalid configuration" }, { status: 400 })
  }
  try {
    const svgString = await generateSvg(config)
    return new NextResponse(svgString, {
      headers: {
        "Content-Type": "image/svg+xml",
      },
    })
  } catch (error) {
    console.error("SVG Generation Error:", error)
    return NextResponse.json({ error: "Failed to generate QR code SVG" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const config = await request.json()
    const { svgString, version } = await generateSvg(config)
    return NextResponse.json({ svg: svgString, version: version })
  } catch (error) {
    console.error("SVG Generation Error:", error)
    return NextResponse.json({ error: "Failed to generate QR code SVG" }, { status: 500 })
  }
}

// --- SVG Generation Logic ---

async function generateSvg(config: any): Promise<{ svgString: string; version: number }> {
  const {
    data,
    width,
    dotsOptions,
    cornersSquareOptions,
    cornersDotOptions,
    backgroundOptions,
    image,
    imageOptions,
    qrOptions,
  } = config

  const qr = await qrcode.create(data, {
    errorCorrectionLevel: qrOptions?.errorCorrectionLevel || "H",
  })

  const svgString = renderSvg(qr, {
    width,
    dotsOptions,
    cornersSquareOptions,
    cornersDotOptions,
    backgroundOptions,
    image,
    imageOptions,
  })

  return { svgString, version: qr.version }
}

function renderSvg(qr: QRCode, options: any): string {
  const { width, dotsOptions, cornersSquareOptions, cornersDotOptions, backgroundOptions, image, imageOptions } =
    options

  const quietZoneModules = 4 // Standard quiet zone for better scannability
  const size = qr.modules.size
  const totalSizeInModules = size + quietZoneModules * 2
  const moduleSize = width / totalSizeInModules
  const offset = quietZoneModules * moduleSize

  let defsContent = ""

  const addGradient = (id: string, gradient: any, isGlobal: boolean) => {
    if (!gradient) return ""
    const gradientId = `grad-${id}`

    if (isGlobal) {
      const qrDrawingAreaSize = size * moduleSize
      const centerX = offset + qrDrawingAreaSize / 2
      const centerY = offset + qrDrawingAreaSize / 2
      if (gradient.type === "linear") {
        defsContent += `<linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" x1="${offset}" y1="${offset}" x2="${
          offset + qrDrawingAreaSize
        }" y2="${offset}" gradientTransform="rotate(${gradient.rotation || 0}, ${centerX}, ${centerY})">`
      } else {
        defsContent += `<radialGradient id="${gradientId}" gradientUnits="userSpaceOnUse" fx="${centerX}" fy="${centerY}" cx="${centerX}" cy="${centerY}" r="${
          qrDrawingAreaSize / 2
        }">`
      }
    } else {
      if (gradient.type === "linear") {
        defsContent += `<linearGradient id="${gradientId}" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(${
          gradient.rotation || 0
        }, 0.5, 0.5)">`
      } else {
        defsContent += `<radialGradient id="${gradientId}" gradientUnits="objectBoundingBox" cx="0.5" cy="0.5" r="0.5">`
      }
    }

    gradient.colorStops.forEach((stop: any) => {
      defsContent += `<stop offset="${stop.offset * 100}%" stop-color="${stop.color}"/>`
    })
    defsContent += gradient.type === "linear" ? `</linearGradient>` : `</radialGradient>`
    return `fill="url(#${gradientId})"`
  }

  const dotsFill =
    dotsOptions.useGradient && dotsOptions.gradient
      ? addGradient("dots", dotsOptions.gradient, true)
      : `fill="${dotsOptions.color}"`

  let svgContent = ""

  // Background
  if (backgroundOptions.color !== "transparent") {
    const bgFill =
      backgroundOptions.useGradient && backgroundOptions.gradient
        ? addGradient("bg", backgroundOptions.gradient, true)
        : `fill="${backgroundOptions.color}"`
    svgContent += `<rect x="0" y="0" width="${width}" height="${width}" ${bgFill} />`
  }

  const drawRoundedRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    r: { tl: number; tr: number; br: number; bl: number },
  ) => {
    const newX = x + offset
    const newY = y + offset
    return `M${newX + r.tl},${newY} H${newX + w - r.tr} A${r.tr},${r.tr} 0 0 1 ${newX + w},${newY + r.tr} V${
      newY + h - r.br
    } A${r.br},${r.br} 0 0 1 ${newX + w - r.br},${newY + h} H${newX + r.bl} A${r.bl},${r.bl} 0 0 1 ${newX},${
      newY + h - r.bl
    } V${newY + r.tl} A${r.tl},${r.tl} 0 0 1 ${newX + r.tl},${newY} Z`
  }

  const cornerPositions = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ]

  const isCorner = (r: number, c: number) => {
    return cornerPositions.some(([pr, pc]) => r >= pr && r < pr + 7 && c >= pc && c < pc + 7)
  }

  const qrWidth = size * moduleSize
  const logoMargin = imageOptions?.margin || 0
  const logoSize = imageOptions?.imageSize ? qrWidth * imageOptions.imageSize : 0
  const logoX = offset + qrWidth / 2 - logoSize / 2
  const logoY = offset + qrWidth / 2 - logoSize / 2
  const logoBox = {
    x1: logoX - logoMargin,
    y1: logoY - logoMargin,
    x2: logoX + logoSize + logoMargin,
    y2: logoY + logoSize + logoMargin,
  }

  const isModuleRendered = (r: number, c: number): boolean => {
    if (r < 0 || r >= size || c < 0 || c >= size) return false
    if (!qr.modules.get(r, c)) return false
    if (image && imageOptions?.hideBackgroundDots && !isCorner(r, c)) {
      const moduleX = c * moduleSize + offset
      const moduleY = r * moduleSize + offset
      if (
        moduleX + moduleSize > logoBox.x1 &&
        moduleX < logoBox.x2 &&
        moduleY + moduleSize > logoBox.y1 &&
        moduleY < logoBox.y2
      ) {
        return false
      }
    }
    return true
  }

  // Draw corner elements
  cornerPositions.forEach(([pr, pc]) => {
    const csType = cornersSquareOptions?.type || "square"
    let cdType = cornersDotOptions?.type ?? "inherit"
    if (cdType === "inherit") {
      cdType = csType
    }

    const csFill =
      cornersSquareOptions.useGradient && cornersSquareOptions.gradient
        ? addGradient(`cs-${pr}-${pc}`, cornersSquareOptions.gradient, false)
        : `fill="${cornersSquareOptions.color || dotsOptions.color}"`

    const cdFill =
      cornersDotOptions.useGradient && cornersDotOptions.gradient
        ? addGradient(`cd-${pr}-${pc}`, cornersDotOptions.gradient, false)
        : `fill="${cornersDotOptions.color || cornersSquareOptions.color || dotsOptions.color}"`

    const isTopLeft = pr === 0 && pc === 0
    const isTopRight = pr === 0 && pc === size - 7
    const isBottomLeft = pr === size - 7 && pc === 0

    const csRadii = { tl: 0, tr: 0, br: 0, bl: 0 }
    if (csType === "dot") csRadii.tl = csRadii.tr = csRadii.br = csRadii.bl = 3.5 * moduleSize
    else if (csType === "rounded") csRadii.tl = csRadii.tr = csRadii.br = csRadii.bl = 2 * moduleSize
    else if (csType === "extra-rounded") csRadii.tl = csRadii.tr = csRadii.br = csRadii.bl = 3 * moduleSize
    else if (csType === "classy") {
      if (isTopLeft) csRadii.tl = 2 * moduleSize
      if (isTopRight) csRadii.tr = 2 * moduleSize
      if (isBottomLeft) csRadii.bl = 2 * moduleSize
    } else if (csType === "classy-rounded") {
      if (isTopLeft) csRadii.tl = csRadii.tr = csRadii.bl = 2 * moduleSize
      if (isTopRight) csRadii.tl = csRadii.tr = csRadii.br = 2 * moduleSize
      if (isBottomLeft) csRadii.tl = csRadii.bl = csRadii.br = 2 * moduleSize
    }

    const outerPath = drawRoundedRect(pc * moduleSize, pr * moduleSize, 7 * moduleSize, 7 * moduleSize, csRadii)
    const innerPath = drawRoundedRect((pc + 1) * moduleSize, (pr + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize, {
      tl: Math.max(0, csRadii.tl - moduleSize),
      tr: Math.max(0, csRadii.tr - moduleSize),
      br: Math.max(0, csRadii.br - moduleSize),
      bl: Math.max(0, csRadii.bl - moduleSize),
    })
    svgContent += `<path d="${outerPath} ${innerPath}" ${csFill} fill-rule="evenodd" />`

    const cdRadii = { tl: 0, tr: 0, br: 0, bl: 0 }
    if (cdType === "dot") cdRadii.tl = cdRadii.tr = cdRadii.br = cdRadii.bl = 1.5 * moduleSize
    else if (cdType === "rounded") cdRadii.tl = cdRadii.tr = cdRadii.br = cdRadii.bl = 0.75 * moduleSize
    else if (cdType === "extra-rounded") cdRadii.tl = cdRadii.tr = cdRadii.br = cdRadii.bl = 1.25 * moduleSize
    else if (cdType === "classy") {
      if (isTopLeft) cdRadii.tl = 0.75 * moduleSize
      if (isTopRight) cdRadii.tr = 0.75 * moduleSize
      if (isBottomLeft) cdRadii.bl = 0.75 * moduleSize
    } else if (cdType === "classy-rounded") {
      if (isTopLeft) cdRadii.tl = cdRadii.tr = cdRadii.bl = 0.75 * moduleSize
      if (isTopRight) cdRadii.tl = cdRadii.tr = cdRadii.br = 0.75 * moduleSize
      if (isBottomLeft) cdRadii.tl = cdRadii.bl = cdRadii.br = 0.75 * moduleSize
    }
    svgContent += `<path d="${drawRoundedRect(
      (pc + 2) * moduleSize,
      (pr + 2) * moduleSize,
      3 * moduleSize,
      3 * moduleSize,
      cdRadii,
    )}" ${cdFill} />`
  })

  // Draw data modules
  const dotStyle = dotsOptions.type
  if (dotStyle === "fluid" || dotStyle === "fluid-smooth") {
    let fluidShapes = ""
    const radius = moduleSize / 2
    const overlap = 0.5
    fluidShapes += `<g ${dotsFill}>`
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!isModuleRendered(r, c) || isCorner(r, c)) continue
        const moduleX = c * moduleSize + offset
        const moduleY = r * moduleSize + offset
        fluidShapes += `<circle cx="${moduleX + radius}" cy="${moduleY + radius}" r="${radius + overlap}" />`
        if (isModuleRendered(r, c + 1)) {
          fluidShapes += `<rect x="${moduleX + radius}" y="${moduleY - overlap}" width="${moduleSize}" height="${
            moduleSize + 2 * overlap
          }" />`
        }
        if (isModuleRendered(r + 1, c)) {
          fluidShapes += `<rect x="${moduleX - overlap}" y="${moduleY + radius}" width="${
            moduleSize + 2 * overlap
          }" height="${moduleSize}" />`
        }
      }
    }
    if (dotStyle === "fluid-smooth") {
      const cornerRadius = moduleSize / 2
      const newCornerRadius = cornerRadius + overlap
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (isModuleRendered(r, c) || isCorner(r, c)) continue
          const moduleX = c * moduleSize + offset
          const moduleY = r * moduleSize + offset
          const top = isModuleRendered(r - 1, c)
          const bottom = isModuleRendered(r + 1, c)
          const left = isModuleRendered(r, c - 1)
          const right = isModuleRendered(r, c + 1)
          if (top && left && isModuleRendered(r - 1, c - 1)) {
            const cx = moduleX - overlap
            const cy = moduleY - overlap
            fluidShapes += `<path d="M ${cx},${cy + newCornerRadius} A ${newCornerRadius},${newCornerRadius} 0 0 1 ${
              cx + newCornerRadius
            },${cy} L ${cx},${cy} Z" />`
          }
          if (top && right && isModuleRendered(r - 1, c + 1)) {
            const cx = moduleX + moduleSize + overlap
            const cy = moduleY - overlap
            fluidShapes += `<path d="M ${cx},${cy + newCornerRadius} A ${newCornerRadius},${newCornerRadius} 0 0 0 ${
              cx - newCornerRadius
            },${cy} L ${cx},${cy} Z" />`
          }
          if (bottom && left && isModuleRendered(r + 1, c - 1)) {
            const cx = moduleX - overlap
            const cy = moduleY + moduleSize + overlap
            fluidShapes += `<path d="M ${cx + newCornerRadius},${cy} A ${newCornerRadius},${newCornerRadius} 0 0 1 ${cx},${
              cy - newCornerRadius
            } L ${cx},${cy} Z" />`
          }
          if (bottom && right && isModuleRendered(r + 1, c + 1)) {
            const cx = moduleX + moduleSize + overlap
            const cy = moduleY + moduleSize + overlap
            fluidShapes += `<path d="M ${cx - newCornerRadius},${cy} A ${newCornerRadius},${newCornerRadius} 0 0 0 ${cx},${
              cy - newCornerRadius
            } L ${cx},${cy} Z" />`
          }
        }
      }
    }
    fluidShapes += `</g>`
    svgContent += fluidShapes
  } else {
    let dataPath = ""
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!isModuleRendered(r, c) || isCorner(r, c)) continue
        const moduleX = c * moduleSize
        const moduleY = r * moduleSize
        const shapeType = dotsOptions.type
        const radii = { tl: 0, tr: 0, br: 0, bl: 0 }
        const radius = moduleSize / 2
        if (shapeType === "dots") radii.tl = radii.tr = radii.br = radii.bl = radius
        else if (shapeType === "rounded") radii.tl = radii.tr = radii.br = radii.bl = radius * 0.5
        else if (shapeType === "extra-rounded") radii.tl = radii.tr = radii.br = radii.bl = radius
        else if (shapeType === "classy" || shapeType === "classy-rounded") {
          const top = isModuleRendered(r - 1, c)
          const bottom = isModuleRendered(r + 1, c)
          const left = isModuleRendered(r, c - 1)
          const right = isModuleRendered(r, c + 1)
          if (shapeType === "classy") {
            if (top && left) radii.tl = radius
            if (top && right) radii.tr = radius
            if (bottom && right) radii.br = radius
            if (bottom && left) radii.bl = radius
          } else {
            if (top || left) radii.tl = radius
            if (top || right) radii.tr = radius
            if (bottom || right) radii.br = radius
            if (bottom || left) radii.bl = radius
          }
        }
        dataPath += drawRoundedRect(moduleX, moduleY, moduleSize, moduleSize, radii)
      }
    }
    svgContent += `<path d="${dataPath}" ${dotsFill} />`
  }

  // Logo
  if (image) {
    svgContent += `<image xlink:href="${image}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" />`
  }

  return `<svg width="${width}" height="${width}" viewBox="0 0 ${width} ${width}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>${defsContent}</defs>
${svgContent}
</svg>`
}
