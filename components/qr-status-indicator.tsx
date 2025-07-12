"use client"

import { motion, AnimatePresence } from "framer-motion"
import { BrutalistCheckIcon, BrutalistLoaderIcon, BrutalistXIcon } from "./ui/brutalist-status-icons"

export type Status = "valid" | "invalid" | "checking" | "idle"

interface QrStatusIndicatorProps {
  status: Status
  hasLogo: boolean
}

const iconVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 20 } },
  exit: { scale: 0.5, opacity: 0 },
}

const explanationContainerVariants = {
  hidden: { width: 0, marginRight: 0, opacity: 0 },
  visible: {
    width: "auto",
    marginRight: "0.75rem", // mr-3
    opacity: 1,
    transition: { type: "spring", stiffness: 400, damping: 30, when: "beforeChildren" },
  },
  exit: {
    width: 0,
    marginRight: 0,
    opacity: 0,
    transition: { duration: 0.2, when: "afterChildren" },
  },
}

const explanationContentVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
}

export function QrStatusIndicator({ status, hasLogo }: QrStatusIndicatorProps) {
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
      <div className="relative flex items-center">
        <AnimatePresence>
          {status === "invalid" && (
            <motion.div
              variants={explanationContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-hidden origin-right whitespace-nowrap rounded-md bg-neo-text text-neo-bg"
            >
              <motion.div className="p-4 w-64" variants={explanationContentVariants}>
                <p className="font-sans text-base font-bold uppercase text-red-500">Unscannable</p>
                <p className="font-sans text-sm mt-2 whitespace-normal">This QR code may not be readable. Try:</p>
                <ul className="list-disc list-inside font-sans text-sm mt-2 space-y-1 whitespace-normal">
                  <li>Reducing the amount of text content.</li>
                  {hasLogo && <li>Making the logo smaller or removing it.</li>}
                  <li>Using simpler dot and corner styles.</li>
                  <li>Avoiding light colors for the dots.</li>
                </ul>
              </motion.div>
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
