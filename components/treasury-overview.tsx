"use client"

import { useEffect, useState } from "react"
import { useWeb3 } from "@/components/web3-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { formatEther } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

export function TreasuryOverview() {
  const { contract, isConnected } = useWeb3()
  const [treasury, setTreasury] = useState({
    balance: BigInt(0),
    inflow: BigInt(0),
    outflow: BigInt(0),
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTreasuryInfo() {
      if (!contract || !isConnected) return

      try {
        setLoading(true)

        try {
          const treasuryInfo = await contract.getTreasuryInfo()
          setTreasury({
            balance: treasuryInfo[0],
            inflow: treasuryInfo[1],
            outflow: treasuryInfo[2],
          })
        } catch (contractError) {
          console.error("Error fetching treasury info from contract:", contractError)
          setTreasury({
            balance: BigInt(0),
            inflow: BigInt(0),
            outflow: BigInt(0),
          })
        }
      } catch (error) {
        console.error("Error fetching treasury info:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTreasuryInfo()
  }, [contract, isConnected])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full" />
            <div className="flex justify-between gap-4">
              <Skeleton className="h-16 w-1/2" />
              <Skeleton className="h-16 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate percentage for progress bar
  const totalFlow = Number(treasury.inflow) + Number(treasury.outflow)
  const inflowPercentage = totalFlow > 0 ? (Number(treasury.inflow) / totalFlow) * 100 : 50

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Balance</h3>
          <p className="text-2xl font-bold">{formatEther(treasury.balance)} ETH</p>
        </div>

        <div className="mb-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Cash Flow</h3>
          <Progress value={inflowPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Inflow</span>
            <div className="flex items-center">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="font-medium">{formatEther(treasury.inflow)} ETH</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Outflow</span>
            <div className="flex items-center">
              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              <span className="font-medium">{formatEther(treasury.outflow)} ETH</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
