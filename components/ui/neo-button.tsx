"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const neoButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-base font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full border-[var(--neo-border-width)] border-neo-text active:translate-x-px active:translate-y-px active:shadow-none font-sans",
  {
    variants: {
      variant: {
        default: "bg-[var(--neo-accent)] text-[var(--neo-text)] hover:bg-[var(--neo-accent)]/90",
        destructive:
          "bg-[var(--neo-destructive-accent)] text-[var(--neo-text)] hover:bg-[var(--neo-destructive-accent)]/90",
        outline: "bg-transparent hover:bg-[var(--neo-white)]",
        secondary: "bg-[var(--neo-muted-bg)] text-[var(--neo-text)] hover:bg-[var(--neo-muted-bg)]/90",
        ghost: "border-0 shadow-none hover:bg-accent hover:text-accent-foreground",
        link: "border-0 shadow-none text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-10 px-3 text-sm",
        lg: "h-12 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface NeoButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neoButtonVariants> {
  asChild?: boolean
  noShadow?: boolean
}

const NeoButton = React.forwardRef<HTMLButtonElement, NeoButtonProps>(
  ({ className, variant, size, asChild = false, noShadow = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(neoButtonVariants({ variant, size, className }))}
        style={{
          boxShadow: noShadow || variant === "ghost" || variant === "link" ? "none" : `4px 4px 0px var(--neo-text)`,
        }}
        ref={ref}
        {...props}
      />
    )
  },
)
NeoButton.displayName = "NeoButton"

export { NeoButton, neoButtonVariants }
