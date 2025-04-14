"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useWeb3 } from "@/components/web3-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatEther } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export function DashboardStats() {
  const { contract, isConnected } = useWeb3()
  const [stats, setStats] = useState({
    totalProposals: 0,
    activeProposals: 0,
    totalVotes: 0,
    avgParticipation: 0,
  })
  const [treasury, setTreasury] = useState({
    balance: BigInt(0),
    inflow: BigInt(0),
    outflow: BigInt(0),
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      if (!contract || !isConnected) return

      try {
        setLoading(true)

        // Fetch DAO stats
        const daoStats = await contract.getDAOStats()
        setStats({
          totalProposals: Number(daoStats[0]),
          activeProposals: Number(daoStats[1]),
          totalVotes: Number(daoStats[2]), // We renamed this from totalMembers to totalVotes
          avgParticipation: Number(daoStats[3]),
        })

        // Fetch treasury info
        const treasuryInfo = await contract.getTreasuryInfo()
        setTreasury({
          balance: treasuryInfo[0],
          inflow: treasuryInfo[1],
          outflow: treasuryInfo[2],
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
        setStats({
          totalProposals: 0,
          activeProposals: 0,
          totalVotes: 0,
          avgParticipation: 0,
        })
        setTreasury({
          balance: BigInt(0),
          inflow: BigInt(0),
          outflow: BigInt(0),
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [contract, isConnected])

  if (!isConnected) {
    return (
      <>
        <StatCard title="Total Proposals" value="-" />
        <StatCard title="Active Proposals" value="-" />
        <StatCard title="Treasury Balance" value="-" />
        <StatCard title="Total Votes" value="-" />
      </>
    )
  }

  return (
    <>
      <StatCard
        title="Total Proposals"
        value={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : stats.totalProposals.toString()}
      />
      <StatCard
        title="Active Proposals"
        value={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : stats.activeProposals.toString()}
      />
      <StatCard
        title="Treasury Balance"
        value={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `${formatEther(treasury.balance)} ETH`}
      />
      <StatCard
        title="Avg voters"
        value={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : stats.totalVotes.toString()}
      />
    </>
  )
}

function StatCard({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
