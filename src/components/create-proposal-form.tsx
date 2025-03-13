import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Proposal } from "@/lib/types"

interface CreateProposalFormProps {
  onSubmit: (
    proposal: Omit<Proposal, "id" | "createdAt" | "status" | "votesFor" | "votesAgainst" | "votesAbstain">,
  ) => void
  onCancel: () => void
}

export function CreateProposalForm({ onSubmit, onCancel }: CreateProposalFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Calculate end date (default to 7 days if not specified)
    const endTime = endDate ? new Date(endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    onSubmit({
      title,
      description,
      creator: "0x7a3B...c92F", // Simulated connected wallet
      endTime,
    })
  }

  // Get tomorrow's date in YYYY-MM-DD format for min date input
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Proposal</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Proposal Title</Label>
            <Input
              id="title"
              placeholder="Enter a clear, descriptive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide a detailed explanation of your proposal"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end-date">Voting End Date (Optional)</Label>
            <Input
              id="end-date"
              type="date"
              min={minDate}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">If not specified, voting will last for 7 days</p>
          </div>
        </CardContent>

        <CardFooter className="border-t bg-muted/50 px-6 py-4">
          <div className="flex justify-end gap-3 w-full">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title || !description}>
              Submit Proposal
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

