"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { ethers } from "ethers"
import { useToast } from "@/components/ui/use-toast"
import contractABI from "@/lib/contract-abi"

// for MetaMask support
declare global {
  interface Window {
    ethereum?: any
  }
}

type Web3ContextType = {
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  contract: ethers.Contract | null
  address: string | null
  isOwner: boolean
  isMember: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  isConnected: boolean
}

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  contract: null,
  address: null,
  isOwner: false,
  isMember: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnected: false,
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [isMember, setIsMember] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()

  const contractAddress = "0x0ed64d01d0b4b655e410ef1441dd677b695639e7"

  async function connectWallet() {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" })

        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()

        console.log("🔗 Wallet connected:", address)

        try {
          const contract = new ethers.Contract(contractAddress, contractABI, signer)
          console.log("✅ Contract connected:", contract)

          let isOwner = false
          let isMember = false

          try {
            const owner = await contract.owner()
            isOwner = owner.toLowerCase() === address.toLowerCase()
            isMember = await contract.isMember(address)
            console.log("🏠 Is Owner:", isOwner)
            console.log("👥 Is Member:", isMember)
          } catch (contractError) {
            console.warn("⚠️ Could not verify owner/member status:", contractError)
          }

          setProvider(provider)
          setSigner(signer)
          setContract(contract)
          setAddress(address)
          setIsOwner(isOwner)
          setIsMember(isMember)
          setIsConnected(true)

          toast({
            title: "Wallet Connected",
            description: `Connected to ${address.substring(0, 6)}...${address.substring(38)}`,
          })
        } catch (contractError) {
          console.error("❌ Error connecting to contract:", contractError)

          setProvider(provider)
          setSigner(signer)
          setAddress(address)
          setIsConnected(true)

          toast({
            title: "Wallet Connected",
            description: `Connected to ${address.substring(0, 6)}...${address.substring(38)}. Contract connection failed.`,
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("❌ Error connecting wallet:", error)
        toast({
          title: "Connection Failed",
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to use this application.",
        variant: "destructive",
      })
    }
  }

  function disconnectWallet() {
    setProvider(null)
    setSigner(null)
    setContract(null)
    setAddress(null)
    setIsOwner(false)
    setIsMember(false)
    setIsConnected(false)
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", () => {
        disconnectWallet()
      })

      window.ethereum.on("chainChanged", () => {
        window.location.reload()
      })
    }

    return () => {
      if (window.ethereum?.removeAllListeners) {
        window.ethereum.removeAllListeners()
      }
    }
  }, [])

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        contract,
        address,
        isOwner,
        isMember,
        connectWallet,
        disconnectWallet,
        isConnected,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export const useWeb3 = () => useContext(Web3Context)
