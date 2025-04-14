import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(38)}`
}

export function formatEther(wei: bigint): string {
  return (Number(wei) / 1e18).toFixed(4)
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString()
}

export function getProposalTypeString(type: number): string {
  switch (type) {
    case 0:
      return "General"
    case 1:
      return "Funding"
    case 2:
      return "Governance"
    default:
      return "Unknown"
  }
}

export function getProposalStatus(deadline: number, executed: boolean): string {
  const now = Math.floor(Date.now() / 1000)

  if (executed) {
    return "Executed"
  } else if (now > deadline) {
    return "Ready for execution"
  } else {
    return "Active"
  }
}
