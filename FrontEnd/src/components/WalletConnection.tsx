import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Copy, Check } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';

interface WalletConnectionProps {
  className?: string;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({ className }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { isConnected, walletAddress, connectWallet, disconnectWallet } = useWallet();

  const copyAddress = async () => {
    await navigator.clipboard.writeText(walletAddress);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isConnected) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-2 bg-gradient-card rounded-lg p-2 border border-primary/20">
          <Wallet className="h-4 w-4 text-primary" />
          <span className="text-sm font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyAddress}
            className="h-6 w-6 hover:bg-primary/10"
          >
            {isCopied ? (
              <Check className="h-3 w-3 text-secondary" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={disconnectWallet}
          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="wallet"
      size="lg"
      onClick={connectWallet}
      className={className}
    >
      <Wallet className="h-5 w-5" />
      Connect Wallet
    </Button>
  );
};
