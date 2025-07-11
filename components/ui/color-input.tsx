"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

interface ColorInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

export const ColorInput = React.forwardRef<HTMLInputElement, ColorInputProps>(({ className, value, ...props }, ref) => {
  const internalRef = React.useRef<HTMLInputElement>(null)

  const handleClick = () => {
    internalRef.current?.click()
  }

  return (
    <div className={cn("relative w-full h-11", className)}>
      <button
        type="button"
        onClick={handleClick}
        className="w-full h-full border-[var(--neo-border-width)] border-neo-text transition-all shadow-[4px_4px_0px_var(--neo-text)] hover:shadow-[2px_2px_0px_var(--neo-text)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
        style={{ backgroundColor: value as string }}
      />
      <input type="color" ref={ref || internalRef} value={value} className="absolute w-0 h-0 opacity-0" {...props} />
    </div>
  )
})
ColorInput.displayName = "ColorInput"
