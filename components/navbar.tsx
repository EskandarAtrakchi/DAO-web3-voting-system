"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/components/web3-provider"
import { formatAddress } from "@/lib/utils"
import { LayoutDashboard, FileText, Wallet, Users, LogOut, HelpCircle } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const { address, connectWallet, disconnectWallet, isConnected } = useWeb3()

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
    },
    {
      name: "Proposals",
      href: "/proposals",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
    {
      name: "Treasury",
      href: "/treasury",
      icon: <Wallet className="h-4 w-4 mr-2" />,
    },
    {
      name: "Members",
      href: "/members",
      icon: <Users className="h-4 w-4 mr-2" />,
    },
    {
      name: "About",
      href: "/about",
      icon: <HelpCircle className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold text-xl">
            DAO Voting
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center text-sm font-medium transition-colors ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {isConnected ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{formatAddress(address!)}</span>
              <Button variant="outline" size="sm" onClick={disconnectWallet} className="h-8 gap-1">
                <LogOut className="h-4 w-4" />
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={connectWallet} size="sm" className="h-8">
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
      <div className="md:hidden flex overflow-auto border-t">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 items-center justify-center py-2 text-sm font-medium transition-colors ${
              pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            {item.icon}
            <span className="sr-only">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
