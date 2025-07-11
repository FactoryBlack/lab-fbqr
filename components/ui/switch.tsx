"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"
import { BrutalistCheckIcon } from "./brutalist-check-icon"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "group peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center border-[var(--neo-border-width)] border-[var(--neo-text)] p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-[var(--neo-text)] data-[state=unchecked]:bg-[var(--neo-interactive-bg)]",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none flex items-center justify-center h-5 w-5 bg-[var(--neo-white)] shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-transparent data-[state=unchecked]:bg-[var(--neo-text)]",
      )}
    >
      <div className="hidden group-data-[state=checked]:block">
        <BrutalistCheckIcon className="w-8 h-8" />
      </div>
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
