"use client"

import { motion } from "framer-motion"

export type Status = "valid" | "invalid" | "checking" | "idle"

interface ValidationStatusProps {
  status: Status
}

const statusConfig = {
  valid: {
    text: "Scannable",
    color: "text-green-700",
  },
  invalid: {
    text: "Unscannable",
    color: "text-red-600",
  },
  checking: {
    text: "Checking...",
    color: "text-gray-600",
  },
  idle: {
    text: "Enter content to generate a preview.",
    color: "text-gray-600",
  },
}

export function ValidationStatus({ status }: ValidationStatusProps) {
  const config = statusConfig[status]

  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center justify-center gap-2 p-3 font-sans text-lg font-black uppercase tracking-wider ${config.color}`}
    >
      <span>{config.text}</span>
    </motion.div>
  )
}
