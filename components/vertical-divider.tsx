"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface VerticalDividerProps {
  children: React.ReactNode
  className?: string
}

export function VerticalDivider({ children, className }: VerticalDividerProps) {
  return (
    <div className={cn("h-full flex flex-col items-center justify-center relative hidden md:flex", className)}>
      <div className="absolute h-full w-px bg-black/10" />
      <div
        className="text-sm font-bold uppercase text-center font-mono"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        {children}
      </div>
    </div>
  )
}
