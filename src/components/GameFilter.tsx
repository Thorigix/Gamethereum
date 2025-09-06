import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Game } from '@/types/nft';

interface GameFilterProps {
  games: Game[];
  selectedGame: string | null;
  onGameSelect: (gameId: string | null) => void;
  className?: string;
}

export const GameFilter: React.FC<GameFilterProps> = ({
  games,
  selectedGame,
  onGameSelect,
  className
}) => {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Button
        variant={selectedGame === null ? "gaming" : "ghost"}
        size="sm"
        onClick={() => onGameSelect(null)}
        className="gap-2"
      >
        Tüm Oyunlar
        <Badge variant="secondary" className="ml-1">
          {games.reduce((total, game) => total + game.nftCount, 0)}
        </Badge>
      </Button>
      
      {games.map((game) => (
        <Button
          key={game.id}
          variant={selectedGame === game.id ? "gaming" : "ghost"}
          size="sm"
          onClick={() => onGameSelect(game.id)}
          className="gap-2"
        >
          <span role="img" aria-label={game.name}>
            {game.icon}
          </span>
          {game.name}
          <Badge variant="secondary" className="ml-1">
            {game.nftCount}
          </Badge>
        </Button>
      ))}
    </div>
  );
};