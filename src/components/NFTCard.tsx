import React from 'react';
import { GameNFT } from '@/types/nft';
import { Badge } from '@/components/ui/badge';
import { Calendar, Shield, Zap } from 'lucide-react';

interface NFTCardProps {
  nft: GameNFT;
  className?: string;
}

const rarityConfig = {
  common: { color: 'bg-muted text-muted-foreground', glow: '' },
  rare: { color: 'bg-primary text-primary-foreground', glow: 'shadow-glow' },
  epic: { color: 'bg-accent text-accent-foreground', glow: 'shadow-neon' },
  legendary: { color: 'bg-gradient-secondary text-white', glow: 'shadow-glow shadow-neon' },
};

export const NFTCard: React.FC<NFTCardProps> = ({ nft, className }) => {
  const rarity = rarityConfig[nft.rarity];

  return (
    <div className={`group relative overflow-hidden rounded-lg bg-gradient-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-card hover:scale-105 ${className}`}>
      {/* Rarity Glow Effect */}
      <div className={`absolute inset-0 ${rarity.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

      {/* NFT Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Game Icon Overlay */}
        <div className="absolute top-2 left-2 bg-gradient-card/90 backdrop-blur-sm rounded-md p-1 border border-primary/20">
          <span className="text-sm" role="img" aria-label={nft.game}>
            {nft.gameIcon}
          </span>
        </div>

        {/* Rarity Badge */}
        <div className="absolute top-2 right-2">
          <Badge className={`${rarity.color} ${rarity.glow} capitalize text-xs font-semibold px-2 py-1`}>
            {nft.rarity}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div>
          <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {nft.name}
          </h3>
          <p className="text-xs text-muted-foreground font-medium line-clamp-1">
            {nft.game}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span className="truncate">{new Date(nft.achievedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </div>
    </div>
  );
};
