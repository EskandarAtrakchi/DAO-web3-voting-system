"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useWeb3 } from "@/components/web3-provider"
import { ConnectWalletPrompt } from "@/components/connect-wallet-prompt"
import { getProposalTypeString, getProposalStatus, formatDate } from "@/lib/utils"
import { ArrowLeft, Check, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type Proposal = {
  id: number
  title: string
  shortDescription: string
  detailedDescription: string
  proposalType: number
  votingDeadline: number
  votesFor: number
  votesAgainst: number
  executed: boolean
}

export default function ProposalDetailPage() {
  const params = useParams()
  const proposalId = Number(params.id)
  const { contract, address, isConnected, isOwner, isMember } = useWeb3()
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [executing, setExecuting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchProposal() {
      if (!contract || !isConnected) return

      try {
        setLoading(true)

        const fetchedProposal = await contract.getProposal(proposalId)
        setProposal({
          id: Number(fetchedProposal.id),
          title: fetchedProposal.title,
          shortDescription: fetchedProposal.shortDescription,
          detailedDescription: fetchedProposal.detailedDescription,
          proposalType: Number(fetchedProposal.proposalType),
          votingDeadline: Number(fetchedProposal.votingDeadline),
          votesFor: Number(fetchedProposal.votesFor),
          votesAgainst: Number(fetchedProposal.votesAgainst),
          executed: fetchedProposal.executed,
        })

        if (address) {
          const voted = await contract.hasVoted(proposalId, address)
          setHasVoted(voted)
        }
      } catch (error) {
        console.error("Error fetching proposal:", error)
        toast({
          title: "Error",
          description: "Failed to load proposal details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProposal()
  }, [contract, isConnected, proposalId, address, toast])

  async function handleVote(support: boolean) {
    if (!contract || !isConnected || !isMember) return

    try {
      setVoting(true)

      const tx = await contract.vote(proposalId, support)
      await tx.wait()

      toast({
        title: "Vote Submitted",
        description: `You have successfully voted ${support ? "for" : "against"} this proposal`,
      })

      // Refresh proposal data
      const updatedProposal = await contract.getProposal(proposalId)
      setProposal({
        ...proposal!,
        votesFor: Number(updatedProposal.votesFor),
        votesAgainst: Number(updatedProposal.votesAgainst),
      })

      setHasVoted(true)
    } catch (error) {
      console.error("Error voting:", error)
      toast({
        title: "Voting Failed",
        description: "There was an error submitting your vote",
        variant: "destructive",
      })
    } finally {
      setVoting(false)
    }
  }

  async function handleExecute() {
    if (!contract || !isConnected || !isOwner) return

    try {
      setExecuting(true)

      const tx = await contract.executeProposal(proposalId)
      await tx.wait()

      toast({
        title: "Proposal Executed",
        description: "The proposal has been successfully executed",
      })

      // Update proposal status
      setProposal({
        ...proposal!,
        executed: true,
      })
    } catch (error) {
      console.error("Error executing proposal:", error)
      toast({
        title: "Execution Failed",
        description: "There was an error executing the proposal",
        variant: "destructive",
      })
    } finally {
      setExecuting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="mb-6">
          <Link href="/proposals">
            <Button variant="ghost" className="gap-1 pl-0">
              <ArrowLeft className="h-4 w-4" />
              Back to Proposals
            </Button>
          </Link>
        </div>

        <ConnectWalletPrompt />

        {!isConnected ? null : loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : proposal ? (
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{proposal.title}</h1>
                <Badge variant={proposal.executed ? "outline" : "default"} className="ml-2">
                  {getProposalStatus(proposal.votingDeadline, proposal.executed)}
                </Badge>
              </div>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">{getProposalTypeString(proposal.proposalType)}</Badge>
                <span>Deadline: {formatDate(proposal.votingDeadline)}</span>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
                <CardDescription>{proposal.shortDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{proposal.detailedDescription}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Voting Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">For: {proposal.votesFor}</span>
                    <span className="text-sm">Against: {proposal.votesAgainst}</span>
                  </div>
                  <div className="flex gap-1 h-2">
                    <div
                      className="bg-green-500 rounded-l-full"
                      style={{
                        width: `${
                          proposal.votesFor + proposal.votesAgainst > 0
                            ? (proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100
                            : 50
                        }%`,
                      }}
                    />
                    <div
                      className="bg-red-500 rounded-r-full"
                      style={{
                        width: `${
                          proposal.votesFor + proposal.votesAgainst > 0
                            ? (proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst)) * 100
                            : 50
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  {!isMember ? (
                    <div className="text-sm text-muted-foreground">You must be a member to vote on proposals</div>
                  ) : hasVoted ? (
                    <div className="text-sm text-muted-foreground">You have already voted on this proposal</div>
                  ) : new Date() > new Date(proposal.votingDeadline * 1000) ? (
                    <div className="text-sm text-muted-foreground">Voting period has ended</div>
                  ) : (
                    <>
                      <Button onClick={() => handleVote(true)} disabled={voting || !isMember} className="flex-1 gap-1">
                        <Check className="h-4 w-4" />
                        Vote For
                      </Button>
                      <Button
                        onClick={() => handleVote(false)}
                        variant="outline"
                        disabled={voting || !isMember}
                        className="flex-1 gap-1"
                      >
                        <X className="h-4 w-4" />
                        Vote Against
                      </Button>
                    </>
                  )}
                </div>

                {isOwner && new Date() > new Date(proposal.votingDeadline * 1000) && !proposal.executed && (
                  <div className="mt-4">
                    <Button onClick={handleExecute} disabled={executing} className="w-full">
                      Execute Proposal
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold mb-2">Proposal Not Found</h2>
            <p className="text-muted-foreground mb-4">The proposal you are looking for does not exist</p>
            <Link href="/proposals">
              <Button>View All Proposals</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
