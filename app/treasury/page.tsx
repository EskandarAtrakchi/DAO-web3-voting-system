"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWeb3 } from "@/components/web3-provider"
import { ConnectWalletPrompt } from "@/components/connect-wallet-prompt"
import { formatEther, formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { ethers } from "ethers"

type TreasurySnapshot = {
  timestamp: number
  balance: bigint
}

export default function TreasuryPage() {
  const { contract, isConnected, isOwner, address } = useWeb3()
  const [treasuryInfo, setTreasuryInfo] = useState({
    balance: BigInt(0),
    inflow: BigInt(0),
    outflow: BigInt(0),
  })
  const [history, setHistory] = useState<TreasurySnapshot[]>([])
  const [loading, setLoading] = useState(true)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawAddress, setWithdrawAddress] = useState("")
  const [withdrawing, setWithdrawing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchTreasuryData() {
      if (!contract || !isConnected) return

      try {
        setLoading(true)

        // Fetch treasury info
        const info = await contract.getTreasuryInfo()
        setTreasuryInfo({
          balance: info[0],
          inflow: info[1],
          outflow: info[2],
        })

        // Fetch treasury history
        const historyData = await contract.getTreasuryHistory()
        const formattedHistory = historyData.map((item: any) => ({
          timestamp: Number(item.timestamp),
          balance: item.balance,
        }))

        setHistory(formattedHistory)
      } catch (error) {
        console.error("Error fetching treasury data:", error)
        toast({
          title: "Error",
          description: "Failed to load treasury data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTreasuryData()
  }, [contract, isConnected, toast])

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault()

    if (!contract || !isConnected || !isOwner) return

    try {
      setWithdrawing(true)

      // Validate address
      if (!ethers.isAddress(withdrawAddress)) {
        throw new Error("Invalid address")
      }

      // Convert amount to wei
      const amountWei = ethers.parseEther(withdrawAmount)

      const tx = await contract.withdraw(amountWei, withdrawAddress)
      await tx.wait()

      toast({
        title: "Withdrawal Successful",
        description: `${withdrawAmount} ETH has been sent to ${withdrawAddress}`,
      })

      // Refresh treasury data
      const info = await contract.getTreasuryInfo()
      setTreasuryInfo({
        balance: info[0],
        inflow: info[1],
        outflow: info[2],
      })

      // Reset form
      setWithdrawAmount("")
      setWithdrawAddress("")
    } catch (error) {
      console.error("Error withdrawing funds:", error)
      toast({
        title: "Withdrawal Failed",
        description: "There was an error withdrawing funds",
        variant: "destructive",
      })
    } finally {
      setWithdrawing(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Treasury</h1>

        <ConnectWalletPrompt />

        {isConnected && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Treasury Overview</CardTitle>
                  <CardDescription>Current financial status of the DAO</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Current Balance</h3>
                      <p className="text-3xl font-bold">{formatEther(treasuryInfo.balance)} ETH</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Monthly Inflow</h3>
                        <p className="text-xl font-semibold text-green-500">{formatEther(treasuryInfo.inflow)} ETH</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Monthly Outflow</h3>
                        <p className="text-xl font-semibold text-red-500">{formatEther(treasuryInfo.outflow)} ETH</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isOwner && (
                <Card>
                  <CardHeader>
                    <CardTitle>Withdraw Funds</CardTitle>
                    <CardDescription>Send funds from the treasury</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleWithdraw} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="amount" className="text-sm font-medium">
                          Amount (ETH)
                        </label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.001"
                          min="0"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder="0.00"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="address" className="text-sm font-medium">
                          Recipient Address
                        </label>
                        <Input
                          id="address"
                          value={withdrawAddress}
                          onChange={(e) => setWithdrawAddress(e.target.value)}
                          placeholder="0x..."
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={withdrawing || !withdrawAmount || !withdrawAddress}
                      >
                        {withdrawing ? "Processing..." : "Withdraw"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Treasury History</CardTitle>
                <CardDescription>Historical balance snapshots</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4 text-muted-foreground">Loading history...</div>
                ) : history.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No treasury history available</div>
                ) : (
                  <div className="space-y-4">
                    {history.map((snapshot, index) => (
                      <div key={index} className="flex justify-between border-b pb-2 last:border-0">
                        <div className="text-sm">{formatDate(snapshot.timestamp)}</div>
                        <div className="font-medium">{formatEther(snapshot.balance)} ETH</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
