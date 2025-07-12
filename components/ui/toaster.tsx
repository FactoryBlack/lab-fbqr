"use client"

import type React from "react"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-[hsl(var(--neo-bg))] group-[.toaster]:text-[hsl(var(--neo-text))] group-[.toaster]:border-2 group-[.toaster]:border-[hsl(var(--neo-text))] group-[.toaster]:shadow-[4px_4px_0px_hsl(var(--neo-text))] group-[.toaster]:rounded-md",
          description: "group-[.toast]:text-[hsl(var(--neo-text))]",
          actionButton: "group-[.toast]:bg-[hsl(var(--neo-accent))] group-[.toast]:text-[hsl(var(--neo-text))]",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
