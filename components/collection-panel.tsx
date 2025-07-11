"use client"

import { motion } from "framer-motion"
import type { QRCodeResult } from "@/app/page"
import { CollectionItem } from "./collection-item"
import { ScrollArea } from "./ui/scroll-area"
import type { User } from "@supabase/supabase-js"

interface CollectionPanelProps {
  qrCodes: QRCodeResult[]
  copiedId: string | null
  setCopiedId: (id: string | null) => void
  onRemove: (id: string) => void
  isLoading: boolean
  user: User | null
}

export function CollectionPanel({ qrCodes, copiedId, setCopiedId, onRemove, isLoading, user }: CollectionPanelProps) {
  return (
    <div className="p-6 h-full flex flex-col bg-transparent">
      <div className="flex items-center justify-between pb-2">
        <h2 className="font-heading text-xl">Collection</h2>
        {qrCodes.length > 0 && <p className="font-sans text-sm">{qrCodes.length} items</p>}
      </div>
      <div className="flex-1 min-h-0 p-2">
        <ScrollArea className="h-full pr-2">
          <div className="p-2">
            {isLoading && qrCodes.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-sans text-sm">Loading collection...</p>
              </div>
            ) : qrCodes.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-sans text-sm">Your generated codes will appear here.</p>
              </div>
            ) : (
              <div className="space-y-2">
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
        </ScrollArea>
      </div>
    </div>
  )
}
