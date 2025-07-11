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

// --- SVG Generation Logic ---

async function generateSvg(config: any): Promise<string> {
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

  return renderSvg(qr, {
    width,
    dotsOptions,
    cornersSquareOptions,
    cornersDotOptions,
    backgroundOptions,
    image,
    imageOptions,
  })
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

  const addGradient = (id: string, gradient: any) => {
    if (!gradient) return ""
    const gradientId = `grad-${id}`
    if (gradient.type === "linear") {
      defsContent += `<linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${
        (gradient.rotation * 180) / Math.PI
      })">`
      gradient.colorStops.forEach((stop: any) => {
        defsContent += `<stop offset="${stop.offset * 100}%" stop-color="${stop.color}"/>`
      })
      defsContent += `</linearGradient>`
    } else {
      // Radial
      defsContent += `<radialGradient id="${gradientId}">`
      gradient.colorStops.forEach((stop: any) => {
        defsContent += `<stop offset="${stop.offset * 100}%" stop-color="${stop.color}"/>`
      })
      defsContent += `</radialGradient>`
    }
    return `fill="url(#${gradientId})"`
  }

  const dotsFill = dotsOptions.gradient ? addGradient("dots", dotsOptions.gradient) : `fill="${dotsOptions.color}"`
  const cornersSquareFill = cornersSquareOptions?.gradient
    ? addGradient("cs", cornersSquareOptions.gradient)
    : `fill="${cornersSquareOptions?.color || dotsOptions.color}"`
  const cornersDotFill = cornersDotOptions?.gradient
    ? addGradient("cd", cornersDotOptions.gradient)
    : `fill="${cornersDotOptions?.color || cornersSquareOptions?.color || dotsOptions.color}"`

  let svgContent = ""

  // Background
  if (backgroundOptions.color !== "transparent") {
    const bgFill = backgroundOptions.gradient
      ? addGradient("bg", backgroundOptions.gradient)
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
    return `M${newX + r.tl},${newY} H${newX + w - r.tr} A${r.tr},${r.tr} 0 0 1 ${newX + w},${newY + r.tr} V${newY + h - r.br} A${r.br},${r.br} 0 0 1 ${newX + w - r.br},${newY + h} H${newX + r.bl} A${r.bl},${r.bl} 0 0 1 ${newX},${newY + h - r.bl} V${newY + r.tl} A${r.tl},${r.tl} 0 0 1 ${newX + r.tl},${newY} Z`
  }

  const cornerPositions = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ]

  const isCorner = (r: number, c: number) => {
    return cornerPositions.some(([pr, pc]) => r >= pr && r < pr + 7 && c >= pc && c < pc + 7)
  }

  const getNeighbor = (r: number, c: number) => {
    if (r < 0 || r >= size || c < 0 || c >= size) return false
    return qr.modules.get(r, c)
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

  // Draw corner elements
  cornerPositions.forEach(([pr, pc]) => {
    const csType = cornersSquareOptions?.type || "square"
    let cdType = cornersDotOptions?.type ?? "inherit"
    if (cdType === "inherit") {
      cdType = csType
    }

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
      if (isTopLeft) {
        csRadii.tl = 2 * moduleSize
        csRadii.tr = 2 * moduleSize
        csRadii.bl = 2 * moduleSize
      }
      if (isTopRight) {
        csRadii.tl = 2 * moduleSize
        csRadii.tr = 2 * moduleSize
        csRadii.br = 2 * moduleSize
      }
      if (isBottomLeft) {
        csRadii.tl = 2 * moduleSize
        csRadii.bl = 2 * moduleSize
        csRadii.br = 2 * moduleSize
      }
    }

    const outerPath = drawRoundedRect(pc * moduleSize, pr * moduleSize, 7 * moduleSize, 7 * moduleSize, csRadii)
    const innerPath = drawRoundedRect((pc + 1) * moduleSize, (pr + 1) * moduleSize, 5 * moduleSize, 5 * moduleSize, {
      tl: Math.max(0, csRadii.tl - moduleSize),
      tr: Math.max(0, csRadii.tr - moduleSize),
      br: Math.max(0, csRadii.br - moduleSize),
      bl: Math.max(0, csRadii.bl - moduleSize),
    })
    svgContent += `<path d="${outerPath} ${innerPath}" ${cornersSquareFill} fill-rule="evenodd" />`

    const cdRadii = { tl: 0, tr: 0, br: 0, bl: 0 }
    if (cdType === "dot") cdRadii.tl = cdRadii.tr = cdRadii.br = cdRadii.bl = 1.5 * moduleSize
    else if (cdType === "rounded") cdRadii.tl = cdRadii.tr = cdRadii.br = cdRadii.bl = 0.75 * moduleSize
    else if (cdType === "extra-rounded") cdRadii.tl = cdRadii.tr = cdRadii.br = cdRadii.bl = 1.25 * moduleSize
    else if (cdType === "classy") {
      if (isTopLeft) cdRadii.tl = 0.75 * moduleSize
      if (isTopRight) cdRadii.tr = 0.75 * moduleSize
      if (isBottomLeft) cdRadii.bl = 0.75 * moduleSize
    } else if (cdType === "classy-rounded") {
      if (isTopLeft) {
        cdRadii.tl = 0.75 * moduleSize
        cdRadii.tr = 0.75 * moduleSize
        cdRadii.bl = 0.75 * moduleSize
      }
      if (isTopRight) {
        cdRadii.tl = 0.75 * moduleSize
        cdRadii.tr = 0.75 * moduleSize
        cdRadii.br = 0.75 * moduleSize
      }
      if (isBottomLeft) {
        cdRadii.tl = 0.75 * moduleSize
        cdRadii.bl = 0.75 * moduleSize
        cdRadii.br = 0.75 * moduleSize
      }
    }
    svgContent += `<path d="${drawRoundedRect((pc + 2) * moduleSize, (pr + 2) * moduleSize, 3 * moduleSize, 3 * moduleSize, cdRadii)}" ${cornersDotFill} />`
  })

  // Draw data modules
  const dotStyle = dotsOptions.type
  if (dotStyle === "fluid" || dotStyle === "fluid-smooth") {
    let fluidShapes = ""
    const radius = moduleSize / 2

    fluidShapes += `<g ${dotsFill}>`

    // Draw base circles and connectors
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!qr.modules.get(r, c) || isCorner(r, c)) continue

        const moduleX = c * moduleSize + offset
        const moduleY = r * moduleSize + offset

        if (image && imageOptions?.hideBackgroundDots) {
          if (
            moduleX + moduleSize > logoBox.x1 &&
            moduleX < logoBox.x2 &&
            moduleY + moduleSize > logoBox.y1 &&
            moduleY < logoBox.y2
          )
            continue
        }

        // Draw the circle for the module
        fluidShapes += `<circle cx="${moduleX + radius}" cy="${moduleY + radius}" r="${radius}" />`

        // Draw connector to the right
        if (getNeighbor(r, c + 1) && !isCorner(r, c + 1)) {
          fluidShapes += `<rect x="${moduleX + radius}" y="${moduleY}" width="${moduleSize}" height="${moduleSize}" />`
        }
        // Draw connector to the bottom
        if (getNeighbor(r + 1, c) && !isCorner(r + 1, c)) {
          fluidShapes += `<rect x="${moduleX}" y="${moduleY + radius}" width="${moduleSize}" height="${moduleSize}" />`
        }
      }
    }

    // Add concave corners for 'fluid-smooth'
    if (dotStyle === "fluid-smooth") {
      const cornerRadius = moduleSize / 2
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (qr.modules.get(r, c)) continue // We are looking for empty spaces

          const moduleX = c * moduleSize + offset
          const moduleY = r * moduleSize + offset

          if (image && imageOptions?.hideBackgroundDots) {
            if (
              moduleX + moduleSize > logoBox.x1 &&
              moduleX < logoBox.x2 &&
              moduleY + moduleSize > logoBox.y1 &&
              moduleY < logoBox.y2
            )
              continue
          }

          if (isCorner(r, c)) continue

          // Stricter check for inner corners.
          // An inner corner is an empty space surrounded by 3 filled neighbors in a 2x2 block.
          const top = getNeighbor(r - 1, c)
          const bottom = getNeighbor(r + 1, c)
          const left = getNeighbor(r, c - 1)
          const right = getNeighbor(r, c + 1)

          // Bottom-right corner of the empty cell (top-left of the filled block)
          if (top && left && getNeighbor(r - 1, c - 1)) {
            const cx = moduleX
            const cy = moduleY
            fluidShapes += `<path d="M ${cx},${cy + cornerRadius} A ${cornerRadius},${cornerRadius} 0 0 1 ${cx + cornerRadius},${cy} L ${cx},${cy} Z" />`
          }
          // Bottom-left corner of the empty cell (top-right of the filled block)
          if (top && right && getNeighbor(r - 1, c + 1)) {
            const cx = moduleX + moduleSize
            const cy = moduleY
            fluidShapes += `<path d="M ${cx},${cy + cornerRadius} A ${cornerRadius},${cornerRadius} 0 0 0 ${cx - cornerRadius},${cy} L ${cx},${cy} Z" />`
          }
          // Top-right corner of the empty cell (bottom-left of the filled block)
          if (bottom && left && getNeighbor(r + 1, c - 1)) {
            const cx = moduleX
            const cy = moduleY + moduleSize
            fluidShapes += `<path d="M ${cx + cornerRadius},${cy} A ${cornerRadius},${cornerRadius} 0 0 1 ${cx},${cy - cornerRadius} L ${cx},${cy} Z" />`
          }
          // Top-left corner of the empty cell (bottom-right of the filled block)
          if (bottom && right && getNeighbor(r + 1, c + 1)) {
            const cx = moduleX + moduleSize
            const cy = moduleY + moduleSize
            fluidShapes += `<path d="M ${cx - cornerRadius},${cy} A ${cornerRadius},${cornerRadius} 0 0 0 ${cx},${cy - cornerRadius} L ${cx},${cy} Z" />`
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
        if (!qr.modules.get(r, c) || isCorner(r, c)) continue

        const moduleX = c * moduleSize
        const moduleY = r * moduleSize

        if (image && imageOptions?.hideBackgroundDots) {
          const absoluteModuleX = moduleX + offset
          const absoluteModuleY = moduleY + offset
          if (
            absoluteModuleX + moduleSize > logoBox.x1 &&
            absoluteModuleX < logoBox.x2 &&
            absoluteModuleY + moduleSize > logoBox.y1 &&
            absoluteModuleY < logoBox.y2
          )
            continue
        }

        const shapeType = dotsOptions.type
        const radii = { tl: 0, tr: 0, br: 0, bl: 0 }
        const radius = moduleSize / 2

        if (shapeType === "dots") radii.tl = radii.tr = radii.br = radii.bl = radius
        else if (shapeType === "rounded") radii.tl = radii.tr = radii.br = radii.bl = radius * 0.5
        else if (shapeType === "extra-rounded") radii.tl = radii.tr = radii.br = radii.bl = radius
        else if (shapeType === "classy" || shapeType === "classy-rounded") {
          const top = getNeighbor(r - 1, c)
          const bottom = getNeighbor(r + 1, c)
          const left = getNeighbor(r, c - 1)
          const right = getNeighbor(r, c + 1)

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
