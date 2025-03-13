"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Proposal } from "@/lib/types"
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"

interface ProposalsListProps {
  proposals: Proposal[]
  onVote: (proposalId: string, voteType: "for" | "against" | "abstain") => void
}

export function ProposalsList({ proposals, onVote }: ProposalsListProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const getStatusBadge = (status: Proposal["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            <Clock className="mr-1 h-3 w-3" /> Active
          </Badge>
        )
      case "passed":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle className="mr-1 h-3 w-3" /> Passed
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            <XCircle className="mr-1 h-3 w-3" /> Rejected
          </Badge>
        )
      case "canceled":
        return (
          <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
            <AlertCircle className="mr-1 h-3 w-3" /> Canceled
          </Badge>
        )
    }
  }

  const calculatePercentage = (value: number, total: number) => {
    if (total === 0) return 0
    return (value / total) * 100
  }

  return (
    <div className="space-y-6">
      {proposals.map((proposal) => {
        const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain
        const forPercentage = calculatePercentage(proposal.votesFor, totalVotes)
        const againstPercentage = calculatePercentage(proposal.votesAgainst, totalVotes)
        const abstainPercentage = calculatePercentage(proposal.votesAbstain, totalVotes)

        return (
          <Card key={proposal.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{proposal.title}</CardTitle>
                  <CardDescription className="mt-2">
                    Created by {proposal.creator} on {formatDate(proposal.createdAt)}
                  </CardDescription>
                </div>
                {getStatusBadge(proposal.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{proposal.description}</p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">For</span>
                    <span>
                      {forPercentage.toFixed(1)}% ({(proposal.votesFor / 1000000).toFixed(2)}M)
                    </span>
                  </div>
                  <Progress value={forPercentage} className="h-2 bg-muted" indicatorClassName="bg-green-500" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Against</span>
                    <span>
                      {againstPercentage.toFixed(1)}% ({(proposal.votesAgainst / 1000000).toFixed(2)}M)
                    </span>
                  </div>
                  <Progress value={againstPercentage} className="h-2 bg-muted" indicatorClassName="bg-red-500" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Abstain</span>
                    <span>
                      {abstainPercentage.toFixed(1)}% ({(proposal.votesAbstain / 1000000).toFixed(2)}M)
                    </span>
                  </div>
                  <Progress value={abstainPercentage} className="h-2 bg-muted" indicatorClassName="bg-gray-400" />
                </div>
              </div>
            </CardContent>

            {proposal.status === "active" && (
              <CardFooter className="border-t bg-muted/50 px-6 py-4">
                <div className="flex flex-wrap gap-3 w-full">
                  <Button className="flex-1" variant="outline" onClick={() => onVote(proposal.id, "for")}>
                    Vote For
                  </Button>
                  <Button className="flex-1" variant="outline" onClick={() => onVote(proposal.id, "against")}>
                    Vote Against
                  </Button>
                  <Button className="flex-1" variant="outline" onClick={() => onVote(proposal.id, "abstain")}>
                    Abstain
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        )
      })}
    </div>
  )
}

