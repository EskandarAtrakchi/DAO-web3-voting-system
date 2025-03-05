// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DAO {
    struct Proposal {
        string description;
        uint yesVotes;
        uint noVotes;
        mapping(address => bool) hasVoted;
        bool exists;
    }

    mapping(uint => Proposal) public proposals;
    uint public proposalCount;

    event ProposalCreated(uint proposalId, string description);
    event Voted(uint proposalId, address voter, bool vote);

    function createProposal(string memory _description) public {
        proposalCount++;
        proposals[proposalCount].exists = true;
        proposals[proposalCount].description = _description;
        proposals[proposalCount].yesVotes = 0;
        proposals[proposalCount].noVotes = 0;

        emit ProposalCreated(proposalCount, _description);
    }

    function vote(uint256 _proposalId, bool _vote) public {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        require(!proposals[_proposalId].hasVoted[msg.sender], "Already voted");

        if (_vote) {
            proposals[_proposalId].yesVotes++;
        } else {
            proposals[_proposalId].noVotes++;
        }

        proposals[_proposalId].hasVoted[msg.sender] = true; // Mark voter as voted

        emit Voted(_proposalId, msg.sender, _vote);
    }

    function getProposal(uint _proposalId) public view returns (string memory, uint, uint) {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        return (proposals[_proposalId].description, proposals[_proposalId].yesVotes, proposals[_proposalId].noVotes);
    }
}
