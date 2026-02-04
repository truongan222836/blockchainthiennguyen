// Web3 service for blockchain integration
import Web3 from 'web3';

let web3Instance = null;
let contractInstance = null;

export const initWeb3 = async () => {
  if (window.ethereum) {
    try {
      web3Instance = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return web3Instance;
    } catch (error) {
      console.error('Error initializing Web3:', error);
      throw error;
    }
  } else {
    throw new Error('MetaMask is not installed');
  }
};

export const getWeb3 = () => {
  if (!web3Instance) {
    throw new Error('Web3 not initialized. Call initWeb3() first.');
  }
  return web3Instance;
};

export const getContract = async (contractAddress, abi) => {
  if (!web3Instance) {
    await initWeb3();
  }
  
  if (!contractInstance || contractInstance.options.address !== contractAddress) {
    contractInstance = new web3Instance.eth.Contract(abi, contractAddress);
  }
  
  return contractInstance;
};

export const getAccounts = async () => {
  if (!web3Instance) {
    await initWeb3();
  }
  return await web3Instance.eth.getAccounts();
};

export const getCurrentAccount = async () => {
  const accounts = await getAccounts();
  return accounts[0];
};

export const convertWeiToEth = (wei) => {
  if (!web3Instance) {
    throw new Error('Web3 not initialized');
  }
  return web3Instance.utils.fromWei(wei, 'ether');
};

export const convertEthToWei = (eth) => {
  if (!web3Instance) {
    throw new Error('Web3 not initialized');
  }
  return web3Instance.utils.toWei(eth, 'ether');
};
