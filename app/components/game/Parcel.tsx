interface ParcelProps {
  position: { x: number; y: number };
  collected: boolean;
  id: string;
}

export const Parcel = ({ position, collected }: ParcelProps) => {
  if (collected) return null;
  
  return (
    <div
      className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <span className="text-2xl animate-bounce">📦</span>
    </div>
  );
}; 