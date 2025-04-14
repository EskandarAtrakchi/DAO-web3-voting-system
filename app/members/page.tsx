"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWeb3 } from "@/components/web3-provider"
import { ConnectWalletPrompt } from "@/components/connect-wallet-prompt"
import { formatAddress } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { ethers } from "ethers"
import { UserPlus } from "lucide-react"

export default function MembersPage() {
  const { contract, isConnected, isOwner } = useWeb3()
  const [newMemberAddress, setNewMemberAddress] = useState("")
  const [adding, setAdding] = useState(false)
  const { toast } = useToast()

  async function handleAddMember(e: React.FormEvent) {
    e.preventDefault()

    if (!contract || !isConnected || !isOwner) return

    try {
      setAdding(true)

      // Validate address
      if (!ethers.isAddress(newMemberAddress)) {
        throw new Error("Invalid address")
      }

      const tx = await contract.addMember(newMemberAddress)
      await tx.wait()

      toast({
        title: "Member Added",
        description: `${formatAddress(newMemberAddress)} has been added as a member`,
      })

      // Reset form
      setNewMemberAddress("")
    } catch (error) {
      console.error("Error adding member:", error)
      toast({
        title: "Failed to Add Member",
        description: "There was an error adding the member",
        variant: "destructive",
      })
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Members</h1>

        <ConnectWalletPrompt />

        {isConnected && (
          <div className="grid gap-6 md:grid-cols-2">
            {isOwner && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Member</CardTitle>
                  <CardDescription>Add a new member to the DAO</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddMember} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="address" className="text-sm font-medium">
                        Member Address
                      </label>
                      <Input
                        id="address"
                        value={newMemberAddress}
                        onChange={(e) => setNewMemberAddress(e.target.value)}
                        placeholder="0x..."
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full gap-1" disabled={adding || !newMemberAddress}>
                      <UserPlus className="h-4 w-4" />
                      {adding ? "Adding..." : "Add Member"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Member Privileges</CardTitle>
                <CardDescription>What members can do in the DAO</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Create new proposals for the DAO</li>
                  <li>Vote on active proposals</li>
                  <li>View detailed proposal information</li>
                  <li>Access treasury information</li>
                </ul>

                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium mb-2">Owner Privileges</h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Add new members to the DAO</li>
                    <li>Execute proposals after voting period</li>
                    <li>Withdraw funds from the treasury</li>
                    <li>All member privileges</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
