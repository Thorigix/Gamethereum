import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type OwnedNFT = {
  contract: { address: string; name?: string; symbol?: string };
  tokenId: string;
  title?: string;
  description?: string;
  media?: { gateway?: string; raw?: string }[];
  tokenUri?: { gateway?: string; raw?: string };
};

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string;
  chainId?: string;
  nfts: OwnedNFT[];
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshNFTs: () => Promise<void>;
  loading: boolean;
  error?: string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);
export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within a WalletProvider');
  return ctx;
};

// window.ethereum type
declare global {
  interface Window { ethereum?: any }
}

interface WalletProviderProps { children: ReactNode }

// ------- Config -------
// Sepolia Alchemy NFT API (v2)
const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_KEY; //
const ALCHEMY_BASE = `https://eth-sepolia.g.alchemy.com/nft/v2/${ALCHEMY_KEY}`;

async function fetchSepoliaNFTs(owner: string): Promise<OwnedNFT[]> {
  const url = `${ALCHEMY_BASE}/getNFTs?owner=${owner}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Alchemy error: ${res.status}`);
  const data = await res.json();
  return data.ownedNfts ?? []; // sadece array döndür
}



export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [chainId, setChainId] = useState<string>();
  const [nfts, setNfts] = useState<OwnedNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  // helper
  const getAccounts = async () => {
    const accs: string[] = await window.ethereum.request({ method: 'eth_accounts' });
    return accs?.[0];
  };

  const refreshNFTs = async () => {
    if (!walletAddress) return;
    setLoading(true);
    setError(undefined);
    try {
      // Sadece Sepolia’da çek (0xaa36a7)
      if (chainId?.toLowerCase() !== '0xaa36a7') {
        setNfts([]);
        setError('Lütfen Sepolia ağına geçin.');
      } else {
        const items = await fetchSepoliaNFTs(walletAddress);
        setNfts(items);
      }
    } catch (e: any) {
      setError(e?.message ?? 'NFT fetch failed');
      setNfts([]);
    } finally {
      setLoading(false);
    }
  };

  // ilk yükleme: önceki bağlantıyı kontrol et
  useEffect(() => {
    (async () => {
      if (!window.ethereum) return;
      const addr = await getAccounts();
      if (addr) {
        setIsConnected(true);
        setWalletAddress(addr);
      }
      const currentChainId: string = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(currentChainId);
    })();

    if (window.ethereum) {
      const onAccountsChanged = (accs: string[]) => {
        const a = accs?.[0];
        setWalletAddress(a ?? '');
        setIsConnected(!!a);
        setNfts([]);
        setError(undefined);
      };
      const onChainChanged = (cid: string) => {
        setChainId(cid);
        setNfts([]);
        setError(undefined);
      };
      window.ethereum.on?.('accountsChanged', onAccountsChanged);
      window.ethereum.on?.('chainChanged', onChainChanged);
      return () => {
        window.ethereum?.removeListener?.('accountsChanged', onAccountsChanged);
        window.ethereum?.removeListener?.('chainChanged', onChainChanged);
      };
    }
  }, []);

  // adres/ağ değişince NFT’leri yenile
  useEffect(() => { refreshNFTs(); }, [walletAddress, chainId]);

  const connectWallet = async () => {
    if (!window.ethereum) return alert('MetaMask not found!');
    try {
      const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setIsConnected(true);
      setWalletAddress(accounts[0]);
      const cid: string = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(cid);
    } catch {
      alert('Wallet connection failed!');
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setNfts([]);
    setError(undefined);
  };

  return (
    <WalletContext.Provider value={{
      isConnected, walletAddress, chainId, nfts,
      connectWallet, disconnectWallet, refreshNFTs, loading, error
    }}>
      {children}
    </WalletContext.Provider>
  );
};
