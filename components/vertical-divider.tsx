"use client"

import { cn } from "@/lib/utils"

export function VerticalDivider({ className }: { className?: string }) {
  return <div className={cn("h-full w-px bg-[var(--neo-text)]", className)} />
}
