"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Loader } from "lucide-react"
import { NeoCard, NeoCardContent } from "./ui/neo-card"

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

const explanationVariants = {
  hidden: { opacity: 0, x: 10, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
  exit: { opacity: 0, x: 10, scale: 0.95, transition: { duration: 0.2 } },
}

const UnscannableExplanation = ({ hasLogo }: { hasLogo: boolean }) => (
  <motion.div
    variants={explanationVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="absolute top-1/2 -translate-y-1/2 right-full mr-4 w-64 z-20"
  >
    <NeoCard>
      <NeoCardContent className="p-4">
        <p className="font-sans text-base font-bold uppercase text-red-600">Unscannable</p>
        <p className="font-sans text-sm mt-2">This QR code may not be readable. Try:</p>
        <ul className="list-disc list-inside font-sans text-sm mt-2 space-y-1">
          <li>Reducing the amount of text content.</li>
          {hasLogo && <li>Making the logo smaller or removing it.</li>}
          <li>Using simpler dot and corner styles.</li>
          <li>Avoiding light colors for the dots.</li>
        </ul>
      </NeoCardContent>
    </NeoCard>
  </motion.div>
)

export function QrStatusIndicator({ status, hasLogo }: QrStatusIndicatorProps) {
  if (status === "idle") {
    return null
  }

  const statusConfig = {
    checking: { icon: <Loader className="animate-spin" size={20} />, bg: "bg-gray-400" },
    valid: { icon: <Check size={24} />, bg: "bg-[var(--neo-accent)]" },
    invalid: { icon: <X size={24} />, bg: "bg-[hsl(var(--neo-destructive-accent))]" },
    idle: { icon: null, bg: "" },
  }

  const { icon, bg } = statusConfig[status]

  return (
    <div className="absolute top-3 right-3 z-10">
      <div className="relative">
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
        <AnimatePresence>{status === "invalid" && <UnscannableExplanation hasLogo={hasLogo} />}</AnimatePresence>
      </div>
    </div>
  )
}
