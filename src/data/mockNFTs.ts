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
    game: "Cyber Strike",
    gameIcon: "⚡",
    rarity: "common",
    achievedAt: "2024-01-15",
    blockchain: "Ethereum",
    tokenId: "0x1234"
  },
  {
    id: "2",
    name: "Master Assassin",
    description: "Eliminated 100 enemies with stealth kills",
    image: masterAssassinImg,
    game: "Shadow Realm",
    gameIcon: "🗡️",
    rarity: "epic",
    achievedAt: "2024-01-20",
    blockchain: "Polygon",
    tokenId: "0x5678"
  },
  {
    id: "3",
    name: "Speed Demon",
    description: "Completed a lap in under 1 minute",
    image: speedDemonImg,
    game: "Neon Racer",
    gameIcon: "🏎️",
    rarity: "rare",
    achievedAt: "2024-02-01",
    blockchain: "Ethereum",
    tokenId: "0x9abc"
  },
  {
    id: "4",
    name: "Legendary Champion",
    description: "Reached the highest rank in ranked mode",
    image: legendaryChampionImg,
    game: "Cyber Strike",
    gameIcon: "⚡",
    rarity: "legendary",
    achievedAt: "2024-02-10",
    blockchain: "Ethereum",
    tokenId: "0xdef0"
  },
  {
    id: "5",
    name: "Shadow Walker",
    description: "Completed the game without being detected",
    image: shadowWalkerImg,
    game: "Shadow Realm",
    gameIcon: "🗡️",
    rarity: "legendary",
    achievedAt: "2024-02-15",
    blockchain: "Polygon",
    tokenId: "0x1111"
  },
  {
    id: "6",
    name: "Perfect Lap",
    description: "Completed a perfect lap with no mistakes",
    image: perfectLapImg,
    game: "Neon Racer",
    gameIcon: "🏎️",
    rarity: "epic",
    achievedAt: "2024-02-20",
    blockchain: "Ethereum",
    tokenId: "0x2222"
  }
];

export const mockGames: Game[] = [
  {
    id: "cyber-strike",
    name: "Cyber Strike",
    icon: "⚡",
    nftCount: 2
  },
  {
    id: "shadow-realm",
    name: "Shadow Realm",
    icon: "🗡️",
    nftCount: 2
  },
  {
    id: "neon-racer",
    name: "Neon Racer",
    icon: "🏎️",
    nftCount: 2
  }
];