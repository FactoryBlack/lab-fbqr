import { NeoCard, NeoCardContent } from "@/components/ui/neo-card"
import { Skeleton } from "@/components/ui/skeleton"

export function CollectionItemSkeleton() {
  return (
    <NeoCard className="shadow-[4px_4px_0px_var(--neo-text)] opacity-50">
      <NeoCardContent className="p-2 flex items-center gap-3">
        <Skeleton className="h-16 w-16 bg-[#BDBDBD]" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4 bg-[#BDBDBD]" />
          <Skeleton className="h-3 w-1/2 bg-[#BDBDBD]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 bg-[#BDBDBD]" />
          <Skeleton className="h-8 w-8 bg-[#BDBDBD]" />
        </div>
      </NeoCardContent>
    </NeoCard>
  )
}
