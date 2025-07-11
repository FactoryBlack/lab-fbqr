"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Loader } from "lucide-react"

export type Status = "valid" | "invalid" | "checking" | "idle"

interface QrStatusIndicatorProps {
  status: Status
}

const iconVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 20 } },
  exit: { scale: 0.5, opacity: 0 },
}

export function QrStatusIndicator({ status }: QrStatusIndicatorProps) {
  if (status === "idle") {
    return null
  }

  const statusConfig = {
    checking: {
      icon: <Loader className="animate-spin" size={20} />,
      bg: "bg-gray-400",
    },
    valid: {
      icon: <Check size={24} />,
      bg: "bg-[var(--neo-accent)]",
    },
    invalid: {
      icon: <X size={24} />,
      bg: "bg-[hsl(var(--neo-destructive-accent))]",
    },
    idle: { icon: null, bg: "" },
  }

  const { icon, bg } = statusConfig[status]

  return (
    <div className="absolute top-3 right-3 z-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          variants={iconVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`w-10 h-10 rounded-full flex items-center justify-center text-neo-text border-2 border-neo-text ${bg}`}
          style={{ boxShadow: `4px 4px 0px var(--neo-text)` }}
        >
          {icon}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
