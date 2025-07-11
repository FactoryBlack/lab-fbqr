"use client"

import { motion, AnimatePresence } from "framer-motion"

export type Status = "valid" | "invalid" | "checking" | "idle"

interface ValidationStatusProps {
  status: Status
}

const ScanningLoader = () => (
  <div className="flex items-center gap-2">
    <span>Scanning</span>
    <div className="flex gap-1">
      <motion.div
        className="w-1.5 h-1.5 bg-current rounded-full"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="w-1.5 h-1.5 bg-current rounded-full"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 0.8, delay: 0.1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="w-1.5 h-1.5 bg-current rounded-full"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 0.8, delay: 0.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </div>
  </div>
)

const ScannableCelebration = () => {
  const checkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: "circOut" },
    },
  }

  return (
    <div className="flex items-center gap-2">
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path variants={checkVariants} initial="hidden" animate="visible" d="M20 6L9 17L4 12" />
      </motion.svg>
      <span>Scannable</span>
    </div>
  )
}

const statusConfig = {
  valid: {
    component: <ScannableCelebration />,
    color: "text-green-700",
  },
  invalid: {
    component: <span>Unscannable</span>,
    color: "text-red-600",
  },
  checking: {
    component: <ScanningLoader />,
    color: "text-gray-600",
  },
  idle: {
    component: <span>Enter content to generate a preview.</span>,
    color: "text-gray-600",
  },
}

export function ValidationStatus({ status }: ValidationStatusProps) {
  const config = statusConfig[status]

  return (
    <div className="h-10 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`flex items-center justify-center gap-2 p-3 font-sans text-lg font-black uppercase tracking-wider ${config.color}`}
        >
          {config.component}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
