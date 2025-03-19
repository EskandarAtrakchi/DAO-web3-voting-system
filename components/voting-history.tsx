"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, ExternalLink } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface VotingHistoryProps {
  address: string
}

// Mock data for voting history
const mockVotingHistory = [
  {
    id: 1,
    proposalId: 12,
    proposalTitle: "Increase developer grants by 20%",
    vote: "For",
    votingPower: "120 votes",
    date: "2 days ago",
    status: "active",
  },
  {
    id: 2,
    proposalId: 11,
    proposalTitle: "Reduce transaction fees by 15%",
    vote: "Against",
    votingPower: "120 votes",
    date: "4 days ago",
    status: "active",
  },
  {
    id: 3,
    proposalId: 10,
    proposalTitle: "Add support for new token standard",
    vote: "For",
    votingPower: "100 votes",
    date: "1 week ago",
    status: "passed",
  },
  {
    id: 4,
    proposalId: 9,
    proposalTitle: "Upgrade governance mechanism",
    vote: "For",
    votingPower: "100 votes",
    date: "2 weeks ago",
    status: "rejected",
  },
]

export function VotingHistory({ address }: VotingHistoryProps) {
  const isMobile = useMobile()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Voting History</CardTitle>
          <CardDescription>Record of your votes on DAO proposals</CardDescription>
        </CardHeader>
        <CardContent>
          {mockVotingHistory.length > 0 ? (
            <div className="space-y-4">
              {mockVotingHistory.map((vote) => (
                <div
                  key={vote.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 last:border-0 last:pb-0 gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Proposal #{vote.proposalId}:</span>
                      <span className="text-sm">{vote.proposalTitle}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          vote.vote === "For"
                            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                            : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                        }
                      >
                        {vote.vote === "For" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {vote.vote}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{vote.votingPower}</span>
                      <span className="text-xs text-muted-foreground">{vote.date}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 self-start sm:self-auto">
                    <span className="text-xs">View</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground mb-2">You haven't voted on any proposals yet.</p>
              <p className="text-sm text-muted-foreground">
                When you vote on proposals, your voting history will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

