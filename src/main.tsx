//importing styles 
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";

//react relates 
import Router from "./Router.tsx";
import React from "react";
import ReactDOM from "react-dom/client";

//queryClient
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

 
// importing from wagmi && rainbow;
import { config } from "./wallets.ts";
import { ResolvedRegister, WagmiProvider } from "wagmi";
import { lightTheme } from "@rainbow-me/rainbowkit";
import {
  RainbowKitProvider,
  DisclaimerComponent,
} from "@rainbow-me/rainbowkit";

const queryClient = new QueryClient();

//disclaimer on the wallet before connection 
const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to the{" "}
    <Link href="https://calorie-calculator-project.vercel.app/Disclaimer">
      Terms of Service
    </Link>{" "}
    and acknowledge you have read and understand the protocol{" "}
    <Link href="https://calorie-calculator-project.vercel.app/Disclaimer">
      Disclaimer
    </Link>
  </Text>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config as ResolvedRegister['config']}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: "#000",
            accentColorForeground: "white",
            borderRadius: "small",
            fontStack: "system",
          })}
          showRecentTransactions={true}
          appInfo={{
            appName: "RainbowKit Demo",
            disclaimer: Disclaimer,
          }}
          coolMode
        >
          <Router />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);

// 0x72805661557035298b11834EAB468bDFe7966f92