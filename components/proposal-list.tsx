"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

// Mock data for proposals
const mockProposals = [
  {
    id: 1,
    title: "Increase developer grants by 20%",
    description: "Allocate an additional 20% of treasury funds to developer grants to accelerate ecosystem growth.",
    status: "active",
    proposer: "0x1234...5678",
    created: "2 days ago",
    endTime: "3 days remaining",
    votesFor: 65,
    votesAgainst: 35,
    quorum: 75,
    details:
      "This proposal aims to increase the allocation for developer grants from the current 10% to 30% of the treasury. The funds will be distributed through the existing grants program with a focus on infrastructure and tooling projects.",
  },
  {
    id: 2,
    title: "Reduce transaction fees by 15%",
    description: "Modify the protocol fee structure to reduce transaction costs for all users.",
    status: "active",
    proposer: "0xabcd...ef12",
    created: "1 day ago",
    endTime: "4 days remaining",
    votesFor: 82,
    votesAgainst: 18,
    quorum: 60,
    details:
      "The current fee structure charges 0.3% per transaction. This proposal would reduce that to 0.255% while maintaining the same distribution model for collected fees.",
  },
  {
    id: 3,
    title: "Add support for new token standard",
    description: "Implement support for the ERC-4626 tokenized vault standard.",
    status: "passed",
    proposer: "0x7890...1234",
    created: "1 week ago",
    endTime: "Ended 2 days ago",
    votesFor: 92,
    votesAgainst: 8,
    quorum: 100,
    details:
      "This proposal would add support for the ERC-4626 standard, allowing for better composability with yield-generating vaults and other DeFi protocols.",
  },
  {
    id: 4,
    title: "Upgrade governance mechanism",
    description: "Transition to a delegated voting system to improve participation.",
    status: "rejected",
    proposer: "0xdef0...5678",
    created: "2 weeks ago",
    endTime: "Ended 1 week ago",
    votesFor: 48,
    votesAgainst: 52,
    quorum: 95,
    details:
      "The proposal aimed to implement a delegated voting system where token holders could delegate their voting power to representatives. It was rejected due to concerns about centralization.",
  },
]

export function ProposalList() {
  const [selectedProposal, setSelectedProposal] = useState<any>(null)
  const [voteType, setVoteType] = useState<string>("")
  const [isVoting, setIsVoting] = useState(false)
  const { toast } = useToast()
  const isMobile = useMobile()

  const handleVote = async (proposalId: number, vote: string) => {
    setIsVoting(true)

    // Simulate blockchain transaction
    setTimeout(() => {
      setIsVoting(false)
      toast({
        title: "Vote submitted",
        description: `You voted ${vote} on proposal #${proposalId}`,
      })
    }, 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
          >
            <Clock className="h-3 w-3 mr-1" /> Active
          </Badge>
        )
      case "passed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
          >
            <CheckCircle className="h-3 w-3 mr-1" /> Passed
          </Badge>
        )
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
          >
            <XCircle className="h-3 w-3 mr-1" /> Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="h-3 w-3 mr-1" /> {status}
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Proposals</TabsTrigger>
          <TabsTrigger value="all">All Proposals</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-4">
          {mockProposals
            .filter((p) => p.status === "active")
            .map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                onViewDetails={() => setSelectedProposal(proposal)}
                getStatusBadge={getStatusBadge}
                isMobile={isMobile}
              />
            ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4 mt-4">
          {mockProposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onViewDetails={() => setSelectedProposal(proposal)}
              getStatusBadge={getStatusBadge}
              isMobile={isMobile}
            />
          ))}
        </TabsContent>
      </Tabs>

      {selectedProposal && (
        <Dialog open={!!selectedProposal} onOpenChange={(open) => !open && setSelectedProposal(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Proposal #{selectedProposal.id}</DialogTitle>
              <DialogDescription>
                {getStatusBadge(selectedProposal.status)}
                <span className="ml-2 text-muted-foreground">
                  Proposed by {selectedProposal.proposer} • {selectedProposal.created}
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">{selectedProposal.title}</h3>

              <div className="space-y-2">
                <h4 className="font-medium">Description</h4>
                <p>{selectedProposal.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Details</h4>
                <p>{selectedProposal.details}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>For: {selectedProposal.votesFor}%</span>
                  <span>Against: {selectedProposal.votesAgainst}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-green-100 dark:bg-green-950 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{ width: `${selectedProposal.votesFor}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Quorum: {selectedProposal.quorum}% reached</span>
                  <span className="text-sm text-muted-foreground">{selectedProposal.endTime}</span>
                </div>
              </div>
            </div>

            {selectedProposal.status === "active" && (
              <DialogFooter className={`flex ${isMobile ? "flex-col gap-2" : "sm:justify-between"}`}>
                <div className={`flex gap-2 ${isMobile ? "w-full" : ""}`}>
                  <Button
                    variant="outline"
                    className="border-green-500 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950"
                    onClick={() => handleVote(selectedProposal.id, "For")}
                    disabled={isVoting}
                    {...(isMobile ? { className: "flex-1" } : {})}
                  >
                    Vote For
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
                    onClick={() => handleVote(selectedProposal.id, "Against")}
                    disabled={isVoting}
                    {...(isMobile ? { className: "flex-1" } : {})}
                  >
                    Vote Against
                  </Button>
                </div>
                <Button variant="ghost" onClick={() => setSelectedProposal(null)}>
                  Close
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

interface ProposalCardProps {
  proposal: any
  onViewDetails: () => void
  getStatusBadge: (status: string) => React.ReactNode
  isMobile: boolean
}

function ProposalCard({ proposal, onViewDetails, getStatusBadge, isMobile }: ProposalCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
          <div>
            <CardTitle className="text-lg">{proposal.title}</CardTitle>
            <CardDescription className="mt-1">{proposal.description}</CardDescription>
          </div>
          {getStatusBadge(proposal.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>For: {proposal.votesFor}%</span>
            <span>Against: {proposal.votesAgainst}%</span>
          </div>
          <Progress value={proposal.votesFor} className="h-2" />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Quorum: {proposal.quorum}% reached</span>
            <span className="text-xs text-muted-foreground">{proposal.endTime}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="ml-auto" onClick={onViewDetails}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

