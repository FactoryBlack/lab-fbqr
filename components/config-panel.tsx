"use client"

import React from "react"
import type { ReactElement } from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { NeoButton } from "@/components/ui/neo-button"
import { BrutalistSlider } from "@/components/ui/brutalist-slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "./ui/scroll-area"
import type { ConfigPanelProps, DotsOptions, CornersSquareOptions, CornersDotOptions, BackgroundOptions } from "@/types"
import { GradientControls } from "./gradient-controls"

type StyleOptionKey = "dotsOptions" | "cornersSquareOptions" | "cornersDotOptions" | "backgroundOptions"

export default function ConfigPanel({
  text,
  onTextChange,
  styleOptions,
  onStyleChange,
  onGenerateClick,
  isGenerating,
  onLogoUpload,
  logoPreview,
  onRemoveLogo,
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
      current = current[keys[i]] = current[keys[i]] ? { ...current[keys[i]] } : {}
    }
    current[keys[keys.length - 1]] = value
    onStyleChange(newStyle)
  }

  const handleGradientOptionChange = (
    optionKey: StyleOptionKey,
    newValues: Partial<DotsOptions | CornersSquareOptions | CornersDotOptions | BackgroundOptions>,
  ) => {
    const newOptions = {
      ...styleOptions[optionKey],
      ...newValues,
    }
    onStyleChange({ ...styleOptions, [optionKey]: newOptions })
  }

  return (
    <div className="h-full flex flex-col bg-transparent">
      <div className="p-6 border-b-2 border-[#1c1c1c]">
        <div className="space-y-2">
          <h2 className="font-heading text-3xl">CONTENT</h2>
          <div className="space-y-4">
            <Textarea
              id="text"
              placeholder="https://lab.factory.black"
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              rows={3}
              className="rounded-b-none"
            />
            {isUrl(text) && (
              <NeoButton
                size="sm"
                variant="default"
                onClick={onShortenUrl}
                disabled={isShortening}
                className="uppercase rounded-t-none -mt-px"
              >
                {isShortening ? "SHORTENING..." : "SHORTEN URL"}
              </NeoButton>
            )}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Accordion type="single" className="w-full" defaultValue="dots" collapsible>
          <AccordionItem value="dots">
            <AccordionTrigger>DOTS</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="font-sans font-normal text-sm">Style</Label>
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
              <GradientControls
                label="dots"
                color={styleOptions.dotsOptions.color || "#1c1c1c"}
                onColorChange={(c) => handleGradientOptionChange("dotsOptions", { color: c })}
                useGradient={styleOptions.dotsOptions.useGradient}
                onUseGradientChange={(use) => handleGradientOptionChange("dotsOptions", { useGradient: use })}
                gradient={styleOptions.dotsOptions.gradient}
                onGradientChange={(g) => handleGradientOptionChange("dotsOptions", { gradient: g })}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="corners">
            <AccordionTrigger>CORNERS</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <div className="space-y-4">
                <Label className="font-sans font-bold text-base uppercase mb-2 block">Corner Squares</Label>
                <div className="space-y-2">
                  <Label className="font-sans font-normal text-sm">Style</Label>
                  <Select
                    value={styleOptions.cornersSquareOptions?.type || "square"}
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
                </div>
                <GradientControls
                  label="corners-square"
                  color={styleOptions.cornersSquareOptions?.color || "#1c1c1c"}
                  onColorChange={(c) => handleGradientOptionChange("cornersSquareOptions", { color: c })}
                  useGradient={styleOptions.cornersSquareOptions.useGradient}
                  onUseGradientChange={(use) =>
                    handleGradientOptionChange("cornersSquareOptions", { useGradient: use })
                  }
                  gradient={styleOptions.cornersSquareOptions.gradient}
                  onGradientChange={(g) => handleGradientOptionChange("cornersSquareOptions", { gradient: g })}
                />
              </div>
              <div className="space-y-4">
                <Label className="font-sans font-bold text-base uppercase mb-2 block">Corner Dots</Label>
                <div className="space-y-2">
                  <Label className="font-sans font-normal text-sm">Style</Label>
                  <Select
                    value={styleOptions.cornersDotOptions?.type ?? "inherit"}
                    onValueChange={(v) => handleStyleValueChange("cornersDotOptions.type", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select style..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inherit">Inherit</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                      <SelectItem value="dot">Dot (Circle)</SelectItem>
                      <SelectItem value="classy">Classy</SelectItem>
                      <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <GradientControls
                  label="corners-dot"
                  color={styleOptions.cornersDotOptions?.color || "#1c1c1c"}
                  onColorChange={(c) => handleGradientOptionChange("cornersDotOptions", { color: c })}
                  useGradient={styleOptions.cornersDotOptions.useGradient}
                  onUseGradientChange={(use) => handleGradientOptionChange("cornersDotOptions", { useGradient: use })}
                  gradient={styleOptions.cornersDotOptions.gradient}
                  onGradientChange={(g) => handleGradientOptionChange("cornersDotOptions", { gradient: g })}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="background">
            <AccordionTrigger>BACKGROUND</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="transparent-bg"
                  checked={styleOptions.backgroundOptions.color === "transparent"}
                  onCheckedChange={(c) =>
                    handleStyleValueChange("backgroundOptions.color", c ? "transparent" : "#e0e0e0")
                  }
                />
                <label htmlFor="transparent-bg" className="text-base font-bold font-sans uppercase">
                  Transparent
                </label>
              </div>
              {styleOptions.backgroundOptions.color !== "transparent" && (
                <GradientControls
                  label="background"
                  color={styleOptions.backgroundOptions.color || "#e0e0e0"}
                  onColorChange={(c) => handleGradientOptionChange("backgroundOptions", { color: c })}
                  useGradient={styleOptions.backgroundOptions.useGradient}
                  onUseGradientChange={(use) => handleGradientOptionChange("backgroundOptions", { useGradient: use })}
                  gradient={styleOptions.backgroundOptions.gradient}
                  onGradientChange={(g) => handleGradientOptionChange("backgroundOptions", { gradient: g })}
                />
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="logo" className="border-b-0">
            <AccordionTrigger>LOGO</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {logoPreview ? (
                <NeoButton variant="destructive" onClick={onRemoveLogo}>
                  REMOVE LOGO
                </NeoButton>
              ) : (
                <NeoButton variant="secondary" onClick={() => fileInputRef.current?.click()}>
                  UPLOAD LOGO
                </NeoButton>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={onLogoUpload} className="hidden" />

              {logoPreview && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label className="font-sans font-bold uppercase text-sm">Logo Size</Label>
                    <BrutalistSlider
                      value={[styleOptions.imageOptions.imageSize]}
                      max={0.4}
                      step={0.01}
                      onValueChange={(v) => handleStyleValueChange("imageOptions.imageSize", v[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-sans font-bold uppercase text-sm">Logo Margin</Label>
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
                    <label htmlFor="hide-dots" className="text-base font-bold font-sans uppercase">
                      Hide dots behind logo
                    </label>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>

      <div className="mt-auto p-6 border-t-2 border-[#1c1c1c]">
        <NeoButton
          onClick={onGenerateClick}
          disabled={isGenerating || !text.trim()}
          size="lg"
          className="uppercase w-full"
        >
          {isGenerating ? "GENERATING..." : "ADD TO COLLECTION"}
        </NeoButton>
      </div>
    </div>
  )
}
