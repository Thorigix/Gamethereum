import React, { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { NFTCard } from '@/components/NFTCard';
import { GameFilter } from '@/components/GameFilter';
import { mockNFTs, mockGames } from '@/data/mockNFTs';
import { Trophy, Sparkles, Star, Gamepad2, Trash2 } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from '@/components/ui/sonner';
import { createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';

const MyNFTs = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const { isConnected, nfts: walletNfts } = useWallet();

  // Local state for mock NFTs to allow deleting/hiding
  const [userNFTs, setUserNFTs] = useState(mockNFTs);
  const [hiddenWalletKeys, setHiddenWalletKeys] = useState<Set<string>>(new Set());
  const [burningKeys, setBurningKeys] = useState<Set<string>>(new Set());

  const filteredNFTs = useMemo(() => {
    const source = userNFTs;
    if (!selectedGame) return source;
    return source.filter(nft =>
      mockGames.find(game => game.id === selectedGame)?.name === nft.game
    );
  }, [selectedGame, userNFTs]);

  const totalNFTs = userNFTs.length;
  const uniqueGames = new Set(userNFTs.map(n => n.game)).size;
  const legendaryCount = userNFTs.filter(nft => nft.rarity === 'legendary').length;

  // sayfanın üst kısmına ekle (component içinde, render'dan önce olabilir)
  const getAlchemyImage = (nft: any) =>
    nft?.media?.[0]?.gateway ||
    nft?.tokenUri?.gateway ||
    nft?.media?.[0]?.raw ||
    "";

  const extractTokenId = (nft: any): unknown => {
    if (!nft) return undefined;
    if (nft.tokenId != null) return nft.tokenId;
    if (nft.id?.tokenId != null) return nft.id.tokenId;
    if (nft.id != null && typeof nft.id === 'string') return nft.id;
    if (nft.token_id != null) return nft.token_id; // some APIs use snake_case
    return undefined;
  };

  const getDisplayName = (nft: any) => {
    const rawId = extractTokenId(nft);
    const idStr = typeof rawId === 'string' ? rawId : (typeof rawId === 'number' || typeof rawId === 'bigint') ? String(rawId) : '?';
    return nft?.title || `${nft?.contract?.name ?? "NFT"} #${idStr}`;
  };

  const handleDeleteMock = (id: string) => {
    setUserNFTs(prev => prev.filter(n => n.id !== id));
  };

  // Burn by transferring to the dead address if contract doesn't expose burn
  const DEAD_ADDRESS = '0x000000000000000000000000000000000000dEaD' as const;
  const ERC721_ABI = [
    {
      type: 'function',
      name: 'safeTransferFrom',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'tokenId', type: 'uint256' },
      ],
      outputs: [],
    },
  ] as const;

  const ensureSepolia = async () => {
    const target = '0xaa36a7';
    try {
      const current = await window.ethereum.request({ method: 'eth_chainId' });
      if (current?.toLowerCase() !== target) {
        await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: target }] });
      }
    } catch {}
  };

  const parseTokenId = (id: unknown): bigint => {
    if (typeof id === 'bigint') return id;
    if (typeof id === 'number') {
      if (!Number.isInteger(id)) throw new Error('tokenId is not an integer');
      return BigInt(id);
    }
    if (typeof id === 'string') {
      const s = id.trim();
      if (!s) throw new Error('tokenId is empty');
      // Hex with 0x prefix
      if (/^0x[0-9a-fA-F]+$/.test(s)) return BigInt(s);
      // Decimal
      if (/^\d+$/.test(s)) return BigInt(s);
      // Hex without 0x
      if (/^[0-9a-fA-F]+$/.test(s)) return BigInt('0x' + s);
      throw new Error(`Unrecognized tokenId format: ${s}`);
    }
    throw new Error('Unsupported tokenId type');
  };

  const handleBurnWalletNft = async (contractAddress: string, tokenIdValue: any, key: string) => {
    if (!window.ethereum) return toast.error('No wallet available');
    if (!isConnected) return toast.error('Connect your wallet');
    const confirmed = window.confirm('This will permanently remove the NFT from your wallet by sending it to a burn address. This action cannot be undone. Continue?');
    if (!confirmed) return;

    try {
      setBurningKeys(prev => new Set(prev).add(key));
      await ensureSepolia();
      const client = createWalletClient({ chain: sepolia, transport: custom(window.ethereum) });
      let [account] = await client.getAddresses();
      if (!account) {
        const accs: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        account = accs?.[0] as `0x${string}`;
      }
      if (!account) throw new Error('No connected account');
      const tokenId = parseTokenId(tokenIdValue);
      toast('Sending NFT to burn address…');
      await client.writeContract({
        chain: sepolia,
        account,
        address: contractAddress as `0x${string}`,
        abi: ERC721_ABI,
        functionName: 'safeTransferFrom',
        args: [account, DEAD_ADDRESS, tokenId],
      });
      toast.success('NFT removed from your wallet');
      setHiddenWalletKeys(prev => new Set(prev).add(key));
    } catch (e: any) {
      console.error(e);
      toast.error(e?.shortMessage || e?.message || 'Burn failed');
    } finally {
      setBurningKeys(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              My NFT Collection
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover and showcase your gaming achievements as NFTs. Each achievement is a unique proof of your skills in the gaming world.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-card rounded-xl p-6 border border-primary/20 text-center hover:shadow-glow transition-all duration-300">
            <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{totalNFTs}</div>
            <div className="text-muted-foreground">Total NFTs</div>
          </div>
          <div className="bg-gradient-card rounded-xl p-6 border border-secondary/20 text-center hover:shadow-neon transition-all duration-300">
            <Sparkles className="h-8 w-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{uniqueGames}</div>
            <div className="text-muted-foreground">Different Games</div>
          </div>
          <div className="bg-gradient-card rounded-xl p-6 border border-accent/20 text-center hover:shadow-card transition-all duration-300">
            <Star className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{legendaryCount}</div>
            <div className="text-muted-foreground">Legendary NFTs</div>
          </div>
        </div>

        {/* Game Filter */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Filter by Games</h2>
          <GameFilter
            games={mockGames}
            selectedGame={selectedGame}
            onGameSelect={setSelectedGame}
          />
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {filteredNFTs.map((nft) => (
            <div key={nft.id} className="relative group">
              <NFTCard nft={nft} />
              <button
                aria-label="Delete NFT"
                title="Delete from collection"
                onClick={() => handleDeleteMock(nft.id)}
                className="absolute top-2 right-2 z-10 inline-flex items-center justify-center h-8 w-8 rounded-md bg-black/60 hover:bg-black/80 text-white border border-white/20 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Wallet NFTs Section */}
        {isConnected && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">NFTs from Your Wallet</h2>
            {walletNfts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Trophy className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  No NFTs found in your wallet
                </h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Start your collecting journey!
                </p>
              </div>
            ) : (
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
  {walletNfts
    .filter((nft: any, i: number) => {
      const tokenIdValue = extractTokenId(nft);
      const key = `${nft?.contract?.address}-${String(tokenIdValue)}-${i}`;
      return !hiddenWalletKeys.has(key);
    })
    .map((nft: any, i: number) => {
      const tokenIdValue = extractTokenId(nft);
      const key = `${nft?.contract?.address}-${String(tokenIdValue)}-${i}`;
      const img = getAlchemyImage(nft);
      const name = getDisplayName(nft);
      const collection = nft?.contract?.name || nft?.contract?.address;

      return (
        <div key={key} className="relative bg-gradient-card rounded-lg p-3 border border-border/50 hover:border-primary/50 transition-all duration-300">
          <button
            aria-label="Burn NFT"
            title="Burn (remove from wallet)"
            onClick={() => handleBurnWalletNft(nft?.contract?.address, tokenIdValue, key)}
            disabled={burningKeys.has(key)}
            className="absolute top-2 right-2 z-10 inline-flex items-center justify-center h-8 w-8 rounded-md bg-red-600/80 hover:bg-red-700/90 disabled:opacity-60 text-white border border-white/20 transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="w-full h-32 rounded mb-2 overflow-hidden bg-muted/40 flex items-center justify-center">
            {img ? (
              <img src={img} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-muted-foreground">No Image</span>
            )}
          </div>
          <div className="text-sm font-semibold text-foreground truncate">{name}</div>
          <div className="text-xs text-muted-foreground truncate">{collection}</div>
        </div>
      );
    })}
</div>

            )}
          </div>
        )}        {/* Empty State */}
        {filteredNFTs.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No NFTs found for this game yet
            </h3>
            <p className="text-muted-foreground">
              Play games to earn new achievements and grow your NFT collection!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNFTs;
