export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  score: number;
  lives: number;
  level: number;
  status: 'idle' | 'playing' | 'paused' | 'gameOver';
}

export interface Parcel {
  id: string;
  position: Position;
  collected: boolean;
}

export interface Obstacle {
  id: string;
  position: Position;
  type: 'cone' | 'pothole' | 'vehicle';
} 