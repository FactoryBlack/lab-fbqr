"use client"

import type React from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans text-[var(--neo-text)] border-2 border-[var(--neo-text)] shadow-[4px_4px_0px_var(--neo-text)] rounded-none p-4 w-full",
          default: "bg-[var(--neo-bg)]",
          success: "bg-[var(--neo-accent)]",
          error: "bg-[hsl(var(--neo-destructive-accent))]",
          info: "bg-[var(--neo-muted-bg)]",
          warning: "bg-[hsl(var(--neo-destructive-accent))]",
          title: "font-bold uppercase text-base",
          description: "text-sm opacity-80",
          actionButton:
            "group-[.toast]:bg-[var(--neo-accent)] group-[.toast]:text-[var(--neo-text)] group-[.toast]:border-2 group-[.toast]:border-[var(--neo-text)]",
          cancelButton:
            "group-[.toast]:bg-[var(--neo-muted-bg)] group-[.toast]:text-[var(--neo-text)] group-[.toast]:border-2 group-[.toast]:border-[var(--neo-text)]",
          closeButton: "border-0 bg-transparent hover:bg-black/10 !right-2 !top-2",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
