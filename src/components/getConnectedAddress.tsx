import { getAccount } from "@wagmi/core";
import { config } from "../wagmi";

// Function to get the connected account address
const getConnectedAccountAddress = () => {
  const account = getAccount(config);

  if (account.status === "connected") {
    console.log("Connected account address:", account.address);
    return account.address;
  } else {
    console.log("No account connected");
    return undefined;
  }
};

// Call the function
const address = getConnectedAccountAddress();
console.log("Address:", address);