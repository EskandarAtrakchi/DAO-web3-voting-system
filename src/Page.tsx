"use client"

import { useState } from "react"
import { DaoHeader } from "@/components/dao-header"
import { ProposalsList } from "@/components/proposals-list"
import { CreateProposalForm } from "@/components/create-proposal-form"
import { VotingStats } from "@/components/voting-stats"
import type { Proposal } from "@/lib/types"

export default function DaoVotingApp() {
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: "1",
      title: "Increase developer grants by 20%",
      description: "Allocate an additional 20% of the treasury to fund developer grants for protocol improvements.",
      creator: "0x1234...5678",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: "active",
      votesFor: 1250000,
      votesAgainst: 850000,
      votesAbstain: 120000,
    },
    {
      id: "2",
      title: "Add new governance parameter",
      description: "Introduce a new parameter to adjust the voting period duration based on proposal complexity.",
      creator: "0x8765...4321",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: "passed",
      votesFor: 1800000,
      votesAgainst: 450000,
      votesAbstain: 50000,
    },
    {
      id: "3",
      title: "Reduce quorum requirement to 10%",
      description: "Lower the quorum requirement from 15% to 10% to make governance more accessible.",
      creator: "0x2468...1357",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: "rejected",
      votesFor: 900000,
      votesAgainst: 1700000,
      votesAbstain: 200000,
    },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)

  const addProposal = (
    proposal: Omit<Proposal, "id" | "createdAt" | "status" | "votesFor" | "votesAgainst" | "votesAbstain">,
  ) => {
    const newProposal: Proposal = {
      ...proposal,
      id: (proposals.length + 1).toString(),
      createdAt: new Date(),
      status: "active",
      votesFor: 0,
      votesAgainst: 0,
      votesAbstain: 0,
    }
    setProposals([newProposal, ...proposals])
    setShowCreateForm(false)
  }

  const castVote = (proposalId: string, voteType: "for" | "against" | "abstain") => {
    setProposals(
      proposals.map((proposal) => {
        if (proposal.id === proposalId && proposal.status === "active") {
          const voteAmount = 100000 // Simulating 100k voting power
          return {
            ...proposal,
            votesFor: voteType === "for" ? proposal.votesFor + voteAmount : proposal.votesFor,
            votesAgainst: voteType === "against" ? proposal.votesAgainst + voteAmount : proposal.votesAgainst,
            votesAbstain: voteType === "abstain" ? proposal.votesAbstain + voteAmount : proposal.votesAbstain,
          }
        }
        return proposal
      }),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <DaoHeader onCreateProposal={() => setShowCreateForm(true)} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-6">Governance Proposals</h2>
            {showCreateForm ? (
              <CreateProposalForm onSubmit={addProposal} onCancel={() => setShowCreateForm(false)} />
            ) : (
              <ProposalsList proposals={proposals} onVote={castVote} />
            )}
          </div>
          <div>
            <VotingStats proposals={proposals} />
          </div>
        </div>
      </main>
    </div>
  )
}

