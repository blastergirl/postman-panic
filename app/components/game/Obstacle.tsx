interface ObstacleProps {
  position: { x: number; y: number };
  type: 'cone' | 'pothole' | 'vehicle';
}

export const Obstacle = ({ position, type }: ObstacleProps) => {
  const obstacleEmoji = {
    cone: '🚧',
    pothole: '🕳️',
    vehicle: '🚗'
  }[type];

  return (
    <div
      className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <span className="text-2xl">{obstacleEmoji}</span>
    </div>
  );
}; 