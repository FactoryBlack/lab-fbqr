"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface ColorInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
  value: string
  onChange: (color: string) => void
}

const isValidHex = (color: string) => /^#[0-9A-F]{6}$/i.test(color)

export const ColorInput = React.forwardRef<HTMLInputElement, ColorInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [textValue, setTextValue] = useState(value)

    useEffect(() => {
      if (value.toUpperCase() !== textValue.toUpperCase()) {
        setTextValue(value.toUpperCase())
      }
    }, [value])

    const handleColorPickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = event.target.value.toUpperCase()
      setTextValue(newColor)
      if (onChange) {
        onChange(newColor)
      }
    }

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newText = event.target.value.toUpperCase()
      setTextValue(newText)
      if (isValidHex(newText) && onChange) {
        onChange(newText)
      }
    }

    return (
      <div className={cn("flex items-center gap-2 w-full", className)}>
        <div className="relative h-11 w-14 shrink-0 group">
          <div
            className="w-full h-full border-2 border-black transition-all shadow-[4px_4px_0px_#000] group-hover:shadow-[2px_2px_0px_#000] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-active:shadow-none group-active:translate-x-[4px] group-active:translate-y-[4px]"
            style={{ backgroundColor: isValidHex(value) ? value : "#ffffff" }}
          />
          <input
            type="color"
            ref={ref}
            value={isValidHex(value) ? value : "#000000"}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleColorPickerChange}
            {...props}
          />
        </div>
        <Input
          type="text"
          value={textValue}
          onChange={handleTextChange}
          className="uppercase flex-1 min-w-0"
          maxLength={7}
        />
      </div>
    )
  },
)
ColorInput.displayName = "ColorInput"
