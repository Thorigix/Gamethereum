import React, { useState, useMemo } from 'react';
import { Navigation } from '@/components/Navigation';
import { NFTCard } from '@/components/NFTCard';
import { GameFilter } from '@/components/GameFilter';
import { mockNFTs, mockGames } from '@/data/mockNFTs';
import { Users, TrendingUp, Eye, Star } from 'lucide-react';

// Generate additional NFTs for other users
const generateUserNFTs = () => {
  const userNames = ['CryptoGamer', 'NFTHunter', 'GameMaster', 'PixelWarrior', 'LegendSeeker', 'ProGamer', 'AchievementKing'];
  const allNFTs = [];

  userNames.forEach(userName => {
    mockNFTs.forEach((nft, index) => {
      allNFTs.push({
        ...nft,
        id: `${userName}-${nft.id}`,
        owner: userName,
        views: Math.floor(Math.random() * 1000) + 50,
        likes: Math.floor(Math.random() * 100) + 10,
      });
    });
  });

  return allNFTs.sort(() => Math.random() - 0.5);
};

const Platform = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');

  const allUserNFTs = useMemo(() => generateUserNFTs(), []);

  const filteredNFTs = useMemo(() => {
    let filtered = allUserNFTs;

    if (selectedGame) {
      filtered = filtered.filter(nft =>
        mockGames.find(game => game.id === selectedGame)?.name === nft.game
      );
    }

    // Sort NFTs
    switch (sortBy) {
      case 'popular':
        return filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case 'trending':
        return filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
      default:
        return filtered.sort((a, b) => new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime());
    }
  }, [allUserNFTs, selectedGame, sortBy]);

  const totalNFTs = allUserNFTs.length;
  const uniqueOwners = new Set(allUserNFTs.map(nft => nft.owner)).size;
  const totalViews = allUserNFTs.reduce((sum, nft) => sum + (nft.views || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              NFT Platform
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover other players' NFT collections. View the most popular achievements and be part of the gaming community.
          </p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-card rounded-xl p-6 border border-primary/20 text-center hover:shadow-glow transition-all duration-300">
            <Users className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{uniqueOwners}</div>
            <div className="text-muted-foreground">Active Players</div>
          </div>
          <div className="bg-gradient-card rounded-xl p-6 border border-secondary/20 text-center hover:shadow-neon transition-all duration-300">
            <TrendingUp className="h-8 w-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{totalNFTs}</div>
            <div className="text-muted-foreground">Platform NFTs</div>
          </div>
          <div className="bg-gradient-card rounded-xl p-6 border border-accent/20 text-center hover:shadow-card transition-all duration-300">
            <Eye className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{totalViews.toLocaleString()}</div>
            <div className="text-muted-foreground">Total Views</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Filter by Games</h2>
            <GameFilter
              games={mockGames}
              selectedGame={selectedGame}
              onGameSelect={setSelectedGame}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Sort</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setSortBy('newest')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${sortBy === 'newest'
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'bg-gradient-card text-foreground hover:bg-primary/20'
                  }`}
              >
                Newest
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${sortBy === 'popular'
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'bg-gradient-card text-foreground hover:bg-primary/20'
                  }`}
              >
                Most Popular
              </button>
              <button
                onClick={() => setSortBy('trending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${sortBy === 'trending'
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'bg-gradient-card text-foreground hover:bg-primary/20'
                  }`}
              >
                Trending
              </button>
            </div>
          </div>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {filteredNFTs.map((nft) => (
            <div key={nft.id} className="relative">
              <NFTCard nft={nft} />
              {/* Owner and Stats */}
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">@{nft.owner}</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {nft.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      {nft.likes}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNFTs.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No NFTs found with these filters
            </h3>
            <p className="text-muted-foreground">
              Try different game filters to discover more NFTs!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Platform;
