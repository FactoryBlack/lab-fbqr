import Link from "next/link"
import { NeoCard, NeoCardContent } from "@/components/ui/neo-card"
import { ArrowRight } from "lucide-react"

const ToolLink = ({
  href,
  title,
  description,
  status,
}: {
  href: string
  title: string
  description: string
  status: "Live" | "Soon"
}) => (
  <Link href={href} className="block group">
    <NeoCard className="transition-all group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-[4px_4px_0px_var(--neo-text)]">
      <NeoCardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-heading text-3xl">{title}</h3>
            <p className="font-sans mt-1">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`font-sans font-bold text-sm uppercase px-2 py-1 border-2 border-neo-text ${
                status === "Live" ? "bg-neo-accent" : "bg-neo-muted-bg"
              }`}
            >
              {status}
            </span>
            <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </NeoCardContent>
    </NeoCard>
  </Link>
)

export default function HubPage() {
  return (
    <div className="bg-page-bg min-h-screen p-4 sm:p-6 md:p-8">
      <header className="mb-12">
        <h1 className="font-heading text-5xl md:text-7xl">
          FACTORY.BLACK<span className="text-neo-accent">/</span>LAB
        </h1>
        <p className="font-sans text-lg mt-2">A collection of helpful tools.</p>
      </header>

      <main className="space-y-6 max-w-4xl">
        <ToolLink href="/dashboard" title="APP/BOILERPLATE" description="A brutalist app boilerplate." status="Live" />
        <ToolLink
          href="/shortener"
          title="LAB02/FBLK.IO"
          description="A simple and fast URL shortener."
          status="Live"
        />
      </main>
    </div>
  )
}
