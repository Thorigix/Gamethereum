import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { Trophy, Play, RotateCcw, Wallet } from 'lucide-react';

interface GameObject {
	x: number;
	y: number;
	width: number;
	height: number;
}

const DinoGame = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number>();
	const dinoImageRef = useRef<HTMLImageElement>(null);
	const cactusImageRef = useRef<HTMLImageElement>(null);
	const { isConnected, walletAddress, connectWallet } = useWallet();

	const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameOver'>('ready');
	const [score, setScore] = useState(0);
	const [highScore, setHighScore] = useState(0);
	const [isJumping, setIsJumping] = useState(false);

	// Game objects
	const [dino, setDino] = useState<GameObject>({ x: 50, y: 150, width: 40, height: 40 });
	const [cacti, setCacti] = useState<GameObject[]>([]);
	const [gameSpeed, setGameSpeed] = useState(3);

	// Physics constants
	const GRAVITY = 0.8;
	const JUMP_FORCE = -15;
	const GROUND_Y = 150;
	const CANVAS_WIDTH = 800;
	const CANVAS_HEIGHT = 300;

	const [velocity, setVelocity] = useState(0);

	// Load images
	useEffect(() => {
		const dinoImage = new Image();
		const cactusImage = new Image();

		// Public klasöründeki resimler
		dinoImage.src = '/dino.png';
		cactusImage.src = '/cactus.png';

		dinoImage.onload = () => {
			dinoImageRef.current = dinoImage;
			console.log('Dino image loaded successfully');
		};

		cactusImage.onload = () => {
			cactusImageRef.current = cactusImage;
			console.log('Cactus image loaded successfully');
		};

		dinoImage.onerror = () => {
			console.error('Failed to load dino image');
		};

		cactusImage.onerror = () => {
			console.error('Failed to load cactus image');
		};
	}, []);

	// Initialize game
	const initGame = useCallback(() => {
		setDino({ x: 50, y: GROUND_Y, width: 40, height: 40 });
		setCacti([]);
		setScore(0);
		setGameSpeed(3);
		setVelocity(0);
		setIsJumping(false);
	}, []);

	// Jump function
	const jump = useCallback(() => {
		if (!isJumping && gameState === 'playing') {
			setVelocity(JUMP_FORCE);
			setIsJumping(true);
		}
	}, [isJumping, gameState]);

	// Handle keypress
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.code === 'Space' || e.key === ' ') {
				e.preventDefault();
				if (!isConnected) return; // Don't allow game if wallet not connected
				if (gameState === 'ready') {
					setGameState('playing');
				} else if (gameState === 'playing') {
					jump();
				}
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, [gameState, jump, isConnected]);

	// Game loop
	useEffect(() => {
		if (gameState !== 'playing') return;

		const gameLoop = () => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			// Clear canvas with white background
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

			// Update dino physics
			setDino(prevDino => {
				let newY = prevDino.y + velocity;
				let newVelocity = velocity + GRAVITY;
				let newIsJumping = isJumping;

				// Ground collision
				if (newY >= GROUND_Y) {
					newY = GROUND_Y;
					newVelocity = 0;
					newIsJumping = false;
				}

				setVelocity(newVelocity);
				setIsJumping(newIsJumping);

				return { ...prevDino, y: newY };
			});

			// Update cacti
			setCacti(prevCacti => {
				let newCacti = prevCacti.map(cactus => ({
					...cactus,
					x: cactus.x - gameSpeed
				})).filter(cactus => cactus.x + cactus.width > 0);

				// Add new cactus
				if (newCacti.length === 0 || newCacti[newCacti.length - 1].x < CANVAS_WIDTH - 200) {
					if (Math.random() < 0.02) {
						newCacti.push({
							x: CANVAS_WIDTH,
							y: GROUND_Y,
							width: 20,
							height: 40
						});
					}
				}

				return newCacti;
			});

			// Check collisions
			setCacti(currentCacti => {
				const collision = currentCacti.some(cactus =>
					dino.x < cactus.x + cactus.width &&
					dino.x + dino.width > cactus.x &&
					dino.y < cactus.y + cactus.height &&
					dino.y + dino.height > cactus.y
				);

				if (collision) {
					setGameState('gameOver');
					if (score > highScore) {
						setHighScore(score);
					}
				}

				return currentCacti;
			});

			// Update score
			setScore(prev => prev + 1);

			// Increase speed gradually
			setGameSpeed(prev => prev + 0.001);

			// Draw ground line
			ctx.strokeStyle = '#333333';
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(0, GROUND_Y + 40);
			ctx.lineTo(CANVAS_WIDTH, GROUND_Y + 40);
			ctx.stroke();

			// Draw dino
			if (dinoImageRef.current) {
				ctx.drawImage(dinoImageRef.current, dino.x, dino.y, dino.width, dino.height);
			} else {
				// Fallback rectangle
				ctx.fillStyle = '#666666';
				ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
			}

			// Draw cacti
			cacti.forEach(cactus => {
				if (cactusImageRef.current) {
					ctx.drawImage(cactusImageRef.current, cactus.x, cactus.y, cactus.width, cactus.height);
				} else {
					// Fallback rectangle
					ctx.fillStyle = '#228B22';
					ctx.fillRect(cactus.x, cactus.y, cactus.width, cactus.height);
				}
			});

			animationRef.current = requestAnimationFrame(gameLoop);
		};

		animationRef.current = requestAnimationFrame(gameLoop);

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [gameState, dino, cacti, velocity, isJumping, gameSpeed, score, highScore]);

	const startGame = () => {
		if (!isConnected) return; // Don't allow game if wallet not connected
		initGame();
		setGameState('playing');
	};

	const resetGame = () => {
		initGame();
		setGameState('ready');
	};

	return (
		<div className="min-h-screen bg-gradient-hero">
			<Navigation />

			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
						🦕 Chrome Dino Game
					</h1>
					<p className="text-muted-foreground text-lg">
						Press SPACE to jump and avoid cacti! Connect your wallet to play!
					</p>
				</div>

				{/* Game Stats */}
				<div className="flex justify-center gap-6 mb-6">
					<div className="bg-gradient-card rounded-lg p-4 border border-primary/20">
						<div className="text-sm text-muted-foreground">Score</div>
						<div className="text-2xl font-bold text-primary">{score}</div>
					</div>
					<div className="bg-gradient-card rounded-lg p-4 border border-secondary/20">
						<div className="text-sm text-muted-foreground">High Score</div>
						<div className="text-2xl font-bold text-secondary">{highScore}</div>
					</div>
				</div>

				{/* Game Canvas */}
				<div className="flex justify-center mb-6">
					<div className="relative bg-white rounded-lg p-4 border-2 border-primary/30 shadow-lg">
						<canvas
							ref={canvasRef}
							width={CANVAS_WIDTH}
							height={CANVAS_HEIGHT}
							className={`block rounded border-2 border-border/50 ${!isConnected ? 'blur-sm' : ''}`}
							style={{ backgroundColor: '#ffffff' }}
						/>

						{/* Wallet Connection Required Overlay */}
						{!isConnected && (
							<div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded">
								<div className="text-center text-white">
									<Wallet className="h-12 w-12 mx-auto mb-4 text-primary" />
									<h2 className="text-2xl font-bold mb-4">Connect Wallet to Play</h2>
									<p className="mb-4">You need to connect your wallet to start playing!</p>
									<Button onClick={connectWallet} className="gap-2">
										<Wallet className="h-4 w-4" />
										Connect Wallet
									</Button>
								</div>
							</div>
						)}

						{/* Game Start Overlay */}
						{isConnected && gameState === 'ready' && (
							<div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded">
								<div className="text-center text-white">
									<h2 className="text-3xl font-bold mb-4">Ready to Play?</h2>
									<p className="mb-4">Press SPACE to jump over cacti!</p>
									<Button onClick={startGame} className="gap-2">
										<Play className="h-4 w-4" />
										Start Game
									</Button>
								</div>
							</div>
						)}

						{/* Game Over Overlay */}
						{gameState === 'gameOver' && (
							<div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded">
								<div className="text-center text-white max-w-md">
									<h2 className="text-3xl font-bold mb-4">💥 Game Over!</h2>
									<p className="mb-4">Score: {score}</p>
									{score === highScore && score > 0 && (
										<p className="mb-4 text-yellow-400">🏆 New High Score!</p>
									)}
									<Button onClick={resetGame} className="gap-2">
										<RotateCcw className="h-4 w-4" />
										Play Again
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* Instructions */}
				<div className="text-center max-w-2xl mx-auto">
					<div className="bg-gradient-card rounded-lg p-6 border border-border/50">
						<h3 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
							<Trophy className="h-5 w-5 text-yellow-500" />
							How to Play
						</h3>
						<div className="space-y-2 text-muted-foreground">
							<p>🦕 You are a dinosaur running through the desert</p>
							<p>⌨️ Press SPACE to jump over cacti</p>
							<p>🌵 Don't touch the cacti or you'll crash!</p>
							<p>🏆 Your score increases the longer you survive</p>
							<p>💰 Connect your wallet to start playing</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DinoGame;
