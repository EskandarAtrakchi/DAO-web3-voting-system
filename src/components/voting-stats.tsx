import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Proposal } from "@/lib/types"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface VotingStatsProps {
  proposals: Proposal[]
}

export function VotingStats({ proposals }: VotingStatsProps) {
  // Calculate total proposals by status
  const statusCounts = proposals.reduce(
    (acc, proposal) => {
      acc[proposal.status] += 1
      return acc
    },
    { active: 0, passed: 0, rejected: 0, canceled: 0 },
  )

  const statusData = [
    { name: "Active", value: statusCounts.active, color: "#3b82f6" },
    { name: "Passed", value: statusCounts.passed, color: "#22c55e" },
    { name: "Rejected", value: statusCounts.rejected, color: "#ef4444" },
    { name: "Canceled", value: statusCounts.canceled, color: "#f97316" },
  ].filter((item) => item.value > 0)

  // Calculate total voting power used
  const totalVotingPower = proposals.reduce(
    (total, proposal) => total + proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain,
    0,
  )

  // Calculate average participation rate (assuming total supply of 10M tokens)
  const totalSupply = 10000000
  const participationRate = (totalVotingPower / (totalSupply * proposals.length)) * 100

  // Calculate vote distribution
  const totalVotes = proposals.reduce(
    (acc, proposal) => {
      acc.for += proposal.votesFor
      acc.against += proposal.votesAgainst
      acc.abstain += proposal.votesAbstain
      return acc
    },
    { for: 0, against: 0, abstain: 0 },
  )

  const voteDistributionData = [
    { name: "For", value: totalVotes.for, color: "#22c55e" },
    { name: "Against", value: totalVotes.against, color: "#ef4444" },
    { name: "Abstain", value: totalVotes.abstain, color: "#94a3b8" },
  ]

  return (
    <div className="space-y-6 sticky top-20">
      <Card>
        <CardHeader>
          <CardTitle>Governance Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Proposal Status</h3>
              <div className="h-[180px]">
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No proposal data available
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Vote Distribution</h3>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={voteDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {voteDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [(value / 1000000).toFixed(2) + "M"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Total Proposals</h4>
                <p className="text-2xl font-bold">{proposals.length}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium">Participation Rate</h4>
                <p className="text-2xl font-bold">{participationRate.toFixed(1)}%</p>
              </div>

              <div>
                <h4 className="text-sm font-medium">Total Voting Power Used</h4>
                <p className="text-2xl font-bold">{(totalVotingPower / 1000000).toFixed(2)}M</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

