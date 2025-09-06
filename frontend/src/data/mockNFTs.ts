import { GameNFT, Game } from "@/types/nft";

// Import NFT images
import cs2Img from "@/assets/cs2.png";
import overcllockerImg from "@/assets/Achievement_Overclocker.PNG.png";
import doorPrizeImg from "@/assets/Achievement_Door_Prize.PNG.png";
import minecraftImg from "@/assets/92a5450b2a48e64c2d7a1b43a43d5e75.jpg";

export const mockNFTs: GameNFT[] = [
  {
    id: "1",
    name: "First Victory",
    description: "Won your first match in competitive mode",
    image: cs2Img,
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
    image: minecraftImg,
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
    image: doorPrizeImg,
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
    image: cs2Img,
    game: "Counter-Strike 2",
    rarity: "legendary",
    achievedAt: "2024-02-10",
    blockchain: "Ethereum",
    tokenId: "0xdef0"
  },
  {
    id: "5",
    name: "Free The End",
    description: "Collected over 64 diamond blocks in survival mode",
    image: minecraftImg,
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
    image: overcllockerImg,
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
