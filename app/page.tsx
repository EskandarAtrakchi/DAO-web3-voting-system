import { Navbar } from "@/components/navbar"
import { DashboardStats } from "@/components/dashboard-stats"
import { ProposalsList } from "@/components/proposals-list"
import { TreasuryOverview } from "@/components/treasury-overview"
import { ConnectWalletPrompt } from "@/components/connect-wallet-prompt"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6">DAO Dashboard</h1>

        <ConnectWalletPrompt />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <DashboardStats />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold mb-4">Recent Proposals</h2>
            <ProposalsList limit={5} />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Treasury Overview</h2>
            <TreasuryOverview />
          </div>
        </div>
      </main>
    </div>
  )
}
