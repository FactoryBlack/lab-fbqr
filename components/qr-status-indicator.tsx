"use client"

import { motion, AnimatePresence } from "framer-motion"
import { BrutalistCheckIcon, BrutalistLoaderIcon, BrutalistXIcon } from "./ui/brutalist-status-icons"

export type Status = "valid" | "invalid" | "checking" | "idle"

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

export function QrStatusIndicator({ status }: QrStatusIndicatorProps) {
  if (status === "idle") {
    return null
  }

  const statusConfig = {
    checking: { icon: <BrutalistLoaderIcon className="w-5 h-5" />, bg: "bg-gray-400" },
    valid: { icon: <BrutalistCheckIcon className="w-6 h-6" />, bg: "bg-[var(--neo-accent)]" },
    invalid: { icon: <BrutalistXIcon className="w-6 h-6" />, bg: "bg-[hsl(var(--neo-destructive-accent))]" },
    idle: { icon: null, bg: "" },
  }

  const { icon, bg } = statusConfig[status]

  return (
    <div className="absolute top-3 right-3 z-10">
      <div className="relative flex items-center h-10 gap-3">
        <AnimatePresence>
          {status === "invalid" && (
            <motion.div
              variants={explanationContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-10 bg-neo-bg text-neo-text rounded-md flex items-center px-4"
              style={{ boxShadow: `4px 4px 0px var(--neo-text)` }}
            >
              <div className="whitespace-nowrap">
                <p className="font-sans text-sm font-black uppercase text-[hsl(var(--neo-destructive-accent))]">
                  Unscannable
                </p>
                <p className="font-sans text-xs text-neo-text -mt-1">Try simpler styles or less content.</p>
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
