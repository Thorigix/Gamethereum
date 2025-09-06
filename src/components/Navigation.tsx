import React from 'react';
import { WalletConnection } from './WalletConnection';
import { Trophy, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ className }) => {
  return (
    <nav className={`sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl ${className}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-primary">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
              GameNFT
            </h1>
            <p className="text-xs text-muted-foreground">Achievement Showcase</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="gap-2">
            <Gamepad2 className="h-4 w-4" />
            NFT'lerim
          </Button>
        </div>

        {/* Wallet Connection */}
        <WalletConnection />
      </div>
    </nav>
  );
};