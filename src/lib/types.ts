export type ProposalStatus = "active" | "passed" | "rejected" | "canceled"

export interface Proposal {
  id: string
  title: string
  description: string
  creator: string
  createdAt: Date
  endTime: Date
  status: ProposalStatus
  votesFor: number
  votesAgainst: number
  votesAbstain: number
}

