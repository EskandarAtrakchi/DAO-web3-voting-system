import { expect } from "chai";
import { ethers } from "hardhat";

describe("DAO", function () {
  async function deployDAOFixture() {
    const [owner, voter1, voter2] = await ethers.getSigners();
    const DAO = await ethers.getContractFactory("DAO");
    const dao = await DAO.deploy();
    await dao.waitForDeployment(); // Correct way to wait for deployment in ethers v6
  
    return { dao, owner, voter1, voter2 };
  }
  

  describe("Proposal Creation", function () {
    it("Should allow a user to create a proposal", async function () {
      const { dao, owner } = await deployDAOFixture();
      const tx = await dao.createProposal("Proposal 1");
      await tx.wait();
      
      const proposal = await dao.getProposal(1);
      expect(proposal[0]).to.equal("Proposal 1");
      expect(proposal[1]).to.equal(0); // yesVotes
      expect(proposal[2]).to.equal(0); // noVotes
    });
  });

  describe("Voting", function () {
    it("Should allow users to vote on a proposal", async function () {
      const { dao, voter1, voter2 } = await deployDAOFixture();
      await dao.createProposal("Proposal 1");

      await dao.connect(voter1).vote(1, true);
      await dao.connect(voter2).vote(1, false);

      const proposal = await dao.getProposal(1);
      expect(proposal[1]).to.equal(1); // yesVotes
      expect(proposal[2]).to.equal(1); // noVotes
    });

    it("Should prevent double voting", async function () {
      const { dao, voter1 } = await deployDAOFixture();
      await dao.createProposal("Proposal 1");

      await dao.connect(voter1).vote(1, true);
      await expect(dao.connect(voter1).vote(1, false)).to.be.revertedWith("Already voted");
    });
  });
});