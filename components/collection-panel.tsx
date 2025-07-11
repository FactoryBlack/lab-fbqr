"use client"

import { motion } from "framer-motion"
import type { QRCodeResult } from "@/app/page"
import { CollectionItem } from "./collection-item"
import { ScrollArea } from "./ui/scroll-area"
import { NeoButton } from "./ui/neo-button"
import { Loader2, Save } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface CollectionPanelProps {
  qrCodes: QRCodeResult[]
  copiedId: string | null
  setCopiedId: (id: string | null) => void
  onRemove: (id: string) => void
  onSave: () => void
  isLoading: boolean
  user: User | null
}

export function CollectionPanel({
  qrCodes,
  copiedId,
  setCopiedId,
  onRemove,
  onSave,
  isLoading,
  user,
}: CollectionPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-2">
        <h2 className="font-heading text-xl">Collection</h2>
        {qrCodes.length > 0 && <p className="font-mono text-sm">{qrCodes.length} items</p>}
      </div>
      <div className="flex-1 min-h-0 border-[var(--neo-border-width)] border-neo-text p-2 bg-[var(--neo-off-white)]">
        <ScrollArea className="h-full">
          <div className="p-2">
            {qrCodes.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-mono text-sm">Your generated codes will appear here.</p>
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
      {user && qrCodes.length > 0 && (
        <div className="pt-4">
          <NeoButton onClick={onSave} disabled={isLoading} className="w-full uppercase">
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" size={16} />}
            Save to Cloud
          </NeoButton>
        </div>
      )}
    </div>
  )
}
