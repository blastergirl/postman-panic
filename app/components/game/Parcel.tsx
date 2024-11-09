interface ParcelProps {
  position: { x: number; y: number };
  collected: boolean;
  id: string;
  isNearby?: boolean;
}

export const Parcel = ({ position, collected, isNearby }: ParcelProps) => {
  if (collected) return null;
  
  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200
                 ${isNearby ? 'scale-125 z-20' : 'scale-100 z-10'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        filter: isNearby ? 'drop-shadow(0 0 10px gold)' : 'none',
      }}
    >
      <div className="relative">
        <span className="text-3xl relative z-10">📦</span>
        {isNearby && (
          <>
            <div className="absolute -inset-2 border-2 border-yellow-400 rounded-full animate-ping opacity-50" />
            <div className="absolute -inset-4 bg-yellow-400/20 rounded-full animate-pulse" />
          </>
        )}
      </div>
    </div>
  );
}; 