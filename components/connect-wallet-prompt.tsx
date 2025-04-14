"use client"

import { useWeb3 } from "@/components/web3-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"

export function ConnectWalletPrompt() {
  const { isConnected, connectWallet, contract } = useWeb3()

  if (isConnected && contract) return null

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{isConnected ? "Contract Not Connected" : "Connect Your Wallet"}</CardTitle>
        <CardDescription>
          {isConnected
            ? "Your wallet is connected, but the contract address is not properly configured."
            : "Connect your wallet to interact with the DAO voting system"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="text-sm text-muted-foreground mb-4">
            Please update the contract address in the web3-provider.tsx file with your deployed contract address.
          </div>
        ) : (
          <Button onClick={connectWallet} className="gap-2">
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
