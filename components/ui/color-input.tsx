"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

interface ColorInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  onChange?: (color: string) => void
}

export const ColorInput = React.forwardRef<HTMLInputElement, ColorInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event.target.value)
      }
    }

    return (
      <div className={cn("relative w-full h-11 group", className)}>
        {/* This is the visual representation of the color swatch */}
        <div
          className="w-full h-full border-[var(--neo-border-width)] border-neo-text transition-all shadow-[4px_4px_0px_var(--neo-text)] group-hover:shadow-[2px_2px_0px_var(--neo-text)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-active:shadow-none group-active:translate-x-[4px] group-active:translate-y-[4px]"
          style={{ backgroundColor: value as string }}
        />
        {/* The actual color input is overlaid, transparent, and handles the click */}
        <input
          type="color"
          ref={ref}
          value={value}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          {...props}
        />
      </div>
    )
  },
)
ColorInput.displayName = "ColorInput"
