"use client"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedCheckCrossProps {
  state: "checked" | "unchecked"
  className?: string
}

const circleVariants = {
  unchecked: { fill: "hsl(var(--neo-destructive-accent))" },
  checked: { fill: "hsl(var(--primary))" },
}

const iconVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: "spring", duration: 0.4, bounce: 0 },
      opacity: { duration: 0.01 },
    },
  },
  exit: {
    pathLength: 0,
    opacity: 0,
    transition: {
      pathLength: { ease: "easeOut", duration: 0.2 },
      opacity: { duration: 0.01, delay: 0.19 },
    },
  },
}

export const AnimatedCheckCross = ({ state, className }: AnimatedCheckCrossProps) => {
  return (
    <motion.svg
      viewBox="0 0 32 32"
      className={cn("drop-shadow-[2px_2px_0px_var(--neo-text)]", className)}
      xmlns="http://www.w3.org/2000/svg"
      initial={false}
      animate={state}
    >
      <motion.circle
        cx="16"
        cy="16"
        r="14"
        stroke="var(--neo-text)"
        strokeWidth="2"
        variants={circleVariants}
        transition={{ duration: 0.2 }}
      />
      <AnimatePresence mode="wait">
        {state === "checked" ? (
          <motion.path
            key="check"
            d="M9 16l5 5 9-9"
            stroke="var(--neo-text)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
        ) : (
          <motion.path
            key="cross"
            d="M11 11l10 10M21 11l-10 10"
            stroke="var(--neo-text)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
        )}
      </AnimatePresence>
    </motion.svg>
  )
}
