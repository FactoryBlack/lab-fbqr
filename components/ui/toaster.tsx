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
            "group toast group-[.toaster]:bg-neo-bg group-[.toaster]:text-neo-text group-[.toaster]:border-2 group-[.toaster]:border-neo-text group-[.toaster]:shadow-[4px_4px_0px_var(--neo-text)]",
          description: "group-[.toast]:text-neo-text/80",
          actionButton:
            "group-[.toast]:bg-neo-accent group-[.toast]:text-neo-text group-[.toast]:border-2 group-[.toast]:border-neo-text group-[.toast]:shadow-[2px_2px_0px_var(--neo-text)] group-[.toast]:font-bold group-[.toast]:uppercase hover:group-[.toast]:bg-neo-accent/90",
          cancelButton:
            "group-[.toast]:bg-neo-muted-bg group-[.toast]:text-neo-text group-[.toast]:border-2 group-[.toast]:border-neo-text group-[.toast]:shadow-[2px_2px_0px_var(--neo-text)] group-[.toast]:font-bold group-[.toast]:uppercase hover:group-[.toast]:bg-neo-muted-bg/90",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
