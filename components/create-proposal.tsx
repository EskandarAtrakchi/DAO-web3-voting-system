"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function CreateProposal() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [details, setDetails] = useState("")
  const [proposalType, setProposalType] = useState("")
  const [votingPeriod, setVotingPeriod] = useState("7")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const isMobile = useMobile()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !details || !proposalType || !votingPeriod) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate blockchain transaction
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Proposal submitted",
        description: "Your proposal has been submitted to the DAO",
      })

      // Reset form
      setTitle("")
      setDescription("")
      setDetails("")
      setProposalType("")
      setVotingPeriod("7")
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Proposal</CardTitle>
          <CardDescription>
            Submit a proposal for the DAO to vote on. You need at least 100 tokens to create a proposal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Creating a proposal requires a deposit of 100 tokens that will be returned after the voting period ends.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Proposal Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a clear, concise title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Input
                  id="description"
                  placeholder="A brief summary of your proposal"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">Detailed Description</Label>
                <Textarea
                  id="details"
                  placeholder="Provide a detailed explanation of your proposal, including its purpose, implementation details, and expected outcomes."
                  className="min-h-[150px]"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Proposal Type</Label>
                  <Select value={proposalType} onValueChange={setProposalType}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="governance">Governance Change</SelectItem>
                      <SelectItem value="treasury">Treasury Allocation</SelectItem>
                      <SelectItem value="parameter">Parameter Change</SelectItem>
                      <SelectItem value="upgrade">Protocol Upgrade</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period">Voting Period (days)</Label>
                  <Select value={votingPeriod} onValueChange={setVotingPeriod}>
                    <SelectTrigger id="period">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className={`flex ${isMobile ? "flex-col gap-2" : "justify-between"} border-t pt-6`}>
          <Button variant="outline" className={isMobile ? "w-full" : ""}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className={isMobile ? "w-full" : ""}>
            {isSubmitting ? "Submitting..." : "Submit Proposal"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

