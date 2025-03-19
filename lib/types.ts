// DAO Types
export interface Proposal {
  id: number
  title: string
  description: string
  status: "active" | "passed" | "rejected" | "pending"
  proposer: string
  created: string
  endTime: string
  votesFor: number
  votesAgainst: number
  quorum: number
  details: string
}

export interface Vote {
  id: number
  proposalId: number
  voter: string
  voteType: "For" | "Against"
  votingPower: number
  timestamp: number
}

export interface TreasuryAsset {
  name: string
  symbol: string
  amount: number
  value: number
  color: string
}

export interface TreasuryTransaction {
  id: number
  type: "Inflow" | "Outflow"
  amount: string
  description: string
  date: string
  txHash: string
}

// User Types
export interface UserVote {
  id: number
  proposalId: number
  proposalTitle: string
  vote: "For" | "Against"
  votingPower: string
  date: string
  status: "active" | "passed" | "rejected"
}

