"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletConnect } from "@/components/wallet-connect"
import { ProposalList } from "@/components/proposal-list"
import { CreateProposal } from "@/components/create-proposal"
import { TreasuryOverview } from "@/components/treasury-overview"
import { VotingHistory } from "@/components/voting-history"
import { DaoStats } from "@/components/dao-stats"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { useTheme } from "next-themes"

export default function DaoInterface() {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [balance, setBalance] = useState("0")
  const { toast } = useToast()
  const isMobile = useMobile()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before rendering theme-dependent content
  useEffect(() => {
    setMounted(true)
  }, [])

  // Simulate wallet connection
  const connectWallet = async () => {
    try {
      // In a real app, this would use ethers.js or web3.js to connect
      setTimeout(() => {
        const mockAddress = "0x" + Math.random().toString(16).slice(2, 12) + "..."
        setAddress(mockAddress)
        setBalance("100.00")
        setConnected(true)
        toast({
          title: "Wallet connected",
          description: `Connected to ${mockAddress}`,
        })
      }, 1000)
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Could not connect to wallet",
        variant: "destructive",
      })
    }
  }

  const disconnectWallet = () => {
    setConnected(false)
    setAddress("")
    setBalance("0")
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  if (!mounted) {
    return null // Avoid rendering until client-side hydration is complete
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 min-h-screen bg-background text-foreground">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">DAO Governance</h1>
          <p className="text-muted-foreground">Decentralized decision making platform</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <ThemeToggle />
          <WalletConnect
            connected={connected}
            address={address}
            balance={balance}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
          />
        </div>
      </header>

      {connected ? (
        <Tabs defaultValue="proposals" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6 md:mb-8">
            <TabsTrigger value="proposals">Proposals</TabsTrigger>
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="treasury">Treasury</TabsTrigger>
            <TabsTrigger value="history">My Votes</TabsTrigger>
          </TabsList>
          <TabsContent value="proposals">
            <div className="grid gap-6">
              <DaoStats />
              <ProposalList />
            </div>
          </TabsContent>
          <TabsContent value="create">
            <CreateProposal />
          </TabsContent>
          <TabsContent value="treasury">
            <TreasuryOverview />
          </TabsContent>
          <TabsContent value="history">
            <VotingHistory address={address} />
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Welcome to DAO Governance</CardTitle>
            <CardDescription>Connect your wallet to participate in governance decisions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 md:py-12 space-y-4">
              <p className="text-center text-muted-foreground mb-4 max-w-md">
                To participate in voting and proposal creation, you need to connect your Ethereum wallet. This allows
                you to interact with the DAO smart contract.
              </p>
              <Button size="lg" onClick={connectWallet}>
                Connect Wallet
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              <div className="text-center">
                <h3 className="font-bold text-xl md:text-2xl">24</h3>
                <p className="text-muted-foreground text-sm">Active Proposals</p>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl md:text-2xl">1,245</h3>
                <p className="text-muted-foreground text-sm">DAO Members</p>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl md:text-2xl">$2.4M</h3>
                <p className="text-muted-foreground text-sm">Treasury Value</p>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

