import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
	isConnected: boolean;
	walletAddress: string;
	nfts: any[];
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
		ethereum?: any;
	}
}

interface WalletProviderProps {
	children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
	const [isConnected, setIsConnected] = useState(false);
	const [walletAddress, setWalletAddress] = useState('');
	const [nfts, setNfts] = useState<any[]>([]);

	// Check if wallet was previously connected on page load
	useEffect(() => {
		const checkConnection = async () => {
			if (typeof window.ethereum !== 'undefined') {
				try {
					const accounts = await window.ethereum.request({ method: 'eth_accounts' });
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
				const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
				setIsConnected(true);
				setWalletAddress(accounts[0]);
				// Fetch NFTs from wallet
				const response = await fetch(`https://api.opensea.io/api/v1/assets?owner=${accounts[0]}`);
				const data = await response.json();
				const walletNfts = data.assets || [];
				setNfts(walletNfts);
			} catch (error) {
				alert('Wallet connection failed!');
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
