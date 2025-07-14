import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NeoCard, NeoCardContent, NeoCardHeader, NeoCardTitle } from "@/components/ui/neo-card"
import { AccountForm } from "./account-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function AccountPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/dashboard?auth=true")
  }

  return (
    <div className="bg-page-bg min-h-screen p-4 sm:p-6 md:p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-5xl md:text-6xl">Account</h1>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 font-bold font-mono uppercase hover:underline text-sm"
        >
          <ArrowLeft size={16} />
          Back to App
        </Link>
      </header>
      <div className="max-w-md mx-auto">
        <NeoCard>
          <NeoCardHeader>
            <NeoCardTitle>Account Details</NeoCardTitle>
          </NeoCardHeader>
          <NeoCardContent className="space-y-4">
            <p className="font-sans">
              <span className="font-bold uppercase">Email:</span> {user.email}
            </p>
            <AccountForm />
          </NeoCardContent>
        </NeoCard>
      </div>
    </div>
  )
}
