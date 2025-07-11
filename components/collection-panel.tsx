"use client"

import { motion } from "framer-motion"
import type { QRCodeResult } from "@/app/page"
import { CollectionItem } from "./collection-item"

interface CollectionPanelProps {
  qrCodes: QRCodeResult[]
  copiedId: string | null
  setCopiedId: (id: string | null) => void
  onRemove: (id: string) => void
}

export function CollectionPanel({ qrCodes, copiedId, setCopiedId, onRemove }: CollectionPanelProps) {
  if (qrCodes.length === 0) {
    return (
      <div className="text-center p-8 border-[var(--neo-border-width)] border-dashed border-[var(--neo-text)] rounded-lg">
        <p className="font-mono">Your generated codes will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {qrCodes.map((qr) => (
        <motion.div
          key={qr.id}
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <CollectionItem
            qrCodeResult={qr}
            isCopied={copiedId === qr.id}
            setCopiedId={setCopiedId}
            onRemove={onRemove}
          />
        </motion.div>
      ))}
    </div>
  )
}
