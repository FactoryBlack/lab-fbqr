"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const neoButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full rounded-md",
  {
    variants: {
      variant: {
        default: "bg-[var(--neo-accent)] text-[var(--neo-white)] border-[var(--neo-border-width)] border-neo-text",
        destructive: "border-[var(--neo-border-width)] border-neo-text bg-transparent hover:bg-[var(--neo-white)]",
        outline: "border-[var(--neo-border-width)] border-neo-text bg-transparent hover:bg-[var(--neo-white)]",
        secondary: "bg-secondary text-secondary-foreground border-[var(--neo-border-width)] border-neo-text",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
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
}

const NeoButton = React.forwardRef<HTMLButtonElement, NeoButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(neoButtonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
NeoButton.displayName = "NeoButton"

export { NeoButton, neoButtonVariants }
