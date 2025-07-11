"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Copy, X } from "lucide-react"
import { NeoCard, NeoCardContent, NeoCardHeader, NeoCardTitle } from "./ui/neo-card"
import { NeoButton } from "./ui/neo-button"
import { toast } from "sonner"

interface PinModalProps {
  pin: string | null
  onClose: () => void
}

export function PinModal({ pin, onClose }: PinModalProps) {
  const copyPin = () => {
    if (pin) {
      navigator.clipboard.writeText(pin)
      toast("PIN Copied!")
    }
  }

  return (
    <AnimatePresence>
      {pin && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md"
          >
            <NeoCard>
              <NeoCardHeader>
                <NeoCardTitle>Collection Saved!</NeoCardTitle>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                  <X size={24} />
                </button>
              </NeoCardHeader>
              <NeoCardContent className="text-center space-y-4">
                <p>Your PIN is:</p>
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 p-4 text-4xl font-bold tracking-widest">
                  {pin}
                </div>
                <p className="text-sm text-gray-600">Keep this PIN safe to load your collection later.</p>
                <NeoButton onClick={copyPin} className="w-full flex items-center justify-center gap-2">
                  <Copy size={16} />
                  Copy PIN
                </NeoButton>
              </NeoCardContent>
            </NeoCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
