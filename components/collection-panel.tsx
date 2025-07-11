"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { QRCodeResult } from "@/app/page"
import { CollectionItem } from "./collection-item"
import { ScrollArea } from "./ui/scroll-area"
import type { User } from "@supabase/supabase-js"
import { Skeleton } from "./ui/skeleton"

const SkeletonCollectionItem = () => (
  <div className="space-y-3 pb-3">
    <div className="flex items-center gap-4">
      <Skeleton className="w-16 h-16 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <div className="grid grid-cols-4 gap-2">
      <Skeleton className="h-10" />
      <Skeleton className="h-10" />
      <Skeleton className="h-10" />
      <Skeleton className="h-10" />
    </div>
  </div>
)

interface CollectionPanelProps {
  qrCodes: QRCodeResult[]
  onRemove: (id: string) => void
  onLoad: (qrCodeResult: QRCodeResult) => void
  isLoading: boolean
  user: User | null
}

export function CollectionPanel({ qrCodes, onRemove, onLoad, isLoading, user }: CollectionPanelProps) {
  return (
    <div className="p-6 h-full flex flex-col bg-transparent">
      <div className="flex items-center justify-between pb-2">
        <h2 className="font-heading text-3xl">Collection</h2>
        {qrCodes.length > 0 && <p className="font-sans text-sm">{qrCodes.length} items</p>}
      </div>
      <div className="flex-1 min-h-0 p-2">
        <ScrollArea className="h-full pr-2">
          <div className="p-2">
            {isLoading && qrCodes.length === 0 ? (
              <div className="space-y-4">
                <SkeletonCollectionItem />
                <SkeletonCollectionItem />
                <SkeletonCollectionItem />
              </div>
            ) : qrCodes.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-sans text-sm">Your generated codes will appear here.</p>
              </div>
            ) : (
              <AnimatePresence>
                <div className="space-y-2">
                  {qrCodes.map((qr) => (
                    <motion.div
                      key={qr.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                    >
                      <CollectionItem qrCodeResult={qr} onRemove={onRemove} onLoad={onLoad} />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
