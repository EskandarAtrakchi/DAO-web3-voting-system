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
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

type TreasurySnapshot = {
  timestamp: number
  balance: bigint
}

export default function TreasuryPage() {
  const { contract, isConnected, isOwner, address, signer } = useWeb3()
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
  const [depositAmount, setDepositAmount] = useState("")
  const [depositing, setDepositing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchTreasuryData() {
      if (!contract || !isConnected) return

      try {
        setLoading(true)

        const info = await contract.getTreasuryInfo()
        setTreasuryInfo({
          balance: info[0],
          inflow: info[1],
          outflow: info[2],
        })

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

      if (!ethers.isAddress(withdrawAddress)) {
        throw new Error("Invalid address")
      }

      const amountWei = ethers.parseEther(withdrawAmount)
      const tx = await contract.withdraw(amountWei, withdrawAddress)
      await tx.wait()

      toast({
        title: "Withdrawal Successful",
        description: `${withdrawAmount} ETH has been sent to ${withdrawAddress}`,
      })

      const info = await contract.getTreasuryInfo()
      setTreasuryInfo({
        balance: info[0],
        inflow: info[1],
        outflow: info[2],
      })

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

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault()

    if (!signer || !contract || !isConnected) return

    try {
      setDepositing(true)

      const amountWei = ethers.parseEther(depositAmount)
      const contractAddress = await contract.getAddress()

      const tx = await signer.sendTransaction({
        to: contractAddress,
        value: amountWei,
      })

      await tx.wait()

      toast({
        title: "Deposit Successful",
        description: `${depositAmount} ETH has been added to the treasury`,
      })

      const info = await contract.getTreasuryInfo()
      setTreasuryInfo({
        balance: info[0],
        inflow: info[1],
        outflow: info[2],
      })

      const historyData = await contract.getTreasuryHistory()
      const formattedHistory = historyData.map((item: any) => ({
        timestamp: Number(item.timestamp),
        balance: item.balance,
      }))

      setHistory(formattedHistory)
      setDepositAmount("")
    } catch (error) {
      console.error("Error depositing funds:", error)
      toast({
        title: "Deposit Failed",
        description: "There was an error adding funds to the treasury",
        variant: "destructive",
      })
    } finally {
      setDepositing(false)
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

              <Card>
                <CardHeader>
                  <CardTitle>Add Funds to Treasury</CardTitle>
                  <CardDescription>Contribute ETH to the DAO treasury</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDeposit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="depositAmount" className="text-sm font-medium">
                        Amount (ETH)
                      </label>
                      <Input
                        id="depositAmount"
                        type="number"
                        step="0.0000001"
                        min="0"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full gap-1" disabled={depositing || !depositAmount}>
                      <ArrowUpRight className="h-4 w-4" />
                      {depositing ? "Processing..." : "Deposit Funds"}
                    </Button>
                  </form>
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
                          step="0.0000001"
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
                        className="w-full gap-1"
                        disabled={withdrawing || !withdrawAmount || !withdrawAddress}
                      >
                        <ArrowDownRight className="h-4 w-4" />
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
