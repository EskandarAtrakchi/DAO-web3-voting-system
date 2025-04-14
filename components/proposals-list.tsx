"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useWeb3 } from "@/components/web3-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getProposalTypeString, getProposalStatus, formatDate } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

type Proposal = {
  id: number
  title: string
  shortDescription: string
  proposalType: number
  votingDeadline: number
  votesFor: number
  votesAgainst: number
  executed: boolean
}

export function ProposalsList({ limit = 0 }: { limit?: number }) {
  const { contract, isConnected } = useWeb3()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProposals() {
      if (!contract || !isConnected) return

      try {
        setLoading(true)

        try {
          const totalProposals = await contract.totalProposals()
          const fetchedProposals: Proposal[] = []

          // Fetch all proposals
          for (let i = 0; i < totalProposals; i++) {
            const proposal = await contract.getProposal(i)
            fetchedProposals.push({
              id: Number(proposal.id),
              title: proposal.title,
              shortDescription: proposal.shortDescription,
              proposalType: Number(proposal.proposalType),
              votingDeadline: Number(proposal.votingDeadline),
              votesFor: Number(proposal.votesFor),
              votesAgainst: Number(proposal.votesAgainst),
              executed: proposal.executed,
            })
          }

          // Sort by newest first
          fetchedProposals.sort((a, b) => b.id - a.id)

          // Apply limit if specified
          setProposals(limit > 0 ? fetchedProposals.slice(0, limit) : fetchedProposals)
        } catch (contractError) {
          console.error("Error fetching proposals from contract:", contractError)
          setProposals([])
        }
      } catch (error) {
        console.error("Error fetching proposals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProposals()
  }, [contract, isConnected, limit])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(limit || 3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (proposals.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center text-muted-foreground">No proposals found</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <Card key={proposal.id}>
          <CardContent className="p-4">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="font-semibold">{proposal.title}</h3>
              <Badge variant={proposal.executed ? "outline" : "default"}>
                {getProposalStatus(proposal.votingDeadline, proposal.executed)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{proposal.shortDescription}</p>
            <div className="flex items-center justify-between text-xs">
              <div className="flex gap-2">
                <Badge variant="outline">{getProposalTypeString(proposal.proposalType)}</Badge>
                <span className="text-muted-foreground">Deadline: {formatDate(proposal.votingDeadline)}</span>
              </div>
              <Link href={`/proposals/${proposal.id}`}>
                <Button variant="ghost" size="sm" className="h-7 gap-1">
                  Details
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}

      {limit > 0 && proposals.length >= limit && (
        <div className="text-center">
          <Link href="/proposals">
            <Button variant="outline" size="sm">
              View All Proposals
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
