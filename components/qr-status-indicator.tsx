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
  hidden: { width: 0, marginRight: 0, opacity: 0, x: 20 },
  visible: {
    width: "auto",
    marginRight: "-1rem",
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 500, damping: 30, when: "beforeChildren" },
  },
  exit: {
    width: 0,
    marginRight: 0,
    opacity: 0,
    x: 20,
    transition: { duration: 0.2, when: "afterChildren" },
  },
}

const explanationContentVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
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
      <div className="relative flex items-center h-10">
        <AnimatePresence>
          {status === "invalid" && (
            <motion.div
              variants={explanationContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-hidden origin-right"
            >
              <div
                className="h-10 bg-neo-text text-neo-bg rounded-md flex items-center px-4"
                style={{ boxShadow: `4px 4px 0px var(--neo-text)` }}
              >
                <motion.div className="whitespace-nowrap" variants={explanationContentVariants}>
                  <p className="font-sans text-sm font-black uppercase text-[hsl(var(--neo-destructive-accent))]">
                    Unscannable
                  </p>
                  <p className="font-sans text-xs text-neo-bg -mt-1">Try simpler styles or less content.</p>
                </motion.div>
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
