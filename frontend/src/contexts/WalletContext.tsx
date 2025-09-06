import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for NFT and Ethereum provider
interface NFT {
	id?: string;
	name?: string;
	description?: string;
	image_url?: string;
	external_link?: string;
	asset_contract?: {
		address: string;
		name: string;
	};
	token_id?: string;
}

interface EthereumProvider {
	request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
	isMetaMask?: boolean;
}

interface WalletContextType {
	isConnected: boolean;
	walletAddress: string;
	nfts: NFT[];
	connectWallet: () => Promise<void>;
	disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
	const context = useContext(WalletContext);
	if (!context) {
		throw new Error('useWallet must be used within a WalletProvider');
	}
	return context;
};

// Add type for window.ethereum
declare global {
	interface Window {
		ethereum?: EthereumProvider;
	}
}

interface WalletProviderProps {
	children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
	const [isConnected, setIsConnected] = useState(false);
	const [walletAddress, setWalletAddress] = useState('');
	const [nfts, setNfts] = useState<NFT[]>([]);

	// Check if wallet was previously connected on page load
	useEffect(() => {
		const checkConnection = async () => {
			if (typeof window.ethereum !== 'undefined') {
				try {
					const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
					if (accounts.length > 0) {
						setIsConnected(true);
						setWalletAddress(accounts[0]);
						// Fetch NFTs
						const response = await fetch(`https://api.opensea.io/api/v1/assets?owner=${accounts[0]}`);
						const data = await response.json();
						setNfts(data.assets || []);
					}
				} catch (error) {
					console.log('No previous wallet connection found');
				}
			}
		};

		checkConnection();
	}, []);

	const connectWallet = async () => {
		if (typeof window.ethereum !== 'undefined') {
			try {
				const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
				setIsConnected(true);
				setWalletAddress(accounts[0]);
				// Fetch NFTs from wallet
				try {
					const response = await fetch(`https://api.opensea.io/api/v1/assets?owner=${accounts[0]}`);
					const data = await response.json();
					const walletNfts = data.assets || [];
					setNfts(walletNfts);
				} catch (nftError) {
					console.log('Could not fetch NFTs, but wallet connected successfully');
					setNfts([]);
				}
			} catch (error: unknown) {
				// Only show error if user rejected the connection or there was a real error
				const ethError = error as { code?: number; message?: string };
				if (ethError.code === 4001) {
					console.log('User rejected the connection');
				} else {
					console.error('Wallet connection error:', error);
					alert('Wallet connection failed!');
				}
			}
		} else {
			alert('MetaMask not found!');
		}
	};

	const disconnectWallet = () => {
		setIsConnected(false);
		setWalletAddress('');
		setNfts([]);
	};

	const value: WalletContextType = {
		isConnected,
		walletAddress,
		nfts,
		connectWallet,
		disconnectWallet,
	};

	return (
		<WalletContext.Provider value={value}>
			{children}
		</WalletContext.Provider>
	);
};
