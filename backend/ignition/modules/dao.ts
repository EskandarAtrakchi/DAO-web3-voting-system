import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DAOModule = buildModule("DAOModule", (m) => {
  const dao = m.contract("DAO", []); // No constructor parameters for DAO

  return { dao };
});

export default DAOModule;
