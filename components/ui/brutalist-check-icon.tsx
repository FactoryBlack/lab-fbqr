import { cn } from "@/lib/utils"

export const BrutalistCheckIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    className={cn("drop-shadow-[2px_2px_0px_var(--neo-text)]", className)}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="16" cy="16" r="14" fill="var(--neo-accent)" stroke="var(--neo-text)" strokeWidth="2" />
    <path
      d="M9 16l5 5 9-9"
      stroke="var(--neo-text)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)
