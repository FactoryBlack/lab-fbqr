"use client"

import { Check, X, AlertTriangle, Loader } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type Status = "idle" | "checking" | "valid" | "invalid" | "warning"

export interface QrStatusIndicatorProps {
  status: Status
  warningMessage?: string | null
}

const STATUS_CONFIG = {
  idle: { Icon: null, color: "transparent", text: "Waiting for input" },
  checking: { Icon: Loader, color: "bg-blue-400", text: "Validating QR Code..." },
  valid: { Icon: Check, color: "bg-green-400", text: "QR Code is valid" },
  invalid: { Icon: X, color: "bg-red-500", text: "QR Code is not scannable" },
  warning: { Icon: AlertTriangle, color: "bg-yellow-400", text: "May be difficult to scan" },
}

export function QrStatusIndicator({ status, warningMessage }: QrStatusIndicatorProps) {
  const config = STATUS_CONFIG[status]

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute bottom-4 right-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={status}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-black border-2 border-black ${config.color}`}
                style={{ boxShadow: "4px 4px 0px #000" }}
              >
                {config.Icon &&
                  (status === "checking" ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <config.Icon size={24} />
                    </motion.div>
                  ) : (
                    <config.Icon size={24} />
                  ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{status === "warning" && warningMessage ? warningMessage : config.text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
