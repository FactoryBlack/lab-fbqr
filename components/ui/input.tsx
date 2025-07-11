import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full bg-[var(--neo-interactive-bg)] px-3 py-2 text-base file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-sans border-[var(--neo-border-width)] border-neo-text",
        className,
      )}
      style={{ boxShadow: `8px 8px 0px var(--neo-text)` }}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
