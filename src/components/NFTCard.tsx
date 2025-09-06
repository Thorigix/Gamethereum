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
    <div className={`group relative overflow-hidden rounded-xl bg-gradient-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-card hover:scale-105 ${className}`}>
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
        <div className="absolute top-3 left-3 bg-gradient-card/90 backdrop-blur-sm rounded-lg p-2 border border-primary/20">
          <span className="text-lg" role="img" aria-label={nft.game}>
            {nft.gameIcon}
          </span>
        </div>
        
        {/* Rarity Badge */}
        <div className="absolute top-3 right-3">
          <Badge className={`${rarity.color} ${rarity.glow} capitalize font-semibold`}>
            {nft.rarity}
          </Badge>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
            {nft.name}
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            {nft.game}
          </p>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {nft.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(nft.achievedAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {nft.blockchain}
          </div>
        </div>
        
        {/* Hover Effect */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </div>
    </div>
  );
};