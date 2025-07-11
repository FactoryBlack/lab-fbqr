"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"
import { AnimatedCheckCross } from "./animated-check-cross"
import { motion } from "framer-motion"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, checked, ...props }, ref) => (
  <SwitchPrimitives.Root
    checked={checked}
    className={cn(
      "group peer inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-[var(--neo-border-width)] border-[var(--neo-text)] p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-[var(--neo-muted-bg)] data-[state=unchecked]:bg-[var(--neo-text)]",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb asChild>
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className={cn(
          "pointer-events-none flex items-center justify-center h-7 w-7 rounded-full bg-transparent ring-0",
        )}
      >
        <AnimatedCheckCross state={checked ? "checked" : "unchecked"} className="w-full h-full" />
      </motion.div>
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
