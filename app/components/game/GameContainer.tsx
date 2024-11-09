'use client';

import { useState, useEffect } from 'react';
import { Player } from './Player';
import { Parcel } from './Parcel';
import { Obstacle } from './Obstacle';
import { PostOffice } from './PostOffice';
import type { GameState, Position } from '../../types/game';
import { BackgroundMusic } from './BackgroundMusic';
import { GameBackground } from './GameBackground';

export const GameContainer = () => {
  // Adjust game boundaries for better mobile visibility
  const GAME_BOUNDS = {
    width: 400,  // Reduced from 600
    height: 350  // Reduced from 500
  };

  // Add state for container dimensions
  const [containerSize, setContainerSize] = useState({ width: 400, height: 350 });
  
  // Update container size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      const container = document.querySelector('.game-container');
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Calculate scaled positions based on container size
  const getScaledPosition = (x: number, y: number) => ({
    x: (x / GAME_BOUNDS.width) * containerSize.width,
    y: (y / GAME_BOUNDS.height) * containerSize.height,
  });

  // Generate random position within smaller bounds
  const getRandomPosition = () => {
    const baseX = Math.floor(Math.random() * (GAME_BOUNDS.width - 100)) + 50;
    const baseY = Math.floor(Math.random() * (GAME_BOUNDS.height - 100)) + 50;
    return getScaledPosition(baseX, baseY);
  };

  // Generate parcels with random positions
  const generateParcels = () => [
    { id: '1', position: getRandomPosition(), collected: false },
    { id: '2', position: getRandomPosition(), collected: false },
    { id: '3', position: getRandomPosition(), collected: false },
  ];

  // Generate obstacles with random positions
  const generateObstacles = () => [
    { id: '1', position: getRandomPosition(), type: 'cone' as const },
    { id: '2', position: getRandomPosition(), type: 'pothole' as const },
    { id: '3', position: getRandomPosition(), type: 'vehicle' as const },
  ];

  const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    level: 1,
    status: 'idle'
  });
  
  const [parcels, setParcels] = useState(generateParcels());
  const [obstacles, setObstacles] = useState(generateObstacles());
  const [isInvulnerable, setIsInvulnerable] = useState(false);
  const [hasCollectedParcels, setHasCollectedParcels] = useState(false);

  // Update post office position to be responsive
  const basePostOfficePosition = { x: 350, y: 300 };
  const postOfficePosition = getScaledPosition(
    basePostOfficePosition.x,
    basePostOfficePosition.y
  );

  const COLLECTION_RADIUS = 25; // Reduced from 40 to make collection more precise
  const PLAYER_SPEED = 3;
  const ATTRACTION_RADIUS = 80; // Reduced from 200 to make magnetic effect smaller
  const ATTRACTION_STRENGTH = 0.1; // Reduced from 0.2 to make pull gentler

  const [playerDirection, setPlayerDirection] = useState<'left' | 'right' | 'up' | 'down'>('right');

  // Function to reset level with new positions
  const resetLevel = () => {
    setParcels(generateParcels());
    setObstacles(generateObstacles());
    setPlayerPosition({ x: 50, y: 50 });
    setHasCollectedParcels(false);
  };

  const checkCollisions = (newPosition: Position) => {
    let allParcelsCollected = true;
    const newParcels = [...parcels];
    
    parcels.forEach((parcel, index) => {
      if (!parcel.collected) {
        const dx = newPosition.x - parcel.position.x;
        const dy = newPosition.y - parcel.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Only apply magnetic effect when very close
        if (distance < ATTRACTION_RADIUS && !parcel.collected) {
          newParcels[index] = {
            ...parcel,
            position: {
              x: parcel.position.x + dx * ATTRACTION_STRENGTH,
              y: parcel.position.y + dy * ATTRACTION_STRENGTH
            }
          };
        }

        // Stricter collection check
        if (distance < COLLECTION_RADIUS) {
          newParcels[index] = {
            ...parcel,
            collected: true
          };
          
          setGameState(prev => ({ ...prev, score: prev.score + 100 }));
          
          try {
            const audio = new Audio('/collect.mp3');
            audio.volume = 0.3;
            audio.play().catch(() => {});
          } catch (e) {
            console.log('Audio feedback failed:', e);
          }
        }

        if (!newParcels[index].collected) {
          allParcelsCollected = false;
        }
      }
    });

    setParcels(newParcels);
    setHasCollectedParcels(allParcelsCollected);

    // Update post office delivery check to match collection radius
    if (hasCollectedParcels) {
      const dx = newPosition.x - postOfficePosition.x;
      const dy = newPosition.y - postOfficePosition.y;
      const distanceToPostOffice = Math.sqrt(dx * dx + dy * dy);
      
      if (distanceToPostOffice < COLLECTION_RADIUS) {
        setGameState(prev => ({
          ...prev,
          score: prev.score + 500,
          level: prev.level + 1,
        }));
        resetLevel();
        return;
      }
    }

    // Check obstacle collisions
    if (!isInvulnerable) {
      for (const obstacle of obstacles) {
        if (Math.abs(newPosition.x - obstacle.position.x) < 30 && 
            Math.abs(newPosition.y - obstacle.position.y) < 30) {
          setGameState(prev => ({
            ...prev,
            lives: prev.lives - 1,
            status: prev.lives <= 1 ? 'gameOver' : prev.status
          }));
          
          setIsInvulnerable(true);
          setTimeout(() => {
            setIsInvulnerable(false);
          }, 1000);
          
          break;
        }
      }
    }
  };

  // Add visual indicator for nearby parcels with improved visibility
  const getNearbyParcels = () => {
    return parcels.filter(parcel => {
      if (parcel.collected) return false;
      const dx = playerPosition.x - parcel.position.x;
      const dy = playerPosition.y - parcel.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < ATTRACTION_RADIUS; // Show indicator when in attraction range
    });
  };

  // Handle direction changes with arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.status !== 'playing') return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          setPlayerDirection('up');
          break;
        case 'ArrowDown':
        case 's':
          setPlayerDirection('down');
          break;
        case 'ArrowLeft':
        case 'a':
          setPlayerDirection('left');
          break;
        case 'ArrowRight':
        case 'd':
          setPlayerDirection('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status]);

  // Continuous automatic movement
  useEffect(() => {
    if (gameState.status !== 'playing') return;

    const moveInterval = setInterval(() => {
      const newPosition = { ...playerPosition };

      // Move in the current direction
      switch (playerDirection) {
        case 'up':
          newPosition.y = Math.max(0, playerPosition.y - PLAYER_SPEED);
          break;
        case 'down':
          newPosition.y = Math.min(GAME_BOUNDS.height, playerPosition.y + PLAYER_SPEED);
          break;
        case 'left':
          newPosition.x = Math.max(0, playerPosition.x - PLAYER_SPEED);
          break;
        case 'right':
          newPosition.x = Math.min(GAME_BOUNDS.width, playerPosition.x + PLAYER_SPEED);
          break;
      }

      // Update boundary checks
      if (newPosition.x <= 0) setPlayerDirection('right');
      if (newPosition.x >= GAME_BOUNDS.width) setPlayerDirection('left');
      if (newPosition.y <= 0) setPlayerDirection('down');
      if (newPosition.y >= GAME_BOUNDS.height) setPlayerDirection('up');

      checkCollisions(newPosition);
      setPlayerPosition(newPosition);
    }, 16);

    return () => clearInterval(moveInterval);
  }, [gameState.status, playerPosition, playerDirection]);

  // Add state for orientation
  const [isPortrait, setIsPortrait] = useState(false);
  
  // Check orientation on mount and window resize
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  return (
    <div 
      className="relative w-full aspect-[4/3] max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg game-container"
    >
      <GameBackground />
      
      <div className="absolute inset-0 bg-black/10" />
      
      <BackgroundMusic isPlaying={gameState.status === 'playing'} />
      
      {/* Game UI */}
      <div className="absolute top-4 left-4 right-4 flex justify-between text-white">
        <div>Score: {gameState.score}</div>
        <div>Lives: {'❤️'.repeat(gameState.lives)}</div>
        <div>Level: {gameState.level}</div>
      </div>

      {/* Game Instructions */}
      {gameState.status === 'playing' && (
        <div className="absolute top-16 left-4 right-4 text-center text-white text-sm">
          {!hasCollectedParcels 
            ? `Collect all parcels! 📦 (${parcels.filter(p => !p.collected).length} remaining)`
            : "Deliver to the Post Office! 🏤"}
        </div>
      )}

      {/* Enhanced Parcel Collection Indicators */}
      {getNearbyParcels().map(parcel => (
        <div
          key={`indicator-${parcel.id}`}
          className="absolute w-40 h-40 animate-pulse"
          style={{
            left: `${parcel.position.x}px`,
            top: `${parcel.position.y}px`,
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0) 70%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      ))}

      {/* Game Elements */}
      <Player 
        position={playerPosition} 
        direction={playerDirection}
        isInvulnerable={isInvulnerable} 
      />
      <PostOffice 
        position={postOfficePosition}
        containerSize={containerSize}
      />
      {parcels.map(parcel => (
        <Parcel 
          key={parcel.id} 
          {...parcel}
          isNearby={getNearbyParcels().some(p => p.id === parcel.id)}
        />
      ))}
      {obstacles.map(obstacle => (
        <Obstacle key={obstacle.id} {...obstacle} />
      ))}
      
      {/* Game States */}
      {gameState.status === 'idle' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
          <h2 className="text-2xl text-white mb-8">
            Use arrow keys or WASD to change direction!
          </h2>
          <button 
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 
                       text-white text-xl font-bold rounded-lg 
                       hover:from-blue-600 hover:to-purple-600 
                       transform transition-all hover:scale-105"
            onClick={() => setGameState(prev => ({ ...prev, status: 'playing' }))}
          >
            Start Game
          </button>
        </div>
      )}

      {gameState.status === 'gameOver' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
          <h2 className="text-4xl text-white mb-4">Game Over!</h2>
          <p className="text-2xl text-white mb-8">Final Score: {gameState.score}</p>
          <button 
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 
                       text-white text-xl font-bold rounded-lg 
                       hover:from-blue-600 hover:to-purple-600 
                       transform transition-all hover:scale-105"
            onClick={() => {
              setGameState({
                score: 0,
                lives: 3,
                level: 1,
                status: 'playing'
              });
              resetLevel(); // Reset level with new positions
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Landscape mode recommendation */}
      {isPortrait && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto text-center transform transition-all animate-fade-in">
            <div className="mb-4 text-4xl animate-bounce">📱↔️</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              Rotate for Better Experience
            </h3>
            <p className="text-gray-600 mb-4">
              This game is best played in landscape mode. Please rotate your device for the optimal gaming experience!
            </p>
            <button
              onClick={() => setIsPortrait(false)}
              className="bg-blue-500 text-white px-6 py-2 rounded-full
                         hover:bg-blue-600 transition-colors
                         shadow-lg hover:shadow-xl"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 