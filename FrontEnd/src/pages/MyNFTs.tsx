import React, { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { NFTCard } from '@/components/NFTCard';
import { GameFilter } from '@/components/GameFilter';
import { mockNFTs, mockGames } from '@/data/mockNFTs';
import { Trophy, Sparkles, Star, Gamepad2 } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

const MyNFTs = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const { isConnected, nfts: walletNfts } = useWallet();

  const filteredNFTs = useMemo(() => {
    if (!selectedGame) return mockNFTs;
    return mockNFTs.filter(nft =>
      mockGames.find(game => game.id === selectedGame)?.name === nft.game
    );
  }, [selectedGame]);

  const totalNFTs = mockNFTs.length;
  const uniqueGames = mockGames.length;
  const legendaryCount = mockNFTs.filter(nft => nft.rarity === 'legendary').length;

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
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>

        {/* Wallet NFTs Section */}
        {isConnected && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">NFTs from Your Wallet</h2>
            {walletNfts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Trophy className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  No NFTs found in your wallet
                </h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Connect your wallet and start collecting gaming achievements as NFTs!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {walletNfts.map((nft) => (
                  <div key={nft.id || nft.token_id} className="bg-gradient-card rounded-lg p-3 border border-border/50 hover:border-primary/50 transition-all duration-300">
                    <img
                      src={nft.image_url || nft.image_preview_url}
                      alt={nft.name}
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <div className="text-sm font-semibold text-foreground truncate">{nft.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{nft.collection?.name}</div>
                  </div>
                ))}
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
