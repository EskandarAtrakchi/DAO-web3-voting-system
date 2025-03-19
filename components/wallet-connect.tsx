"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Wallet, LogOut, Copy, ExternalLink } from "lucide-react"

interface WalletConnectProps {
  connected: boolean
  address: string
  balance: string
  onConnect: () => void
  onDisconnect: () => void
}

export function WalletConnect({ connected, address, balance, onConnect, onDisconnect }: WalletConnectProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = async () => {
    setIsLoading(true)
    await onConnect()
    setIsLoading(false)
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address.replace("...", ""))
  }

  const viewOnExplorer = () => {
    window.open(`https://etherscan.io/address/${address}`, "_blank")
  }

  if (!connected) {
    return (
      <Button onClick={handleConnect} disabled={isLoading}>
        {isLoading ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">{address}</span>
          <span className="sm:hidden">Wallet</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="font-medium">Connected Wallet</div>
                <Button variant="ghost" size="icon" onClick={onDisconnect}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Address</div>
                <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                  <code className="text-sm truncate max-w-[180px]">{address}</code>
                  <Button variant="ghost" size="icon" onClick={copyAddress}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Balance</div>
                <div className="font-medium text-lg">{balance} ETH</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Voting Power</div>
                <div className="font-medium text-lg">12 votes</div>
              </div>

              <Button variant="outline" className="w-full flex items-center gap-2" onClick={viewOnExplorer}>
                <ExternalLink className="h-4 w-4" />
                View on Etherscan
              </Button>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

