interface PostOfficeProps {
  position: { x: number; y: number };
}

export const PostOffice = ({ position }: PostOfficeProps) => {
  return (
    <div
      className="absolute w-16 h-16 transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="flex flex-col items-center">
        <span className="text-3xl">🏤</span>
        <span className="text-white text-xs mt-1">Post Office</span>
      </div>
    </div>
  );
}; 