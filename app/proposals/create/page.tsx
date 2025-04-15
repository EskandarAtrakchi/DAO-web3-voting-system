"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWeb3 } from "@/components/web3-provider"
import { ConnectWalletPrompt } from "@/components/connect-wallet-prompt"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"

export default function CreateProposalPage() {
  const router = useRouter()
  const { contract, isConnected, isMember } = useWeb3()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    detailedDescription: "",
    proposalType: "0", // Default to General
    votingPeriodDays: "7", // Default to 7 days
  })
  const [submitting, setSubmitting] = useState(false)
  const [contractReady, setContractReady] = useState(false)

  // Check if contract is ready
  useEffect(() => {
    if (contract && isConnected) {
      setContractReady(true)
    } else {
      setContractReady(false)
    }
  }, [contract, isConnected])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleSelectChange(name: string, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!contractReady || !isMember) {
      toast({
        title: "Error",
        description: "Contract not connected or you are not a member",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      const tx = await contract.createProposal(
        formData.title,
        formData.shortDescription,
        formData.detailedDescription,
        Number(formData.proposalType),
        Number(formData.votingPeriodDays),
      )

      await tx.wait()

      toast({
        title: "Proposal Created",
        description: "Your proposal has been successfully created",
      })

      router.push("/proposals")
    } catch (error) {
      console.error("Error creating proposal:", error)
      toast({
        title: "Creation Failed",
        description: "There was an error creating your proposal",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
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

        <h1 className="text-3xl font-bold mb-6">Create New Proposal</h1>

        <ConnectWalletPrompt />

        {isConnected && !contractReady && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-2">Contract Not Configured</h2>
              <p className="text-muted-foreground mb-4">
                The smart contract address is not properly configured. Please update the contract address in the
                web3-provider.tsx file.
              </p>
            </CardContent>
          </Card>
        )}

        {isConnected && contractReady && !isMember ? (
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-bold mb-2">Membership Required</h2>
              <p className="text-muted-foreground mb-4">You must be a member of the DAO to create proposals</p>
            </CardContent>
          </Card>
        ) : isConnected && contractReady ? (
          <Card>
            <CardHeader>
              <CardTitle>Proposal Details</CardTitle>
              <CardDescription>Fill out the form below to create a new proposal for the DAO</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter proposal title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="shortDescription" className="text-sm font-medium">
                    Short Description
                  </label>
                  <Input
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    placeholder="Brief summary of your proposal"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="detailedDescription" className="text-sm font-medium">
                    Detailed Description
                  </label>
                  <Textarea
                    id="detailedDescription"
                    name="detailedDescription"
                    value={formData.detailedDescription}
                    onChange={handleChange}
                    placeholder="Provide a detailed explanation of your proposal"
                    rows={6}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="proposalType" className="text-sm font-medium">
                      Proposal Type
                    </label>
                    <Select
                      value={formData.proposalType}
                      onValueChange={(value) => handleSelectChange("proposalType", value)}
                    >
                      <SelectTrigger id="proposalType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">General</SelectItem>
                        <SelectItem value="1">Funding</SelectItem>
                        <SelectItem value="2">Governance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="votingPeriodDays" className="text-sm font-medium">
                      Voting Period (Days)
                    </label>
                    <Select
                      value={formData.votingPeriodDays}
                      onValueChange={(value) => handleSelectChange("votingPeriodDays", value)}
                    >
                      <SelectTrigger id="votingPeriodDays">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Creating..." : "Create Proposal"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  )
}
