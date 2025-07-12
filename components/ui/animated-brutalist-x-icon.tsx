"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedBrutalistXIconProps {
  className?: string
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
}

export const AnimatedBrutalistXIcon = ({ className }: AnimatedBrutalistXIconProps) => {
  return (
    <motion.svg
      viewBox="0 0 32 32"
      className={cn("drop-shadow-[2px_2px_0px_var(--neo-text)]", className)}
      xmlns="http://www.w3.org/2000/svg"
      initial="hidden"
      animate="visible"
    >
      <motion.circle
        cx="16"
        cy="16"
        r="14"
        stroke="var(--neo-text)"
        strokeWidth="2"
        fill="hsl(var(--neo-destructive-accent))"
      />
      <motion.path
        key="cross"
        d="M11 11l10 10M21 11l-10 10"
        stroke="var(--neo-text)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={iconVariants}
      />
    </motion.svg>
  )
}
