import Link from "next/link"
import AuthButton from "@/components/auth-button"
import { ChevronLeft } from "lucide-react"
import type { User } from "@supabase/supabase-js"

type PageHeaderProps = {
  title: string
  user: User | null
  onLoginClick: () => void
}

export function PageHeader({ title, user, onLoginClick }: PageHeaderProps) {
  return (
    <header className="flex items-stretch justify-between w-full flex-shrink-0 border-b-2 border-b-[#1c1c1c]">
      <div className="p-4 flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold group text-neo-text hover:text-neo-accent transition-colors"
        >
          <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="hidden sm:inline">LAB</span>
        </Link>
        <div className="w-px h-8 bg-neo-text mx-2 hidden sm:block" />
        <h1 className="font-heading text-5xl md:text-6xl">{title}</h1>
      </div>
      <div className="border-l-2 border-l-[#1c1c1c] p-4 flex items-center">
        <AuthButton user={user} onLoginClick={onLoginClick} />
      </div>
    </header>
  )
}
