export enum ProposalType {
  General = 0,
  Funding = 1,
  Governance = 2,
}

export type Proposal = {
  id: number
  title: string
  shortDescription: string
  detailedDescription: string
  proposalType: ProposalType
  votingDeadline: number
  votesFor: number
  votesAgainst: number
  executed: boolean
}

export type TreasurySnapshot = {
  timestamp: number
  balance: bigint
}

export type DAOStats = {
  totalProposals: number
  activeProposals: number
  totalMembers: number
  avgParticipation: number
}

export type TreasuryInfo = {
  balance: bigint
  inflow: bigint
  outflow: bigint
}
