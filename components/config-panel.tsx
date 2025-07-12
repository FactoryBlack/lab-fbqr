"use client"

import type React from "react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ColorInput } from "@/components/ui/color-input"
import { GradientPicker } from "@/components/gradient-picker"
import { NeoButton } from "@/components/ui/neo-button"
import { BrutalistSlider } from "@/components/ui/brutalist-slider"
import type { QRStyleOptions } from "@/types"
import { ScrollArea } from "./ui/scroll-area"
import { Loader2 } from "lucide-react"

interface ConfigPanelProps {
  text: string
  onTextChange: (text: string) => void
  styleOptions: QRStyleOptions
  onStyleChange: (options: Partial<QRStyleOptions>) => void
  onGenerateClick: () => void
  isGenerating: boolean
  onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  logoPreview: string | null
  onRemoveLogo: () => void
  onShortenUrl: () => void
  isShortening: boolean
}

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
}: ConfigPanelProps) {
  const handleDotsColorChange = (color: string) => {
    onStyleChange({ dotsOptions: { ...styleOptions.dotsOptions, color } })
  }

  const handleDotsTypeChange = (type: string) => {
    onStyleChange({ dotsOptions: { ...styleOptions.dotsOptions, type } })
  }

  const handleCornersSquareColorChange = (color: string) => {
    onStyleChange({ cornersSquareOptions: { ...styleOptions.cornersSquareOptions, color } })
  }

  const handleCornersSquareTypeChange = (type: string) => {
    onStyleChange({ cornersSquareOptions: { ...styleOptions.cornersSquareOptions, type } })
  }

  const handleCornersDotColorChange = (color: string) => {
    onStyleChange({ cornersDotOptions: { ...styleOptions.cornersDotOptions, color } })
  }

  const handleCornersDotTypeChange = (type: string) => {
    onStyleChange({ cornersDotOptions: { ...styleOptions.cornersDotOptions, type } })
  }

  const handleBackgroundColorChange = (color: string) => {
    onStyleChange({ backgroundOptions: { ...styleOptions.backgroundOptions, color } })
  }

  const handleGradientChange = (colors: [string, string], rotation: number) => {
    onStyleChange({
      dotsOptions: {
        ...styleOptions.dotsOptions,
        gradient: {
          type: "linear",
          colorStops: [
            { offset: 0, color: colors[0] },
            { offset: 1, color: colors[1] },
          ],
          rotation,
        },
      },
    })
  }

  const handleRemoveGradient = () => {
    const { gradient, ...rest } = styleOptions.dotsOptions
    onStyleChange({ dotsOptions: rest })
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <Accordion type="multiple" defaultValue={["content", "style"]} className="w-full">
            <AccordionItem value="content">
              <AccordionTrigger>CONTENT</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Your content here"
                    value={text}
                    onChange={(e) => onTextChange(e.target.value)}
                    rows={4}
                  />
                  <NeoButton onClick={onShortenUrl} disabled={isShortening}>
                    {isShortening ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        SHORTENING...
                      </>
                    ) : (
                      "SHORTEN URL"
                    )}
                  </NeoButton>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="style">
              <AccordionTrigger>STYLE</AccordionTrigger>
              <AccordionContent>
                <Accordion type="multiple" className="w-full space-y-2">
                  <AccordionItem value="dots">
                    <AccordionTrigger isNested>DOTS</AccordionTrigger>
                    <AccordionContent isNested>
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label>Style</Label>
                          <Select value={styleOptions.dotsOptions.type} onValueChange={handleDotsTypeChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select dot style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="square">Square</SelectItem>
                              <SelectItem value="dots">Dots</SelectItem>
                              <SelectItem value="rounded">Rounded</SelectItem>
                              <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                              <SelectItem value="classy">Classy</SelectItem>
                              <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Color</Label>
                          <ColorInput
                            value={styleOptions.dotsOptions.color || "#000000"}
                            onChange={handleDotsColorChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Gradient</Label>
                          <GradientPicker
                            onGradientChange={handleGradientChange}
                            onRemoveGradient={handleRemoveGradient}
                            initialGradient={styleOptions.dotsOptions.gradient}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="corners">
                    <AccordionTrigger isNested>CORNERS</AccordionTrigger>
                    <AccordionContent isNested>
                      <div className="space-y-4 pt-2">
                        <h4 className="font-bold text-sm">Corner Squares</h4>
                        <div className="space-y-2">
                          <Label>Style</Label>
                          <Select
                            value={styleOptions.cornersSquareOptions?.type}
                            onValueChange={handleCornersSquareTypeChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select corner style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="square">Square</SelectItem>
                              <SelectItem value="dot">Dot</SelectItem>
                              <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Color</Label>
                          <ColorInput
                            value={styleOptions.cornersSquareOptions?.color || "#000000"}
                            onChange={handleCornersSquareColorChange}
                          />
                        </div>
                        <h4 className="font-bold text-sm mt-4">Corner Dots</h4>
                        <div className="space-y-2">
                          <Label>Style</Label>
                          <Select
                            value={styleOptions.cornersDotOptions?.type}
                            onValueChange={handleCornersDotTypeChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select corner dot style" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="inherit">Inherit</SelectItem>
                              <SelectItem value="square">Square</SelectItem>
                              <SelectItem value="dot">Dot</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Color</Label>
                          <ColorInput
                            value={styleOptions.cornersDotOptions?.color || "#000000"}
                            onChange={handleCornersDotColorChange}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="background">
                    <AccordionTrigger isNested>BACKGROUND</AccordionTrigger>
                    <AccordionContent isNested>
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label>Color</Label>
                          <ColorInput
                            value={styleOptions.backgroundOptions?.color || "#ffffff"}
                            onChange={handleBackgroundColorChange}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="logo">
                    <AccordionTrigger isNested>LOGO</AccordionTrigger>
                    <AccordionContent isNested>
                      <div className="space-y-4 pt-2">
                        {logoPreview ? (
                          <div className="space-y-4">
                            <div className="relative aspect-square w-full bg-neo-interactive-bg border-2 border-neo-text p-2">
                              <img
                                src={logoPreview || "/placeholder.svg"}
                                alt="Logo preview"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <NeoButton variant="destructive" onClick={onRemoveLogo}>
                              REMOVE LOGO
                            </NeoButton>
                          </div>
                        ) : (
                          <label className="w-full cursor-pointer">
                            <NeoButton variant="secondary" asChild>
                              <span>UPLOAD LOGO</span>
                            </NeoButton>
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/svg+xml"
                              className="hidden"
                              onChange={onLogoUpload}
                            />
                          </label>
                        )}
                        <div className="items-center flex space-x-2">
                          <Checkbox
                            id="hideBackgroundDots"
                            checked={styleOptions.imageOptions?.hideBackgroundDots}
                            onCheckedChange={(checked) =>
                              onStyleChange({
                                imageOptions: { ...styleOptions.imageOptions, hideBackgroundDots: !!checked },
                              })
                            }
                          />
                          <Label htmlFor="hideBackgroundDots" className="text-sm font-medium">
                            Hide background dots
                          </Label>
                        </div>
                        <div className="space-y-2">
                          <Label>Logo Size</Label>
                          <BrutalistSlider
                            value={[styleOptions.imageOptions?.imageSize || 0.4]}
                            onValueChange={([value]) =>
                              onStyleChange({
                                imageOptions: { ...styleOptions.imageOptions, imageSize: value },
                              })
                            }
                            max={1}
                            step={0.05}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Logo Margin</Label>
                          <BrutalistSlider
                            value={[styleOptions.imageOptions?.margin || 0]}
                            onValueChange={([value]) =>
                              onStyleChange({
                                imageOptions: { ...styleOptions.imageOptions, margin: value },
                              })
                            }
                            max={20}
                            step={1}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
      <div className="p-6 border-t-[var(--neo-border-width)] border-t-[var(--neo-text)]">
        <NeoButton onClick={onGenerateClick} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              SAVING...
            </>
          ) : (
            "ADD TO COLLECTION"
          )}
        </NeoButton>
      </div>
    </div>
  )
}
