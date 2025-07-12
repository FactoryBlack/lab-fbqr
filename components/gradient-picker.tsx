"use client"
import { ColorInput } from "./ui/color-input"
import { Label } from "./ui/label"
import { BrutalistXIcon } from "./ui/brutalist-status-icons"
import type { Gradient } from "@/types"

interface GradientPickerProps {
  gradient?: Gradient | null
  onGradientChange: (gradient: Gradient | null) => void
  fallbackColor: string
  onFallbackColorChange: (color: string) => void
}

export default function GradientPicker({
  gradient,
  onGradientChange,
  fallbackColor,
  onFallbackColorChange,
}: GradientPickerProps) {
  const handleColorChange = (index: number, color: string) => {
    if (!gradient) return
    const newColorStops = [...gradient.colorStops]
    newColorStops[index] = { ...newColorStops[index], color }
    onGradientChange({ ...gradient, colorStops: newColorStops })
  }

  const handleUseGradient = () => {
    onGradientChange({
      type: "linear",
      rotation: 90,
      colorStops: [
        { offset: 0, color: "#ff0000" },
        { offset: 1, color: "#0000ff" },
      ],
    })
  }

  const handleRemoveGradient = () => {
    onGradientChange(null)
  }

  if (gradient) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="font-sans font-bold uppercase text-sm">Use Gradient</Label>
          <button onClick={handleRemoveGradient} aria-label="Remove gradient">
            <BrutalistXIcon />
          </button>
        </div>
        <div className="flex gap-2">
          <ColorInput
            value={gradient.colorStops[0].color}
            onChange={(color) => handleColorChange(0, color)}
            className="flex-1"
          />
          <ColorInput
            value={gradient.colorStops[1].color}
            onChange={(color) => handleColorChange(1, color)}
            className="flex-1"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="font-sans font-bold uppercase text-sm">Solid Color</Label>
        <button onClick={handleUseGradient} className="font-sans font-bold uppercase text-sm hover:underline">
          Use Gradient
        </button>
      </div>
      <ColorInput value={fallbackColor} onChange={onFallbackColorChange} />
    </div>
  )
}
