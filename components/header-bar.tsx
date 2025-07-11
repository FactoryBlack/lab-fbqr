"use client"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { NeoButton } from "@/components/ui/neo-button"

interface HeaderBarProps {
  pinToLoad: string
  onPinChange: (value: string) => void
  onLoadClick: () => void
  isLoading: boolean
}

export function HeaderBar({ pinToLoad, onPinChange, onLoadClick, isLoading }: HeaderBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <h1 className="font-heading text-4xl md:text-5xl">QR-BRUTAL</h1>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Input
          type="text"
          placeholder="PIN"
          value={pinToLoad}
          onChange={(e) => onPinChange(e.target.value)}
          className="w-full sm:w-24"
        />
        <NeoButton size="icon" variant="outline" onClick={onLoadClick} disabled={isLoading}>
          <Search size={20} />
        </NeoButton>
      </div>
    </div>
  )
}
