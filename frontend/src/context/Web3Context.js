import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import CharityCampaignABI from '../utils/CharityCampaign.abi.json';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState(null);
    const [chainId, setChainId] = useState(null);

    // IMPORTANT: User needs to update this address after deployment
    // Placeholder address, should be replaced by real deployment address
    const CONTRACT_ADDRESS = "0x8f40c8dcB3d56A9076980548b4ff1d9F9342388b";

    const CRONOS_TESTNET_PARAMS = {
        chainId: '0x152', // 338
        chainName: 'Cronos Testnet',
        nativeCurrency: {
            name: 'Cronos',
            symbol: 'TCRO',
            decimals: 18
        },
        rpcUrls: ['https://evm-t3.cronos.org'],
        blockExplorerUrls: ['https://testnet.cronoscan.com']
    };

    const connectWallet = async () => {
        setIsConnecting(true);
        setError(null);
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3Instance = new Web3(window.ethereum);
                const accounts = await web3Instance.eth.getAccounts();
                const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });

                setWeb3(web3Instance);
                setAccount(accounts[0]);
                setChainId(chainIdHex);

                console.log("Creating contract with address:", CONTRACT_ADDRESS);
                const contractInstance = new web3Instance.eth.Contract(
                    CharityCampaignABI,
                    CONTRACT_ADDRESS
                );
                setContract(contractInstance);

                // Check if on correct network
                if (chainIdHex !== CRONOS_TESTNET_PARAMS.chainId) {
                    await switchNetwork();
                }

            } catch (err) {
                console.error(err);
                setError(err.message);
            }
        } else {
            setError("Please install Metamask!");
        }
        setIsConnecting(false);
    };

    const switchNetwork = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: CRONOS_TESTNET_PARAMS.chainId }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [CRONOS_TESTNET_PARAMS],
                    });
                } catch (addError) {
                    setError("Failed to add Cronos Testnet");
                }
            } else {
                setError("Failed to switch to Cronos Testnet");
            }
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                setAccount(accounts[0]);
            });
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    }, []);

    return (
        <Web3Context.Provider value={{ web3, account, contract, connectWallet, isConnecting, error, chainId, switchNetwork, CONTRACT_ADDRESS }}>
            {children}
        </Web3Context.Provider>
    );
};
