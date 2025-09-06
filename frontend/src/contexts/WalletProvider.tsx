import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Media = { gateway?: string; raw?: string };
type OwnedNFT = {
  contract: { address: string; name?: string; symbol?: string };
  tokenId: string;
  title?: string;
  description?: string;
  media?: Media[];
  tokenUri?: { gateway?: string; raw?: string };
};

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string;
  chainId?: string;
  nfts: OwnedNFT[];
  nextPageKey?: string;
  loading: boolean;
  error?: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshNFTs: () => Promise<void>;
  loadMore: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);
export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within a WalletProvider');
  return ctx;
};

declare global { interface Window { ethereum?: any } }

// 🔑 Alchemy NFT API endpoint (Vite env değişkeni)
const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_KEY;
const ALCHEMY_BASE = `https://eth-sepolia.g.alchemy.com/nft/v2/${ALCHEMY_KEY}`;

async function fetchPage(owner: string, pageKey?: string) {
  const url = new URL(`${ALCHEMY_BASE}/getNFTs`);
  url.searchParams.set('owner', owner);
  url.searchParams.set('withMetadata', 'true');
  if (pageKey) url.searchParams.set('pageKey', pageKey);

  const r = await fetch(url.toString());
  if (!r.ok) throw new Error(`Alchemy API ${r.status}`);
  return r.json(); // { ownedNfts:[], pageKey?: string }
}

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [chainId, setChainId] = useState<string>();
  const [nfts, setNfts] = useState<OwnedNFT[]>([]);
  const [nextPageKey, setNextPageKey] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  // 👉 NFT’leri yeniden getir
  const refreshNFTs = async () => {
    if (!walletAddress) return;
    setLoading(true); setError(undefined);

    try {
      if (chainId?.toLowerCase() !== '0xaa36a7') {
        // yanlış ağda ise
        setNfts([]); setNextPageKey(undefined);
        setError('Lütfen MetaMask’te Sepolia ağına geçin.');
      } else {
        // doğru ağda ise Alchemy’den çek
        const data = await fetchPage(walletAddress);
        setNfts(data.ownedNfts ?? []);
        setNextPageKey(data.pageKey);
      }
    } catch (e: any) {
      setError(e.message ?? 'NFT fetch failed');
      setNfts([]); setNextPageKey(undefined);
    } finally {
      setLoading(false);
    }
  };

  // 👉 Daha fazla NFT getir (sayfalama)
  const loadMore = async () => {
    if (!walletAddress || !nextPageKey) return;
    setLoading(true);
    try {
      const data = await fetchPage(walletAddress, nextPageKey);
      setNfts(prev => [...prev, ...(data.ownedNfts ?? [])]);
      setNextPageKey(data.pageKey);
    } finally {
      setLoading(false);
    }
  };

  // 👉 İlk yükleme: wallet bağlı mı kontrol et
  useEffect(() => {
    (async () => {
      if (!window.ethereum) return;
      const accs: string[] = await window.ethereum.request({ method: 'eth_accounts' });
      if (accs?.[0]) { setIsConnected(true); setWalletAddress(accs[0]); }
      const cid: string = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(cid);
    })();

    if (window.ethereum) {
      const onAccountsChanged = (accs: string[]) => {
        setWalletAddress(accs?.[0] ?? ''); setIsConnected(!!accs?.[0]);
        setNfts([]); setNextPageKey(undefined); setError(undefined);
      };
      const onChainChanged = (cid: string) => {
        setChainId(cid); setNfts([]); setNextPageKey(undefined); setError(undefined);
      };
      window.ethereum.on?.('accountsChanged', onAccountsChanged);
      window.ethereum.on?.('chainChanged', onChainChanged);
      return () => {
        window.ethereum?.removeListener?.('accountsChanged', onAccountsChanged);
        window.ethereum?.removeListener?.('chainChanged', onChainChanged);
      };
    }
  }, []);

  // 👉 Adres/ağ değişince otomatik NFT yenile
  useEffect(() => { refreshNFTs(); }, [walletAddress, chainId]);

  const connectWallet = async () => {
    if (!window.ethereum) return alert('MetaMask not found!');
    try {
      const accs: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setIsConnected(true); setWalletAddress(accs[0]);
      const cid: string = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(cid);
    } catch { alert('Wallet connection failed!'); }
  };

  const disconnectWallet = () => {
    setIsConnected(false); setWalletAddress(''); setNfts([]); setNextPageKey(undefined); setError(undefined);
  };

  return (
    <WalletContext.Provider value={{
      isConnected, walletAddress, chainId, nfts, nextPageKey, loading, error,
      connectWallet, disconnectWallet, refreshNFTs, loadMore
    }}>
      {children}
    </WalletContext.Provider>
  );
};
