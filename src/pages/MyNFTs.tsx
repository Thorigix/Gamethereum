import React, { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { NFTCard } from '@/components/NFTCard';
import { GameFilter } from '@/components/GameFilter';
import { mockNFTs, mockGames } from '@/data/mockNFTs';
import { Trophy, Sparkles, Star } from 'lucide-react';

const MyNFTs = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

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
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              NFT Koleksiyonum
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Oyun başarımlarınızı NFT olarak keşfedin ve sergileyin. Her başarım, oyun dünyasındaki yeteneklerinizin benzersiz bir kanıtıdır.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-card rounded-xl p-6 border border-primary/20 text-center hover:shadow-glow transition-all duration-300">
            <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{totalNFTs}</div>
            <div className="text-muted-foreground">Toplam NFT</div>
          </div>
          <div className="bg-gradient-card rounded-xl p-6 border border-secondary/20 text-center hover:shadow-neon transition-all duration-300">
            <Sparkles className="h-8 w-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{uniqueGames}</div>
            <div className="text-muted-foreground">Farklı Oyun</div>
          </div>
          <div className="bg-gradient-card rounded-xl p-6 border border-accent/20 text-center hover:shadow-card transition-all duration-300">
            <Star className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{legendaryCount}</div>
            <div className="text-muted-foreground">Efsanevi NFT</div>
          </div>
        </div>

        {/* Game Filter */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Oyunlara Göre Filtrele</h2>
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

        {/* Empty State */}
        {filteredNFTs.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              Bu oyunda henüz NFT'niz yok
            </h3>
            <p className="text-muted-foreground">
              Oyunları oynayarak yeni başarımlar kazanın ve NFT koleksiyonunuzu büyütün!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNFTs;