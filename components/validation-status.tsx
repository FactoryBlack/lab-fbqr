"use client"

import { motion } from "framer-motion"
import { Loader, AlertTriangle, ShieldCheck } from "lucide-react"

export type Status = "valid" | "invalid" | "checking" | "idle"

interface ValidationStatusProps {
  status: Status
}

const statusConfig = {
  valid: {
    icon: ShieldCheck,
    text: "Scannable",
    color: "text-green-600",
  },
  invalid: {
    icon: AlertTriangle,
    text: "Unscannable",
    color: "text-[var(--neo-accent)]",
  },
  checking: {
    icon: Loader,
    text: "Checking...",
    color: "text-gray-500",
  },
  idle: {
    icon: null,
    text: "Enter content to generate a preview.",
    color: "text-gray-500",
  },
}

export function ValidationStatus({ status }: ValidationStatusProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center justify-center gap-2 p-3 font-mono text-sm border-[var(--neo-border-width)] border-dashed rounded-md ${config.color}`}
    >
      {Icon && <Icon className={status === "checking" ? "animate-spin" : ""} />}
      <span>{config.text}</span>
    </motion.div>
  )
}
