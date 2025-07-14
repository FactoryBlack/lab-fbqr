import { cn } from "@/lib/utils"

export function VerticalDivider({ className }: { className?: string }) {
  return <div className={cn("w-[2px] bg-black h-full", className)} />
}
