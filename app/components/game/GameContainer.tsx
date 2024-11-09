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
  // Generate random position within game bounds
  const getRandomPosition = () => ({
    x: Math.floor(Math.random() * 600) + 100, // Between 100 and 700
    y: Math.floor(Math.random() * 400) + 100, // Between 100 and 500
  });

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
  const postOfficePosition = { x: 700, y: 550 };

  const PLAYER_SPEED = 3; // Pixels per frame
  const [playerDirection, setPlayerDirection] = useState<'left' | 'right' | 'up' | 'down'>('right');

  // Function to reset level with new positions
  const resetLevel = () => {
    setParcels(generateParcels());
    setObstacles(generateObstacles());
    setPlayerPosition({ x: 50, y: 50 });
    setHasCollectedParcels(false);
  };

  const checkCollisions = (newPosition: Position) => {
    // Check parcel collection
    let allParcelsCollected = true;
    parcels.forEach((parcel, index) => {
      if (!parcel.collected && 
          Math.abs(newPosition.x - parcel.position.x) < 30 && 
          Math.abs(newPosition.y - parcel.position.y) < 30) {
        const newParcels = [...parcels];
        newParcels[index].collected = true;
        setParcels(newParcels);
        setGameState(prev => ({ ...prev, score: prev.score + 100 }));
      }
      if (!parcel.collected) allParcelsCollected = false;
    });
    setHasCollectedParcels(allParcelsCollected);

    // Check post office delivery
    if (hasCollectedParcels &&
        Math.abs(newPosition.x - postOfficePosition.x) < 40 && 
        Math.abs(newPosition.y - postOfficePosition.y) < 40) {
      // Level complete!
      setGameState(prev => ({
        ...prev,
        score: prev.score + 500,
        level: prev.level + 1,
      }));
      resetLevel(); // Reset level with new positions
      return;
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
      let newPosition = { ...playerPosition };

      // Move in the current direction
      switch (playerDirection) {
        case 'up':
          newPosition.y = Math.max(0, playerPosition.y - PLAYER_SPEED);
          break;
        case 'down':
          newPosition.y = Math.min(540, playerPosition.y + PLAYER_SPEED);
          break;
        case 'left':
          newPosition.x = Math.max(0, playerPosition.x - PLAYER_SPEED);
          break;
        case 'right':
          newPosition.x = Math.min(740, playerPosition.x + PLAYER_SPEED);
          break;
      }

      // Handle wall collisions by changing direction
      if (newPosition.x <= 0) setPlayerDirection('right');
      if (newPosition.x >= 740) setPlayerDirection('left');
      if (newPosition.y <= 0) setPlayerDirection('down');
      if (newPosition.y >= 540) setPlayerDirection('up');

      checkCollisions(newPosition);
      setPlayerPosition(newPosition);
    }, 16); // ~60fps

    return () => clearInterval(moveInterval);
  }, [gameState.status, playerPosition, playerDirection]);

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
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
            ? "Collect all parcels! 📦" 
            : "Deliver to the Post Office! 🏤"}
        </div>
      )}

      {/* Game Elements */}
      <Player 
        position={playerPosition} 
        direction={playerDirection}
        isInvulnerable={isInvulnerable} 
      />
      <PostOffice position={postOfficePosition} />
      {parcels.map(parcel => (
        <Parcel key={parcel.id} {...parcel} />
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
    </div>
  );
}; 