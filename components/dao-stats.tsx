"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useMobile } from "@/hooks/use-mobile"

// Mock data for DAO statistics
const participationData = [
  { date: "Jan", participation: 35 },
  { date: "Feb", participation: 42 },
  { date: "Mar", participation: 38 },
  { date: "Apr", participation: 45 },
  { date: "May", participation: 52 },
  { date: "Jun", participation: 58 },
]

export function DaoStats() {
  const isMobile = useMobile()

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground mt-1">+2 this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground mt-1">Ends in 3-7 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">DAO Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,245</div>
          <p className="text-xs text-muted-foreground mt-1">+58 this month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg. Participation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">58%</div>
          <p className="text-xs text-muted-foreground mt-1">+6% from last month</p>
        </CardContent>
      </Card>

      <Card className="sm:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Voting Participation</CardTitle>
          <CardDescription>6-month voting participation trend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={participationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line
                  type="monotone"
                  dataKey="participation"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

