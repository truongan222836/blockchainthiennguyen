import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MyWalletModule", (m) => {
  const myWallet = m.contract("MyWallet");
  
  return { counter: myWallet };
});
