import { useState, useEffect } from "react";
import { useAccount, useContractWrite, useContractRead, usePrepareContractWrite, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ethers } from "ethers";
import daoABI from "../abi/DAO.json"; // Make sure to include your DAO contract ABI here

const DAO_CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Replace with your actual deployed DAO contract address

export default function DAOApp() {
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  const [proposalDescription, setProposalDescription] = useState("");
  const [proposalId, setProposalId] = useState("");
  const [vote, setVote] = useState(true);

  const { data: proposalCount } = useContractRead({
    address: DAO_CONTRACT_ADDRESS,
    abi: daoABI,
    functionName: "proposalCount",
  });

  const { write: createProposal } = useContractWrite({
    address: DAO_CONTRACT_ADDRESS,
    abi: daoABI,
    functionName: "createProposal",
    args: [proposalDescription],
  });

  const { write: voteOnProposal } = useContractWrite({
    address: DAO_CONTRACT_ADDRESS,
    abi: daoABI,
    functionName: "vote",
    args: [Number(proposalId), vote],
  });

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">DAO Interface</h1>
      {!isConnected ? (
        <button onClick={() => connect()} className="px-4 py-2 bg-blue-600 text-white rounded">
          Connect Wallet
        </button>
      ) : (
        <button onClick={() => disconnect()} className="px-4 py-2 bg-red-600 text-white rounded">
          Disconnect
        </button>
      )}

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Create Proposal</h2>
        <input
          type="text"
          placeholder="Proposal Description"
          value={proposalDescription}
          onChange={(e) => setProposalDescription(e.target.value)}
          className="border p-2 w-full mt-2"
        />
        <button
          onClick={() => createProposal?.()}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
        >
          Submit Proposal
        </button>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Vote on Proposal</h2>
        <input
          type="number"
          placeholder="Proposal ID"
          value={proposalId}
          onChange={(e) => setProposalId(e.target.value)}
          className="border p-2 w-full mt-2"
        />
        <select
          value={vote}
          onChange={(e) => setVote(e.target.value === "true")}
          className="border p-2 w-full mt-2"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <button
          onClick={() => voteOnProposal?.()}
          className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded"
        >
          Vote
        </button>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Total Proposals: {proposalCount?.toString()}</h2>
      </div>
    </div>
  );
}
