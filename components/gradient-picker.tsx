"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BrutalistSlider } from "@/components/ui/brutalist-slider"

interface Gradient {
  type: "linear" | "radial"
  rotation: number
  colorStops: { offset: number; color: string }[]
}

interface GradientPickerProps {
  gradient: Gradient | undefined
  onGradientChange: (gradient: Gradient | undefined) => void
  fallbackColor: string
  onFallbackColorChange: (color: string) => void
}

export function GradientPicker({
  gradient,
  onGradientChange,
  fallbackColor,
  onFallbackColorChange,
}: GradientPickerProps) {
  const isEnabled = !!gradient

  const handleToggle = (checked: boolean) => {
    if (checked) {
      onGradientChange({
        type: "linear",
        rotation: 0,
        colorStops: [
          { offset: 0, color: "#000000" },
          { offset: 1, color: "#ffffff" },
        ],
      })
    } else {
      onGradientChange(undefined)
    }
  }

  const updateGradient = (key: keyof Gradient, value: any) => {
    if (gradient) {
      onGradientChange({ ...gradient, [key]: value })
    }
  }

  const updateColorStop = (index: number, color: string) => {
    if (gradient) {
      const newStops = [...gradient.colorStops]
      newStops[index] = { ...newStops[index], color }
      updateGradient("colorStops", newStops)
    }
  }

  return (
    <div className="space-y-4 border border-solid border-neo-text/50 p-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="gradient-switch" className="font-bold uppercase">
          USE GRADIENT
        </Label>
        <Switch id="gradient-switch" checked={isEnabled} onCheckedChange={handleToggle} />
      </div>

      {isEnabled && gradient ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Color 1</Label>
              <Input
                type="color"
                value={gradient.colorStops[0].color}
                onChange={(e) => updateColorStop(0, e.target.value)}
                className="h-10 neo-input"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Color 2</Label>
              <Input
                type="color"
                value={gradient.colorStops[1].color}
                onChange={(e) => updateColorStop(1, e.target.value)}
                className="h-10 neo-input"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Type</Label>
            <Select value={gradient.type} onValueChange={(v) => updateGradient("type", v)}>
              <SelectTrigger className="neo-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="select-content">
                <SelectItem className="select-item" value="linear">
                  Linear
                </SelectItem>
                <SelectItem className="select-item" value="radial">
                  Radial
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {gradient.type === "linear" && (
            <div className="space-y-2">
              <Label className="text-xs">Rotation</Label>
              <BrutalistSlider
                value={[gradient.rotation]}
                max={Math.PI * 2}
                step={0.1}
                onValueChange={(v) => updateGradient("rotation", v[0])}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <Label className="text-xs font-bold">Solid Color</Label>
          <Input
            type="color"
            value={fallbackColor}
            onChange={(e) => onFallbackColorChange(e.target.value)}
            className="h-10 neo-input"
          />
        </div>
      )}
    </div>
  )
}
