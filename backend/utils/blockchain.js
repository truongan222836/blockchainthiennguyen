// Blockchain utility functions
const Web3 = require('web3');

let web3Instance = null;

const initWeb3 = (rpcUrl) => {
  if (!web3Instance) {
    web3Instance = new Web3(rpcUrl || process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545');
  }
  return web3Instance;
};

const getWeb3 = () => {
  if (!web3Instance) {
    initWeb3();
  }
  return web3Instance;
};

const verifyTransaction = async (txHash) => {
  try {
    const web3 = getWeb3();
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    return receipt && receipt.status;
  } catch (error) {
    console.error('Error verifying transaction:', error);
    return false;
  }
};

const getTransactionDetails = async (txHash) => {
  try {
    const web3 = getWeb3();
    const tx = await web3.eth.getTransaction(txHash);
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    
    return {
      from: tx.from,
      to: tx.to,
      value: web3.utils.fromWei(tx.value, 'ether'),
      blockNumber: receipt.blockNumber,
      status: receipt.status
    };
  } catch (error) {
    console.error('Error getting transaction details:', error);
    return null;
  }
};

module.exports = {
  initWeb3,
  getWeb3,
  verifyTransaction,
  getTransactionDetails
};
