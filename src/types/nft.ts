export interface GameNFT {
  id: string;
  name: string;
  description: string;
  image: string;
  game: string;
  gameIcon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  achievedAt: string;
  blockchain: string;
  tokenId: string;
}

export interface Game {
  id: string;
  name: string;
  icon: string;
  nftCount: number;
}