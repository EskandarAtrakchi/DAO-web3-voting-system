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
        proposals[proposalCount] = Proposal({
            description: _description,
            yesVotes: 0,
            noVotes: 0,
            exists: true
        });
        emit ProposalCreated(proposalCount, _description);
    }
    
    function vote(uint _proposalId, bool _vote) public {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        require(!proposals[_proposalId].hasVoted[msg.sender], "Already voted");
        
        proposals[_proposalId].hasVoted[msg.sender] = true;
        
        if (_vote) {
            proposals[_proposalId].yesVotes++;
        } else {
            proposals[_proposalId].noVotes++;
        }
        
        emit Voted(_proposalId, msg.sender, _vote);
    }
    
    function getProposal(uint _proposalId) public view returns (string memory, uint, uint) {
        require(proposals[_proposalId].exists, "Proposal does not exist");
        Proposal storage p = proposals[_proposalId];
        return (p.description, p.yesVotes, p.noVotes);
    }
}