import { Button } from "@/components/ui/button"
import { Wallet, BarChart3, Users, Menu } from "lucide-react"
import { useState } from "react"

interface DaoHeaderProps {
  onCreateProposal: () => void
}

export function DaoHeader({ onCreateProposal }: DaoHeaderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleConnect = () => {
    setIsConnected(true)
  }

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">DAO Voting</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Proposals
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Delegates
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Treasury
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Documentation
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {isConnected ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="h-4 w-4" />
                  <span>1.2M Voting Power</span>
                </div>
                <Button onClick={onCreateProposal} size="sm">
                  Create Proposal
                </Button>
                <Button variant="outline" size="sm">
                  0x7a3B...c92F
                </Button>
              </>
            ) : (
              <Button onClick={handleConnect} size="sm">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>

        <button className="flex items-center md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden p-4 border-t">
          <nav className="grid gap-4">
            <a href="#" className="text-sm font-medium">
              Proposals
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground">
              Delegates
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground">
              Treasury
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground">
              Documentation
            </a>
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {isConnected ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="h-4 w-4" />
                  <span>1.2M Voting Power</span>
                </div>
                <Button onClick={onCreateProposal} size="sm" className="w-full">
                  Create Proposal
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  0x7a3B...c92F
                </Button>
              </>
            ) : (
              <Button onClick={handleConnect} size="sm" className="w-full">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

