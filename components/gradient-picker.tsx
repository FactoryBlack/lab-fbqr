"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BrutalistSlider } from "@/components/ui/brutalist-slider"
import { ColorInput } from "./ui/color-input"

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
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="gradient-switch" className="font-bold uppercase">
          USE GRADIENT
        </Label>
        <Checkbox id="gradient-switch" checked={isEnabled} onCheckedChange={handleToggle} />
      </div>

      {isEnabled && gradient ? (
        <div className="space-y-4">
          <div className="space-y-2">
            {gradient.colorStops.map((stop, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <Label className="text-xs font-bold whitespace-nowrap">Color {index + 1}</Label>
                <ColorInput
                  value={stop.color}
                  onChange={(e) => updateColorStop(index, e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Type</Label>
            <Select value={gradient.type} onValueChange={(v) => updateGradient("type", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear</SelectItem>
                <SelectItem value="radial">Radial</SelectItem>
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
        <div className="flex items-center justify-between gap-4">
          <Label className="text-xs font-bold">Solid Color</Label>
          <ColorInput
            value={fallbackColor}
            onChange={(e) => onFallbackColorChange(e.target.value)}
            className="w-full"
          />
        </div>
      )}
    </div>
  )
}
