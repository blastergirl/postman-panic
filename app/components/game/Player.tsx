import { useRef, useEffect, useState } from 'react';

interface PlayerProps {
  position: { x: number; y: number };
  direction?: 'left' | 'right' | 'up' | 'down';
  onUpdate?: (position: { x: number; y: number }) => void;
  isInvulnerable?: boolean;
}

export const Player = ({ position, direction = 'right', onUpdate, isInvulnerable }: PlayerProps) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const [walking, setWalking] = useState(true);

  // Animate walking
  useEffect(() => {
    const interval = setInterval(() => {
      setWalking(prev => !prev);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Calculate rotation based on direction
  const getRotation = () => {
    switch (direction) {
      case 'up': return -90;
      case 'down': return 90;
      case 'left': return 180;
      default: return 0;
    }
  };

  return (
    <div 
      ref={playerRef}
      className={`absolute w-20 h-24 transform -translate-y-1/2 -translate-x-1/2
                 ${isInvulnerable ? 'animate-pulse opacity-70' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: 'all 0.1s linear',
        transform: `translate(-50%, -50%) rotate(${getRotation()}deg)`,
      }}
    >
      <svg
        viewBox="0 0 100 120"
        className={`w-full h-full ${isInvulnerable ? 'filter brightness-150' : ''}`}
      >
        {/* Legs */}
        <path
          d={`M35 ${walking ? 85 : 80} L35 100`}
          stroke="#000066"
          strokeWidth="8"
          fill="none"
        />
        <path
          d={`M65 ${walking ? 80 : 85} L65 100`}
          stroke="#000066"
          strokeWidth="8"
          fill="none"
        />
        
        {/* Boots */}
        <rect x="30" y="95" width="12" height="8" fill="black" />
        <rect x="60" y="95" width="12" height="8" fill="black" />

        {/* Body - Blue Uniform */}
        <rect x="30" y="40" width="40" height="45" fill="#000099" rx="5" />
        <rect x="25" y="40" width="50" height="20" fill="#000099" rx="5" />
        
        {/* Belt */}
        <rect x="30" y="65" width="40" height="5" fill="brown" />

        {/* Arms */}
        <path
          d={`M25 45 L15 ${walking ? 60 : 55}`}
          stroke="#000099"
          strokeWidth="8"
          fill="none"
        />
        <path
          d={`M75 45 L85 ${walking ? 55 : 60}`}
          stroke="#000099"
          strokeWidth="8"
          fill="none"
        />
        
        {/* Hands */}
        <circle cx="15" cy={walking ? 60 : 55} r="4" fill="#FFC0CB" />
        <circle cx="85" cy={walking ? 55 : 60} r="4" fill="#FFC0CB" />

        {/* Neck */}
        <rect x="45" y="30" width="10" height="10" fill="#FFC0CB" />

        {/* Head */}
        <circle cx="50" cy="25" r="15" fill="#FFC0CB" />
        
        {/* Hat */}
        <path d="M30 25 Q50 10 70 25" fill="#000099" />
        <rect x="30" y="20" width="40" height="8" fill="#000099" rx="2" />
        <circle cx="50" cy="15" r="3" fill="gold" /> {/* Badge */}

        {/* Face */}
        <circle cx="45" cy="22" r="2" fill="black" /> {/* Left eye */}
        <circle cx="55" cy="22" r="2" fill="black" /> {/* Right eye */}
        <path d="M45 28 Q50 32 55 28" stroke="black" strokeWidth="1" fill="none" /> {/* Smile */}
        
        {/* Mail Bag */}
        <rect 
          x="75" 
          y="50" 
          width="20" 
          height="25" 
          fill="#8B4513" 
          rx="3"
          transform={`rotate(${walking ? 3 : -3} 85 60)`}
        />
        <rect 
          x="77" 
          y="52" 
          width="16" 
          height="21" 
          fill="#A0522D" 
          rx="2"
          transform={`rotate(${walking ? 3 : -3} 85 60)`}
        />
      </svg>
    </div>
  );
};