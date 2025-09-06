import { GameNFT, Game } from "@/types/nft";

// Import NFT images
import firstVictoryImg from "@/assets/first-victory-nft.jpg";
import masterAssassinImg from "@/assets/master-assassin-nft.jpg";
import speedDemonImg from "@/assets/speed-demon-nft.jpg";
import legendaryChampionImg from "@/assets/legendary-champion-nft.jpg";
import shadowWalkerImg from "@/assets/shadow-walker-nft.jpg";
import perfectLapImg from "@/assets/perfect-lap-nft.jpg";

export const mockNFTs: GameNFT[] = [
  {
    id: "1",
    name: "First Victory",
    description: "Won your first match in competitive mode",
    image: firstVictoryImg,
    game: "Counter-Strike 2",
    rarity: "common",
    achievedAt: "2024-01-15",
    blockchain: "Ethereum",
    tokenId: "0x1234"
  },
  {
    id: "2",
    name: "Master Builder",
    description: "Built your first castle with over 1000 blocks",
    image: masterAssassinImg,
    game: "Minecraft",
    rarity: "epic",
    achievedAt: "2024-01-20",
    blockchain: "Polygon",
    tokenId: "0x5678"
  },
  {
    id: "3",
    name: "Portal Master",
    description: "Completed all test chambers without dying",
    image: speedDemonImg,
    game: "Portal 2",
    rarity: "rare",
    achievedAt: "2024-02-01",
    blockchain: "Ethereum",
    tokenId: "0x9abc"
  },
  {
    id: "4",
    name: "Global Elite",
    description: "Reached the highest rank in competitive matchmaking",
    image: legendaryChampionImg,
    game: "Counter-Strike 2",
    rarity: "legendary",
    achievedAt: "2024-02-10",
    blockchain: "Ethereum",
    tokenId: "0xdef0"
  },
  {
    id: "5",
    name: "Diamond Collector",
    description: "Collected over 64 diamond blocks in survival mode",
    image: shadowWalkerImg,
    game: "Minecraft",
    rarity: "legendary",
    achievedAt: "2024-02-15",
    blockchain: "Polygon",
    tokenId: "0x1111"
  },
  {
    id: "6",
    name: "Co-op Champion",
    description: "Completed all co-op chambers with a perfect score",
    image: perfectLapImg,
    game: "Portal 2",
    rarity: "epic",
    achievedAt: "2024-02-20",
    blockchain: "Ethereum",
    tokenId: "0x2222"
  }
];

export const mockGames: Game[] = [
  {
    id: "counter-strike-2",
    name: "Counter-Strike 2",
    icon: "🔫",
    nftCount: 2
  },
  {
    id: "minecraft",
    name: "Minecraft",
    icon: "⛏️",
    nftCount: 2
  },
  {
    id: "portal-2",
    name: "Portal 2",
    icon: "�",
    nftCount: 2
  }
];
