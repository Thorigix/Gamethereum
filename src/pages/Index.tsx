import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Trophy, Gamepad2, Sparkles, Shield, Zap, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 px-4 text-center overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Gamethereum
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover, showcase, and grow your gaming achievements as NFTs.
            Each achievement is a unique proof of your skills in the gaming world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="gaming"
              size="xl"
              onClick={() => navigate('/my-nfts')}
              className="gap-3"
            >
              <Gamepad2 className="h-6 w-6" />
              View My NFT Collection
            </Button>
            <Button
              variant="secondary"
              size="xl"
              onClick={() => navigate('/platform')}
              className="gap-3"
            >
              <Users className="h-5 w-5" />
              Explore Platform
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Features
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to manage and showcase your gaming achievements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-card rounded-2xl p-8 border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:scale-105">
              <div className="bg-gradient-primary p-4 rounded-xl w-fit mb-6 group-hover:shadow-neon transition-all duration-300">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">NFT Collection</h3>
              <p className="text-muted-foreground">
                Collect and organize all your gaming achievements in one place. Each NFT is unique and verifiable.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-card rounded-2xl p-8 border border-secondary/20 hover:border-secondary/50 transition-all duration-300 hover:shadow-neon hover:scale-105">
              <div className="bg-gradient-secondary p-4 rounded-xl w-fit mb-6 group-hover:shadow-glow transition-all duration-300">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Filter by Games</h3>
              <p className="text-muted-foreground">
                Categorize your NFTs by games and find them easily. Advanced filtering options available.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-card rounded-2xl p-8 border border-accent/20 hover:border-accent/50 transition-all duration-300 hover:shadow-card hover:scale-105">
              <div className="bg-gradient-to-r from-accent to-primary p-4 rounded-xl w-fit mb-6 group-hover:shadow-neon transition-all duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Secure Wallet Integration</h3>
              <p className="text-muted-foreground">
                Connect your wallet securely and verify your NFTs through blockchain technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Gamethereum by Numbers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">50+</div>
              <div className="text-muted-foreground">Supported Games</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">10K+</div>
              <div className="text-muted-foreground">NFT Collections</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Security Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-card rounded-3xl p-12 border border-primary/20 shadow-glow">
            <Star className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Connect your wallet and start discovering your gaming achievements in your NFT collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="gaming"
                size="xl"
                onClick={() => navigate('/my-nfts')}
                className="gap-3"
              >
                <Trophy className="h-6 w-6" />
                Go to My Collection
              </Button>
              <Button
                variant="secondary"
                size="xl"
                onClick={() => navigate('/platform')}
                className="gap-3"
              >
                <Users className="h-5 w-5" />
                Explore Platform
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
