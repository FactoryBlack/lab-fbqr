"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const neoButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-base font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full border-2 border-black font-sans",
  {
    variants: {
      variant: {
        default: "bg-[var(--neo-accent)] text-black hover:bg-[var(--neo-accent)]/90",
        destructive:
          "bg-[hsl(var(--neo-destructive-accent))] text-black hover:bg-[hsl(var(--neo-destructive-accent),0.9)]",
        outline: "bg-transparent hover:bg-black/5",
        secondary: "bg-[var(--neo-interactive-bg)] text-black hover:bg-[var(--neo-bg)]",
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
    const hasShadow = !noShadow && variant !== "ghost" && variant !== "link"

    return (
      <Comp
        className={cn(
          neoButtonVariants({ variant, size, className }),
          hasShadow &&
            "shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
NeoButton.displayName = "NeoButton"

export { NeoButton, neoButtonVariants }
