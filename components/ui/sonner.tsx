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
      unstyled
      toastOptions={{
        classNames: {
          toast:
            "group font-sans text-[var(--neo-text)] border-2 border-[var(--neo-text)] shadow-[4px_4px_0px_var(--neo-text)] rounded-none p-4 w-full flex justify-between items-center " +
            "data-[type=default]:bg-[var(--neo-bg)] " +
            "data-[type=success]:bg-[var(--neo-accent)] " +
            "data-[type=error]:bg-[hsl(var(--neo-destructive-accent))]",
          title: "font-bold uppercase text-base",
          description: "text-sm opacity-80",
          closeButton: "border-0 bg-transparent hover:bg-black/10",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
