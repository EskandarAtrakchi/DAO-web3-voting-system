import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  walletConnectWallet,
  injectedWallet,
  safeWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

import { createConfig } from "wagmi";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        rainbowWallet,
        walletConnectWallet,
        injectedWallet,
        safeWallet,
        trustWallet,
      ],
    },
  ],
  {
    appName: "My RainbowKit App",
    projectId: "b57492a3490d9766ce9d2e3f30f6a755",
  }
);

export const config: ReturnType<typeof createConfig> = createConfig({
  connectors,
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});