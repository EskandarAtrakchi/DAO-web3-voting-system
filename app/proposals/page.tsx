import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ProposalsList } from "@/components/proposals-list"
import { Button } from "@/components/ui/button"
import { ConnectWalletPrompt } from "@/components/connect-wallet-prompt"
import { Plus } from "lucide-react"

export default function ProposalsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Proposals</h1>
          <Link href="/proposals/create">
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              New Proposal
            </Button>
          </Link>
        </div>

        <ConnectWalletPrompt />

        <ProposalsList />
      </main>
    </div>
  )
}
