// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Proposal {
        string description;
        uint256 voteCount;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(address => bool) public hasVoted;
    uint256 public proposalCount;
    
    event ProposalCreated(uint256 proposalId, string description);
    event Voted(address voter, uint256 proposalId);

    function createProposal(string memory _description) public {
        proposals[proposalCount] = Proposal(_description, 0);
        emit ProposalCreated(proposalCount, _description);
        proposalCount++;
    }

    function vote(uint256 _proposalId) public {
        require(!hasVoted[msg.sender], "You have already voted");
        require(_proposalId < proposalCount, "Invalid proposal ID");

        proposals[_proposalId].voteCount++;
        hasVoted[msg.sender] = true;
        emit Voted(msg.sender, _proposalId);
    }

    function getProposal(uint256 _proposalId) public view returns (string memory, uint256) {
        require(_proposalId < proposalCount, "Invalid proposal ID");

        Proposal memory proposal = proposals[_proposalId];
        return (proposal.description, proposal.voteCount);
    }
}
