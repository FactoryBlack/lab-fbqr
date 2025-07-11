"use client"

import React from "react"
import type { ReactElement } from "react"
import { ImageIcon, Settings, Droplets, Eye, Palette, Link, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { NeoButton } from "@/components/ui/neo-button"
import { BrutalistSlider } from "@/components/ui/brutalist-slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { GradientPicker } from "./gradient-picker"
import { ScrollArea } from "./ui/scroll-area"

type Gradient = {
  type: "linear" | "radial"
  rotation: number
  colorStops: {
    offset: number
    color: string
  }[]
}

type CornerSquareType = "square" | "rounded" | "extra-rounded" | "dot" | "classy" | "classy-rounded"
type CornerDotType = "square" | "rounded" | "extra-rounded" | "dot" | "classy" | "classy-rounded" | "inherit"

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

interface ConfigPanelProps {
  text: string
  onTextChange: (value: string) => void
  styleOptions: QRStyleOptions
  onStyleChange: (newOptions: Partial<QRStyleOptions>) => void
  onGenerateClick: () => void
  isGenerating: boolean
  isLoading: boolean
  onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  logoPreview: string | null
  onShortenUrl: () => Promise<void>
  isShortening: boolean
}

export function ConfigPanel({
  text,
  onTextChange,
  styleOptions,
  onStyleChange,
  onGenerateClick,
  isGenerating,
  isLoading,
  onLogoUpload,
  logoPreview,
  onShortenUrl,
  isShortening,
}: ConfigPanelProps): ReactElement {
  const fileInputRef = React.createRef<HTMLInputElement>()

  const isUrl = (str: string) => {
    if (str.startsWith("fblk.io") || str.length < 15) return false
    try {
      new URL(str)
      return true
    } catch (_) {
      return false
    }
  }

  const handleStyleValueChange = (path: string, value: any) => {
    const newStyle = JSON.parse(JSON.stringify(styleOptions))
    const keys = path.split(".")
    let current: any = newStyle
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] = { ...current[keys[i]] }
    }
    current[keys[keys.length - 1]] = value
    const parentPath = keys.slice(0, -1).join(".")
    let parent = newStyle
    if (parentPath) {
      parent = parentPath.split(".").reduce((obj, key) => obj[key], newStyle)
    }
    if (path.endsWith(".gradient")) {
      if (value) delete parent.color
      else delete parent.gradient
    }
    if (path.endsWith(".color")) {
      if (value) delete parent.gradient
    }
    onStyleChange(newStyle)
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="text" className="font-heading text-xl">
            Content
          </Label>
          {isUrl(text) && (
            <NeoButton
              size="sm"
              onClick={onShortenUrl}
              disabled={isShortening}
              className="uppercase bg-[var(--neo-text)] text-[var(--neo-white)] hover:bg-[var(--neo-text)]/90"
            >
              {isShortening ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link size={14} className="mr-2" />}
              Shorten
            </NeoButton>
          )}
        </div>
        <Textarea
          id="text"
          placeholder="Enter URL or text"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={3}
          className="text-base"
        />
      </div>

      <ScrollArea className="flex-1 pr-4 -mr-4">
        <div className="space-y-4">
          {/* Style Section */}
          <div className="space-y-3 dashed-border-t pt-4">
            <h3 className="font-heading text-xl flex items-center gap-2">
              <Settings size={20} /> Style
            </h3>
            <Accordion type="multiple" className="w-full" defaultValue={["dots"]}>
              <AccordionItem value="dots">
                <AccordionTrigger className="text-2xl">
                  <Droplets className="mr-2" /> Dots
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label className="font-sans font-bold text-xs uppercase">Style</Label>
                    <Select
                      value={styleOptions.dotsOptions.type}
                      onValueChange={(v) => handleStyleValueChange("dotsOptions.type", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="rounded">Rounded</SelectItem>
                        <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                        <SelectItem value="classy">Classy</SelectItem>
                        <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                        <SelectItem value="dots">Dots (Circle)</SelectItem>
                        <SelectItem value="fluid">Fluid</SelectItem>
                        <SelectItem value="fluid-smooth">Fluid (Smooth)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <GradientPicker
                    gradient={styleOptions.dotsOptions.gradient}
                    onGradientChange={(g) => handleStyleValueChange("dotsOptions.gradient", g)}
                    fallbackColor={styleOptions.dotsOptions.color || "#292732"}
                    onFallbackColorChange={(c) => handleStyleValueChange("dotsOptions.color", c)}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="corners">
                <AccordionTrigger className="text-2xl">
                  <Eye className="mr-2" /> Corners
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <Label className="font-sans font-bold text-sm uppercase mb-2 block">Corner Squares</Label>
                    <Select
                      value={styleOptions.cornersSquareOptions.type || "square"}
                      onValueChange={(v) => handleStyleValueChange("cornersSquareOptions.type", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select style..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="rounded">Rounded</SelectItem>
                        <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                        <SelectItem value="dot">Dot (Circle)</SelectItem>
                        <SelectItem value="classy">Classy</SelectItem>
                        <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                      </SelectContent>
                    </Select>
                    <GradientPicker
                      gradient={styleOptions.cornersSquareOptions.gradient}
                      onGradientChange={(g) => handleStyleValueChange("cornersSquareOptions.gradient", g)}
                      fallbackColor={styleOptions.cornersSquareOptions.color || "#292732"}
                      onFallbackColorChange={(c) => handleStyleValueChange("cornersSquareOptions.color", c)}
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="font-sans font-bold text-sm uppercase mb-2 block">Corner Dots</Label>
                    <Select
                      value={styleOptions.cornersDotOptions?.type ?? "inherit"}
                      onValueChange={(v) => handleStyleValueChange("cornersDotOptions.type", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select style..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inherit">Inherit from Corner Square</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="rounded">Rounded</SelectItem>
                        <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                        <SelectItem value="dot">Dot (Circle)</SelectItem>
                        <SelectItem value="classy">Classy</SelectItem>
                        <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                      </SelectContent>
                    </Select>
                    <GradientPicker
                      gradient={styleOptions.cornersDotOptions?.gradient}
                      onGradientChange={(g) => handleStyleValueChange("cornersDotOptions.gradient", g)}
                      fallbackColor={styleOptions.cornersDotOptions?.color || "#292732"}
                      onFallbackColorChange={(c) => handleStyleValueChange("cornersDotOptions.color", c)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="background">
                <AccordionTrigger className="text-2xl">
                  <Palette className="mr-2" /> Background
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="transparent-bg"
                      checked={styleOptions.backgroundOptions.color === "transparent"}
                      onCheckedChange={(c) =>
                        handleStyleValueChange("backgroundOptions.color", c ? "transparent" : "#F5F3ED")
                      }
                    />
                    <label htmlFor="transparent-bg" className="text-sm font-bold font-sans uppercase">
                      Transparent
                    </label>
                  </div>
                  {styleOptions.backgroundOptions.color !== "transparent" && (
                    <GradientPicker
                      gradient={styleOptions.backgroundOptions.gradient}
                      onGradientChange={(g) => handleStyleValueChange("backgroundOptions.gradient", g)}
                      fallbackColor={styleOptions.backgroundOptions.color || "#F5F3ED"}
                      onFallbackColorChange={(c) => handleStyleValueChange("backgroundOptions.color", c)}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Logo Section */}
          <div className="space-y-3 dashed-border-t pt-4">
            <h3 className="font-heading text-xl flex items-center gap-2">
              <ImageIcon size={20} /> Logo
            </h3>
            <NeoButton variant="outline" onClick={() => fileInputRef.current?.click()}>
              {logoPreview ? "Change Logo" : "Upload Logo"}
            </NeoButton>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onLogoUpload} className="hidden" />

            {logoPreview && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="font-sans font-bold uppercase text-xs">Logo Size</Label>
                  <BrutalistSlider
                    value={[styleOptions.imageOptions.imageSize]}
                    max={0.4}
                    step={0.01}
                    onValueChange={(v) => handleStyleValueChange("imageOptions.imageSize", v[0])}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-sans font-bold uppercase text-xs">Logo Margin</Label>
                  <BrutalistSlider
                    value={[styleOptions.imageOptions.margin]}
                    max={40}
                    step={1}
                    onValueChange={(v) => handleStyleValueChange("imageOptions.margin", v[0])}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hide-dots"
                    checked={styleOptions.imageOptions.hideBackgroundDots}
                    onCheckedChange={(c) => handleStyleValueChange("imageOptions.hideBackgroundDots", c)}
                  />
                  <label htmlFor="hide-dots" className="text-sm font-bold font-sans uppercase">
                    Hide dots behind logo
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      <NeoButton
        onClick={onGenerateClick}
        disabled={isGenerating || !text.trim() || isLoading}
        size="lg"
        className="uppercase w-full text-lg"
      >
        {isLoading ? "Loading Collection..." : isGenerating ? "Generating..." : "Add to Collection"}
      </NeoButton>
    </div>
  )
}
