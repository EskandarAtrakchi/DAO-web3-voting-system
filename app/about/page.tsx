import type React from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ContactForm } from "@/components/contact-form"
import { FileText, Vote, Wallet, Users, CheckCircle2, BarChart4, ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">About DAO Voting System</h1>
            <p className="text-xl text-muted-foreground">
              A decentralized governance platform for transparent decision-making
            </p>
          </div>

          <Tabs defaultValue="about" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="how-to-use">How to Use</TabsTrigger>
              <TabsTrigger value="contact">Contact Us</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>What is DAO Voting System?</CardTitle>
                  <CardDescription>A decentralized autonomous organization (DAO) governance platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p>
                    The DAO Voting System is a decentralized application built on blockchain technology that enables
                    transparent, secure, and efficient governance for decentralized organizations. It allows members to
                    create proposals, vote on important decisions, and manage shared resources through a democratic
                    process.
                  </p>

                  <h3 className="text-lg font-semibold">Key Features</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FeatureCard
                      icon={<FileText className="h-5 w-5" />}
                      title="Proposal Management"
                      description="Create, view, and vote on proposals with detailed information and voting deadlines."
                    />
                    <FeatureCard
                      icon={<Vote className="h-5 w-5" />}
                      title="Secure Voting"
                      description="Transparent and tamper-proof voting system with one vote per member."
                    />
                    <FeatureCard
                      icon={<Wallet className="h-5 w-5" />}
                      title="Treasury Management"
                      description="Track funds, monitor inflows and outflows, and view transaction history."
                    />
                    <FeatureCard
                      icon={<Users className="h-5 w-5" />}
                      title="Member Management"
                      description="Add new members and manage permissions within the organization."
                    />
                    <FeatureCard
                      icon={<BarChart4 className="h-5 w-5" />}
                      title="Analytics Dashboard"
                      description="View key metrics and statistics about the DAO's activities."
                    />
                    <FeatureCard
                      icon={<CheckCircle2 className="h-5 w-5" />}
                      title="Proposal Execution"
                      description="Automatically execute approved proposals after voting period ends."
                    />
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Technical Implementation</h3>
                    <p className="mb-4">
                      This application is built using Next.js for the frontend and integrates with a Solidity smart
                      contract deployed on the Ethereum blockchain. The smart contract handles all voting logic,
                      proposal management, and treasury operations in a decentralized manner.
                    </p>
                    <div className="flex justify-center">
                      <Link href="/proposals">
                        <Button className="gap-1">
                          Explore Proposals
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="how-to-use" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>How to Use the DAO Voting System</CardTitle>
                  <CardDescription>Step-by-step guide to participating in the DAO</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Getting Started</h3>

                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                            1
                          </span>
                          Connect Your Wallet
                        </h4>
                        <p className="text-muted-foreground pl-8">
                          Click the "Connect Wallet" button in the top right corner to connect your Ethereum wallet
                          (MetaMask recommended). This will allow you to interact with the DAO.
                        </p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                            2
                          </span>
                          Become a Member
                        </h4>
                        <p className="text-muted-foreground pl-8">
                          Only members can create proposals and vote. The DAO owner can add you as a member through the
                          Members page. Contact the DAO administrator if you need to be added.
                        </p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                            3
                          </span>
                          Explore the Dashboard
                        </h4>
                        <p className="text-muted-foreground pl-8">
                          The dashboard provides an overview of the DAO's activities, including proposal statistics,
                          treasury information, and recent proposals.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Working with Proposals</h3>

                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                            1
                          </span>
                          Creating a Proposal
                        </h4>
                        <p className="text-muted-foreground pl-8">
                          Navigate to the Proposals page and click "New Proposal". Fill out the form with your proposal
                          details, including title, description, proposal type, and voting period.
                        </p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                            2
                          </span>
                          Voting on Proposals
                        </h4>
                        <p className="text-muted-foreground pl-8">
                          Browse active proposals and click on one to view details. Use the "Vote For" or "Vote Against"
                          buttons to cast your vote. Each member can vote once per proposal.
                        </p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                            3
                          </span>
                          Executing Proposals
                        </h4>
                        <p className="text-muted-foreground pl-8">
                          After the voting period ends, proposals can be executed by the DAO owner. This finalizes the
                          decision and implements the proposed changes.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Managing the Treasury</h3>

                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                            1
                          </span>
                          Adding Funds
                        </h4>
                        <p className="text-muted-foreground pl-8">
                          Go to the Treasury page and use the "Add Funds to Treasury" form. Enter the amount of ETH you
                          want to contribute and click "Deposit Funds". This will send ETH directly to the DAO's
                          treasury.
                        </p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                            2
                          </span>
                          Withdrawing Funds (Owner Only)
                        </h4>
                        <p className="text-muted-foreground pl-8">
                          The DAO owner can withdraw funds from the treasury using the "Withdraw Funds" form. Specify
                          the amount and recipient address to transfer ETH from the treasury.
                        </p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                          <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                            3
                          </span>
                          Viewing Treasury History
                        </h4>
                        <p className="text-muted-foreground pl-8">
                          The Treasury page displays a history of all treasury balance snapshots, allowing you to track
                          changes in the DAO's funds over time.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">User Roles</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Members</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Create new proposals
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Vote on active proposals
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            View DAO statistics and treasury
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Add funds to the treasury
                          </li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Owner (Admin)</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            All member privileges
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Add new members
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Execute proposals
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Withdraw funds from treasury
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-center">
                    <Link href="/treasury">
                      <Button className="gap-1">
                        Go to Treasury
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Us</CardTitle>
                  <CardDescription>Have questions or need assistance? Reach out to our team.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Get in Touch</h3>
                      <p className="text-muted-foreground">
                        We're here to help with any questions or issues you might have regarding the DAO Voting System.
                        Feel free to reach out through any of the following channels:
                      </p>

                      <div className="space-y-3 mt-6">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-primary"
                            >
                              <rect width="20" height="16" x="2" y="4" rx="2" />
                              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium">Email</h4>
                            <p className="text-sm text-muted-foreground">support@daovoting.example</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-primary"
                            >
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium">Phone</h4>
                            <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-primary"
                            >
                              <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1.5" />
                              <path d="M16 2v4" />
                              <path d="M8 2v4" />
                              <path d="M3 10h18" />
                              <path d="M18 14v4" />
                              <path d="M18 20h-3" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium">Office Hours</h4>
                            <p className="text-sm text-muted-foreground">Monday - Friday: 9am - 5pm EST</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-primary"
                            >
                              <path d="M15 11h.01" />
                              <path d="M11 15h.01" />
                              <path d="M16 16h.01" />
                              <path d="m2 16 20 6-6-20A20 20 0 0 0 2 16" />
                              <path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium">Discord</h4>
                            <p className="text-sm text-muted-foreground">Join our community: discord.gg/daovoting</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Send us a Message</h3>
                      <ContactForm />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center text-sm text-muted-foreground mt-8">
            <p>© {new Date().getFullYear()} DAO Voting System. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="border rounded-lg p-4 flex gap-4">
      <div className="bg-primary/10 p-2 rounded-full h-fit">{icon}</div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
