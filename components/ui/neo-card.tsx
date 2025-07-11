import * as React from "react"
import { cn } from "@/lib/utils"

interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  borderColor?: string
  shadowColor?: string
  noShadow?: boolean
}

const NeoCard = React.forwardRef<HTMLDivElement, NeoCardProps>(({ className, noShadow = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-[var(--card)] text-card-foreground border-[var(--neo-border-width)] border-[var(--neo-text)] transition-all",
      className,
    )}
    style={{
      boxShadow: noShadow ? "none" : `8px 8px 0px var(--neo-text)`,
    }}
    {...props}
  />
))
NeoCard.displayName = "NeoCard"

const NeoCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
NeoCardHeader.displayName = "NeoCardHeader"

const NeoCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
NeoCardTitle.displayName = "NeoCardTitle"

const NeoCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
NeoCardDescription.displayName = "NeoCardDescription"

const NeoCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
NeoCardContent.displayName = "NeoCardContent"

export { NeoCard, NeoCardHeader, NeoCardTitle, NeoCardDescription, NeoCardContent }
