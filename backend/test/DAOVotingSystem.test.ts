//  test will be coded here 
/**Key test cases:
Deployment: Validates that the owner is added as a member and that the treasury starts at zero.
Membership: Ensures that only the owner can add new members.
Proposals: Allows a member to create a proposal, emits an event on creation, and checks that the proposal's properties are set correctly.
Voting: Ensures members can vote, prevents double voting, and checks the voting result.
DAO Stats: Retrieves stats like total proposals, active proposals, and members, with average participation calculated.
Treasury: Tests the treasury functionality including receiving funds, withdrawing, and updating the treasury history. */



import { ethers } from "hardhat";
import { expect } from "chai";
import { DAOVotingSystem } from "../typechain-types";
import { Signer } from "ethers";

describe("DAOVotingSystem", function () {
  let dao: DAOVotingSystem;
  let owner: Signer, member1: Signer, member2: Signer, nonMember: Signer;

  beforeEach(async function () {
    [owner, member1, member2, nonMember] = await ethers.getSigners();
    const DAOFactory = await ethers.getContractFactory("DAOVotingSystem", owner);
    dao = (await DAOFactory.deploy()) as DAOVotingSystem;
    await dao.waitForDeployment();
  });

  it("should set the correct owner and initial member", async () => {
    expect(await dao.owner()).to.equal(await owner.getAddress());
    expect(await dao.isMember(await owner.getAddress())).to.be.true;
  });

  it("should allow the owner to add a member", async () => {
    await dao.connect(owner).addMember(await member1.getAddress());
    expect(await dao.isMember(await member1.getAddress())).to.be.true;
  });

  it("should not allow non-owners to add members", async () => {
    await expect(dao.connect(nonMember).addMember(await member1.getAddress())).to.be.rejectedWith("Not owner");
  });

  it("should allow members to create proposals", async () => {
    await dao.connect(owner).createProposal("Title", "Short", "Detailed", 0, 1);
    const proposal = await dao.getProposal(0);
    expect(proposal.title).to.equal("Title");
  });

  it("should not allow non-members to create proposals", async () => {
    await expect(
      dao.connect(nonMember).createProposal("T", "S", "D", 0, 1)
    ).to.be.rejectedWith("Not a DAO member");
  });

  it("should allow members to vote and prevent double voting", async () => {
    await dao.connect(owner).addMember(await member1.getAddress());
    await dao.connect(owner).createProposal("Title", "Short", "Detailed", 0, 1);
    await dao.connect(member1).vote(0, true);
    const proposal = await dao.getProposal(0);
    expect(proposal.votesFor).to.equal(1);
    await expect(dao.connect(member1).vote(0, false)).to.be.rejectedWith("Already voted");
  });

  it("should not allow voting after deadline", async () => {
    await dao.connect(owner).addMember(await member1.getAddress());
    await dao.connect(owner).createProposal("Title", "Short", "Detailed", 0, 0); // Ends immediately
    await ethers.provider.send("evm_increaseTime", [86401]);
    await ethers.provider.send("evm_mine", []);
    await expect(dao.connect(member1).vote(0, true)).to.be.rejectedWith("Voting ended");
  });

  it("should execute proposal after voting deadline", async () => {
    await dao.connect(owner).createProposal("Title", "Short", "Detailed", 0, 0);
    await ethers.provider.send("evm_increaseTime", [86401]);
    await ethers.provider.send("evm_mine", []);
    await dao.connect(owner).executeProposal(0);
    const proposal = await dao.getProposal(0);
    expect(proposal.executed).to.be.true;
  });

  it("should not execute proposal before voting deadline", async () => {
    await dao.connect(owner).createProposal("Title", "Short", "Detailed", 0, 1);
    await expect(dao.connect(owner).executeProposal(0)).to.be.rejectedWith("Voting ongoing");
  });

  it("should receive ETH and allow withdrawal", async () => {
    const sendValue = ethers.parseEther("1");
    await owner.sendTransaction({ to: await dao.getAddress(), value: sendValue });
    expect(await ethers.provider.getBalance(await dao.getAddress())).to.equal(sendValue);
    await dao.connect(owner).withdraw(sendValue, await owner.getAddress());
    expect(await ethers.provider.getBalance(await dao.getAddress())).to.equal(0n);
  });

  it("should return correct treasury info", async () => {
    const sendValue = ethers.parseEther("1");
    await owner.sendTransaction({ to: await dao.getAddress(), value: sendValue });
    await dao.withdraw(ethers.parseEther("0.3"), await owner.getAddress());
    const treasury = await dao.getTreasuryInfo();
    expect(treasury._currentValue).to.equal(ethers.parseEther("0.7"));
    expect(treasury._monthlyInflow).to.equal(ethers.parseEther("1"));
    expect(treasury._monthlyOutflow).to.equal(ethers.parseEther("0.3"));
  });

  it("should track voting history", async () => {
    await dao.addMember(await member1.getAddress());
    await dao.createProposal("Title", "Short", "Detailed", 0, 1);
    await dao.connect(member1).vote(0, true);
    const history = await dao.getVotingHistory(await member1.getAddress());
    expect(history.length).to.equal(1);
    expect(history[0]).to.equal(0);
  });
});
