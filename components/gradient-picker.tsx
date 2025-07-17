"use client"
import { ColorInput } from "./ui/color-input"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import type { Gradient } from "@/types"
import { AnimatePresence, motion } from "framer-motion"

interface GradientPickerProps {
  gradient?: Gradient | null
  onGradientChange: (gradient: Gradient | null) => void
  fallbackColor: string
  onFallbackColorChange: (color: string) => void
  label: string
}

export default function GradientPicker({
  gradient,
  onGradientChange,
  fallbackColor,
  onFallbackColorChange,
  label,
}: GradientPickerProps) {
  const isUsingGradient = !!gradient

  const handleColorChange = (index: number, color: string) => {
    if (!gradient) return
    const newColorStops = [...gradient.colorStops]
    newColorStops[index] = { ...newColorStops[index], color }
    onGradientChange({ ...gradient, colorStops: newColorStops })
  }

  const handleCheckedChange = (checked: boolean) => {
    if (checked) {
      onGradientChange({
        type: "linear",
        rotation: 90,
        colorStops: [
          { offset: 0, color: "#FF0000" },
          { offset: 1, color: "#0000FF" },
        ],
      })
    } else {
      onGradientChange(null)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox id={`gradient-toggle-${label}`} checked={isUsingGradient} onCheckedChange={handleCheckedChange} />
        <Label htmlFor={`gradient-toggle-${label}`} className="text-base font-bold font-sans uppercase">
          Use Gradient
        </Label>
      </div>
      <AnimatePresence mode="wait">
        {isUsingGradient && gradient ? (
          <motion.div
            key="gradient-inputs"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-2 pt-2">
              <ColorInput value={gradient.colorStops[0].color} onChange={(color) => handleColorChange(0, color)} />
              <ColorInput value={gradient.colorStops[1].color} onChange={(color) => handleColorChange(1, color)} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="solid-input"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="pt-2">
              <ColorInput value={fallbackColor} onChange={onFallbackColorChange} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
