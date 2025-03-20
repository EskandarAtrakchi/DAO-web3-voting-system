// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DAOVotingSystem {
    enum ProposalType { General, Funding, Governance }

    struct Proposal {
        uint id;
        string title;
        string shortDescription;
        string detailedDescription;
        ProposalType proposalType;
        uint votingDeadline; // timestamp
        uint votesFor;
        uint votesAgainst;
        bool executed;
    }

    struct TreasurySnapshot {
        uint timestamp;
        uint balance;
    }

    address public owner;
    uint public totalProposals;
    uint public activeProposals;
    uint public totalVotes;
    uint public treasuryBalance;

    uint public monthlyInflow;
    uint public monthlyOutflow;

    Proposal[] public proposals;
    TreasurySnapshot[] public treasuryHistory;

    mapping(address => bool) public isMember;
    mapping(address => uint[]) public votingHistory;
    mapping(uint => mapping(address => bool)) public hasVoted; // proposalId => (voter => bool)

    event ProposalCreated(uint indexed id, string title, uint deadline);
    event Voted(uint indexed proposalId, address voter, bool support);
    event TreasuryUpdated(uint balance, uint inflow, uint outflow);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyMember() {
        require(isMember[msg.sender], "Not a DAO member");
        _;
    }

    constructor() {
        owner = msg.sender;
        isMember[msg.sender] = true; // Owner is a member
        treasuryBalance = 0;
    }

    receive() external payable {
        treasuryBalance += msg.value;
        monthlyInflow += msg.value;
    }

    function withdraw(uint amount, address payable to) external onlyOwner {
        require(amount <= treasuryBalance, "Insufficient funds");
        treasuryBalance -= amount;
        monthlyOutflow += amount;
        to.transfer(amount);
        _updateTreasuryHistory();
    }

    function addMember(address member) external onlyOwner {
        isMember[member] = true;
    }

    function createProposal(
        string memory _title,
        string memory _shortDesc,
        string memory _detailedDesc,
        ProposalType _type,
        uint _votingPeriodDays
    ) external onlyMember {
        uint proposalId = proposals.length;
        uint deadline = block.timestamp + (_votingPeriodDays * 1 days);

        proposals.push(Proposal({
            id: proposalId,
            title: _title,
            shortDescription: _shortDesc,
            detailedDescription: _detailedDesc,
            proposalType: _type,
            votingDeadline: deadline,
            votesFor: 0,
            votesAgainst: 0,
            executed: false
        }));

        totalProposals++;
        activeProposals++;

        emit ProposalCreated(proposalId, _title, deadline);
    }

    function vote(uint proposalId, bool support) external onlyMember {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp <= proposal.votingDeadline, "Voting ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");

        hasVoted[proposalId][msg.sender] = true;
        votingHistory[msg.sender].push(proposalId);
        totalVotes++;

        if (support) {
            proposal.votesFor++;
        } else {
            proposal.votesAgainst++;
        }

        emit Voted(proposalId, msg.sender, support);
    }

    function executeProposal(uint proposalId) external onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp > proposal.votingDeadline, "Voting ongoing");
        require(!proposal.executed, "Already executed");

        proposal.executed = true;
        activeProposals--;
    }

    function _updateTreasuryHistory() internal {
        treasuryHistory.push(TreasurySnapshot({
            timestamp: block.timestamp,
            balance: treasuryBalance
        }));

        emit TreasuryUpdated(treasuryBalance, monthlyInflow, monthlyOutflow);
    }

    // ---------- VIEW FUNCTIONS ----------

    function getProposal(uint proposalId) external view returns (Proposal memory) {
        return proposals[proposalId];
    }

    function getTreasuryHistory() external view returns (TreasurySnapshot[] memory) {
        return treasuryHistory;
    }

    function getVotingHistory(address member) external view returns (uint[] memory) {
        return votingHistory[member];
    }

    function getDAOStats() external view returns (
    uint _totalProposals,
    uint _activeProposals,
    uint _totalMembers,
    uint _avgParticipation
) {
    uint memberCount = 0;
    // Count the number of members (you can store this value in a variable if you want to avoid recalculating it every time)
    for (uint i = 0; i < proposals.length; i++) {
        if (isMember[msg.sender]) {  // Here we should check if the sender is a member (not using proposal ID)
            memberCount++;
        }
    }

    uint avgParticipation = totalProposals > 0 ? (totalVotes * 100) / totalProposals : 0;
    return (totalProposals, activeProposals, memberCount, avgParticipation);
}


    function getTreasuryInfo() external view returns (
        uint _currentValue,
        uint _monthlyInflow,
        uint _monthlyOutflow
    ) {
        return (treasuryBalance, monthlyInflow, monthlyOutflow);
    }
}

// Feature	Implementation
// Proposal Info	Title, Short/Full Description, Type, Deadline
// Treasury Management	Balance, Inflow/Outflow, History Logs
// Voting	Track who voted on what, prevent double-voting
// DAO Stats	Total Proposals, Active, Members, Avg Participation
// Member Management	Owner adds members manually
// Safe Voting/Execution	Only after deadline, once per proposal
