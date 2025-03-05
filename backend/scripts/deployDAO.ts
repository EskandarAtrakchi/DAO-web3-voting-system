import { ethers } from "hardhat";

async function main() {
  const DAO = await ethers.getContractFactory("DAO");
  const dao = await DAO.deploy();
  await dao.waitForDeployment();

  console.log(`DAO deployed to: ${await dao.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
