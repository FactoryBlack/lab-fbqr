"use client"

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => {
        return (
          <Toast
            key={id}
            {...props}
            className="rounded-lg bg-[#EAEAEA] border border-black text-black shadow-[4px_4px_0px_#000]"
          >
            <div className="grid gap-1 pr-6">
              {title && <ToastTitle className="font-bold uppercase">{title}</ToastTitle>}
              {description && <ToastDescription className="text-black/80">{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
