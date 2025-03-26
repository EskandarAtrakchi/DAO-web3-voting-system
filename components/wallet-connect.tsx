"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Wallet, LogOut } from "lucide-react"
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

interface WalletConnectProps {
  connected: boolean
  balance: string
  onConnect: () => void
  onDisconnect: () => void
}

export function WalletConnect({ connected, balance, onConnect, onDisconnect }: WalletConnectProps) {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })
  const [isLoading, setIsLoading] = useState(false)
  const [walletAvailable, setWalletAvailable] = useState(true)

  useEffect(() => {
    // Detect if a wallet provider is available (e.g., MetaMask)
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      setWalletAvailable(true)
    } else {
      setWalletAvailable(false)
    }
  }, [])

  const handleConnect = async () => {
    if (!walletAvailable) return
    setIsLoading(true)
    await onConnect()
    setIsLoading(false)
  }

  const handleDisconnect = () => {
    disconnect()
    onDisconnect()
  }

  if (!connected) {
    return (
      <div>
        <Button
          onClick={handleConnect}
          disabled={!walletAvailable || isLoading}
          className={!walletAvailable ? "cursor-not-allowed opacity-50" : ""}
        >
          {walletAvailable
            ? isLoading
              ? "Connecting..."
              : "Exploring↪"
            : "No Wallet Found"}
        </Button>
      </div>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          <code className="text-sm truncate max-w-[45px] hidden sm:inline">{address}</code>
          <span className="sm:hidden">Wallet</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="font-medium">Wallet Status</div>
                <Button variant="ghost" size="icon" onClick={handleDisconnect}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Info About Your Wallet</div>
              <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                {address ? (
                  <>
                    <span>You&apos;r Connected, Your Wallet</span>
                    <code className="text-sm truncate max-w-[180px]">{address}</code>
                  </>
                ) : (
                  <span className="text-sm text-gray-500 italic">Not connected yet</span>
                )}
              </div>
            </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Voting Power</div>
                <div className="font-medium text-lg">0 votes, you need tokens</div>
              </div>
            </div>

            <div className="mt-4">
              <Button
                className="!bg-blue-500 !hover:bg-red-600 !text-white w-full"
                onClick={handleDisconnect}
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
