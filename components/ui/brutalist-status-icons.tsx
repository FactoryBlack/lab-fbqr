import { cn } from "@/lib/utils"

export const BrutalistCheckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M5 13l4 4L19 7" stroke="var(--neo-text)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const BrutalistXIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M18 6L6 18" stroke="var(--neo-text)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 6l12 12" stroke="var(--neo-text)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const BrutalistWarningIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M12 8V12M12 16H12.01"
      stroke="var(--neo-text)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const BrutalistLoaderIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("animate-spin", className)}>
    <path
      d="M12 2.5C17.2467 2.5 21.5 6.75329 21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 9.52261 3.42364 7.27439 4.98609 5.5"
      stroke="var(--neo-text)"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
)
