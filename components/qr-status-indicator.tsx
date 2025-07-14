"use client"

import { motion, AnimatePresence } from "framer-motion"
import { BrutalistCheckIcon, BrutalistLoaderIcon, BrutalistWarningIcon } from "./ui/brutalist-status-icons"
import { cn } from "@/lib/utils"
import type { JSX } from "react"

export type Status = "valid" | "invalid" | "checking" | "idle" | "warning"

interface QrStatusIndicatorProps {
  status: Status
}

const iconVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 20 } },
  exit: { scale: 0.5, opacity: 0 },
}

const explanationContainerVariants = {
  hidden: { opacity: 0, x: 10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: { duration: 0.2 },
  },
}

const statusConfig: Record<
  Status,
  { icon: JSX.Element | null; bg: string; title?: string; message?: string; titleColor?: string }
> = {
  checking: { icon: <BrutalistLoaderIcon className="w-5 h-5" />, bg: "bg-gray-400" },
  valid: { icon: <BrutalistCheckIcon className="w-6 h-6" />, bg: "bg-[var(--neo-accent)]" },
  warning: {
    icon: <BrutalistWarningIcon className="w-6 h-6" />,
    bg: "bg-yellow-400",
    title: "High Density",
    message: "May be hard to scan. Use less data.",
    titleColor: "text-yellow-600",
  },
  invalid: {
    icon: <BrutalistWarningIcon className="w-6 h-6" />,
    bg: "bg-orange-500",
    title: "Validator Failed",
    message: "Code may still work. Test with device.",
    titleColor: "text-orange-700",
  },
  idle: { icon: null, bg: "" },
}

export function QrStatusIndicator({ status }: QrStatusIndicatorProps) {
  if (status === "idle") {
    return null
  }

  const { icon, bg, title, message, titleColor } = statusConfig[status]
  const showExplanation = status === "invalid" || status === "warning"

  return (
    <div className="absolute top-3 right-3 z-10">
      <div className="relative flex items-center h-10 gap-3">
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              key={`${status}-explanation`}
              variants={explanationContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-10 bg-[#EAEAEA] text-neo-text rounded-none flex items-center px-4 border-2 border-neo-text"
              style={{ boxShadow: `4px 4px 0px var(--neo-text)` }}
            >
              <div className="whitespace-nowrap">
                <p className={cn("font-sans text-sm font-black uppercase", titleColor)}>{title}</p>
                <p className="font-sans text-xs text-neo-text -mt-1">{message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          key={status}
          variants={iconVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`relative w-10 h-10 rounded-full flex items-center justify-center text-neo-text border-2 border-neo-text ${bg}`}
          style={{ boxShadow: `4px 4px 0px var(--neo-text)` }}
        >
          {icon}
        </motion.div>
      </div>
    </div>
  )
}
