"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { QRCodeResult } from "@/types"
import { CollectionItem } from "./collection-item"
import { ScrollArea } from "./ui/scroll-area"
import type { User } from "@supabase/supabase-js"
import { CollectionItemSkeleton } from "./collection-item-skeleton"

interface CollectionPanelProps {
  qrCodes: QRCodeResult[]
  onRemove: (id: string) => void
  onLoad: (qrCodeResult: QRCodeResult) => void
  isLoading: boolean
  user: User | null
}

export default function CollectionPanel({ qrCodes, onRemove, onLoad, isLoading, user }: CollectionPanelProps) {
  return (
    <div className="bg-[#E0E0E0] h-full flex flex-col">
      <div className="p-4 border-b-2 border-[#1c1c1c]">
        <h2 className="font-display text-xl uppercase font-black">Collection</h2>
        <p className="font-sans text-sm text-neo-text/70">
          {user ? "Your saved QR codes. Click to load." : "Log in to save your QR codes to the cloud."}
        </p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {isLoading ? (
            <>
              <CollectionItemSkeleton />
              <CollectionItemSkeleton />
              <CollectionItemSkeleton />
            </>
          ) : qrCodes.length === 0 ? (
            <div className="text-center py-10">
              <p className="font-sans font-bold text-neo-text/80">Your collection is empty.</p>
              <p className="font-sans text-sm text-neo-text/60">Generated QR codes will appear here.</p>
            </div>
          ) : (
            <AnimatePresence>
              {qrCodes.map((qr) => (
                <motion.div
                  key={qr.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <CollectionItem qrCodeResult={qr} onRemove={onRemove} onLoad={onLoad} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
