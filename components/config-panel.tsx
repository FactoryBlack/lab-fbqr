"use client"

import React from "react"
import type { ReactElement } from "react"
import { useState } from "react"
import { ImageIcon, Settings, Droplets, Eye, Palette, Link, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { NeoButton } from "@/components/ui/neo-button"
import { BrutalistSlider } from "@/components/ui/brutalist-slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimatePresence, motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { GradientPicker } from "./gradient-picker"

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
  onLogoUpload,
  logoPreview,
  onShortenUrl,
  isShortening,
}: ConfigPanelProps): ReactElement {
  const [activeTab, setActiveTab] = useState("style")
  const fileInputRef = React.createRef<HTMLInputElement>()

  const isUrl = (str: string) => {
    // Don't show for already shortened URLs or very short URLs
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
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="text" className="font-sans font-bold text-lg uppercase">
            Content
          </Label>
          {isUrl(text) && (
            <NeoButton size="xs" variant="outline" onClick={onShortenUrl} disabled={isShortening} className="uppercase">
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
          rows={4}
        />
        {isUrl(text) && text.length > 35 && (
          <p className="text-xs text-gray-500 pt-2 font-sans">This URL is long. Shorten it for a cleaner QR code.</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="border-[var(--neo-border-width)] border-neo-text p-1 flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 bg-[var(--neo-bg)] rounded-md">
          {[
            { id: "style", icon: Settings, label: "Style" },
            { id: "logo", icon: ImageIcon, label: "Logo" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 p-2 font-bold transition-colors text-center rounded-sm font-sans uppercase ${
                activeTab === tab.id
                  ? "bg-[var(--neo-text)] text-[var(--neo-white)]"
                  : "bg-transparent text-[var(--neo-text)] hover:bg-black/10"
              }`}
            >
              {React.createElement(tab.icon, { size: 16 })}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="border-[var(--neo-border-width)] border-neo-text p-4 min-h-[250px] rounded-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "style" && (
                <Accordion type="single" collapsible className="w-full" defaultValue="corners">
                  <AccordionItem value="dots">
                    <AccordionTrigger className="font-sans uppercase">
                      <Droplets className="mr-2" /> Dots
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
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
                        fallbackColor={styleOptions.dotsOptions.color || "#000000"}
                        onFallbackColorChange={(c) => handleStyleValueChange("dotsOptions.color", c)}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="corners">
                    <AccordionTrigger className="font-sans uppercase">
                      <Eye className="mr-2" /> Corners
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6">
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
                          fallbackColor={styleOptions.cornersSquareOptions.color || "#000000"}
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
                          fallbackColor={styleOptions.cornersDotOptions?.color || "#000000"}
                          onFallbackColorChange={(c) => handleStyleValueChange("cornersDotOptions.color", c)}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="background">
                    <AccordionTrigger className="font-sans uppercase">
                      <Palette className="mr-2" /> Background
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
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
              )}
              {activeTab === "logo" && (
                <div className="space-y-6">
                  <NeoButton variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon size={16} className="mr-2" /> {logoPreview ? "Change Logo" : "Upload Logo"}
                  </NeoButton>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={onLogoUpload} className="hidden" />

                  {logoPreview && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6 overflow-hidden"
                      >
                        <div className="space-y-2">
                          <Label className="font-sans font-bold uppercase">Logo Size</Label>
                          <BrutalistSlider
                            value={[styleOptions.imageOptions.imageSize]}
                            max={0.4}
                            step={0.01}
                            onValueChange={(v) => handleStyleValueChange("imageOptions.imageSize", v[0])}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-sans font-bold uppercase">Logo Margin</Label>
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
                        <div className="flex justify-center pt-4">
                          <img
                            src={logoPreview || "/placeholder.svg"}
                            alt="Logo Preview"
                            className="w-24 h-24 object-contain border-2 border-dashed p-1"
                          />
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <NeoButton onClick={onGenerateClick} disabled={isGenerating || !text.trim()} size="lg" className="uppercase">
        {isGenerating ? "Generating..." : "Add to Collection"}
      </NeoButton>
    </div>
  )
}
