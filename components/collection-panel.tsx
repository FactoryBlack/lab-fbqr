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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-3xl">Collection</h2>
        {qrCodes.length > 0 && <p className="font-mono text-sm">{qrCodes.length} items</p>}
      </div>
      <div className="border-[var(--neo-border-width)] border-[var(--neo-text)] p-4 rounded-lg bg-[var(--neo-off-white)]">
        {qrCodes.length === 0 ? (
          <div className="text-center p-8">
            <p className="font-mono">Your generated codes will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
        )}
      </div>
    </div>
  )
}
