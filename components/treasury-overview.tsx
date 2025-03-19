"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts"
import { Download, ArrowUpRight } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

// Mock data for treasury assets
const assetData = [
  { name: "ETH", value: 1200000, color: "#627EEA" },
  { name: "USDC", value: 800000, color: "#2775CA" },
  { name: "DAI", value: 300000, color: "#F5AC37" },
  { name: "Other", value: 100000, color: "#6E6E6E" },
]

// Mock data for treasury history
const historyData = [
  { month: "Jan", inflow: 120000, outflow: 80000 },
  { month: "Feb", inflow: 150000, outflow: 90000 },
  { month: "Mar", inflow: 180000, outflow: 100000 },
  { month: "Apr", inflow: 220000, outflow: 120000 },
  { month: "May", inflow: 250000, outflow: 130000 },
  { month: "Jun", inflow: 280000, outflow: 150000 },
]

// Mock data for recent transactions
const recentTransactions = [
  {
    id: 1,
    type: "Inflow",
    amount: "50,000 USDC",
    description: "Protocol fees",
    date: "2 days ago",
    txHash: "0x1234...5678",
  },
  {
    id: 2,
    type: "Outflow",
    amount: "10,000 DAI",
    description: "Developer grant",
    date: "3 days ago",
    txHash: "0xabcd...ef12",
  },
  {
    id: 3,
    type: "Outflow",
    amount: "5 ETH",
    description: "Security audit",
    date: "1 week ago",
    txHash: "0x7890...1234",
  },
  {
    id: 4,
    type: "Inflow",
    amount: "25,000 USDC",
    description: "NFT sales revenue",
    date: "1 week ago",
    txHash: "0xdef0...5678",
  },
]

export function TreasuryOverview() {
  const totalValue = assetData.reduce((sum, asset) => sum + asset.value, 0)
  const isMobile = useMobile()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Value</CardTitle>
            <CardDescription>Current treasury value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Updated 5 minutes ago</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Monthly Inflow</CardTitle>
            <CardDescription>Average over 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{formatCurrency(200000)}</div>
            <p className="text-xs text-muted-foreground mt-1">+15% from previous period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Monthly Outflow</CardTitle>
            <CardDescription>Average over 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{formatCurrency(111667)}</div>
            <p className="text-xs text-muted-foreground mt-1">+8% from previous period</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assets">
        <TabsList className="mb-4">
          <TabsTrigger value="assets">Asset Allocation</TabsTrigger>
          <TabsTrigger value="history">Treasury History</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="assets">
          <Card>
            <CardHeader>
              <CardTitle>Treasury Assets</CardTitle>
              <CardDescription>Current allocation of treasury assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="w-full md:w-1/2 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {assetData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="w-full md:w-1/2">
                  <div className="space-y-4">
                    {assetData.map((asset) => (
                      <div key={asset.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></div>
                          <span>{asset.name}</span>
                        </div>
                        <div className="font-medium">{formatCurrency(asset.value)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
              <div>
                <CardTitle>Treasury History</CardTitle>
                <CardDescription>6-month inflow and outflow</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1 self-start sm:self-auto">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="inflow" name="Inflow" fill="#22c55e" />
                    <Bar dataKey="outflow" name="Outflow" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest treasury transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 last:border-0 last:pb-0 gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${tx.type === "Inflow" ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}
                        >
                          {tx.type}
                        </span>
                        <span className="text-sm font-medium">{tx.amount}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 self-start sm:self-auto">
                      <span className="text-xs">{tx.txHash}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

