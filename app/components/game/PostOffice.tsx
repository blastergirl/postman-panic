interface PostOfficeProps {
  position: { x: number; y: number };
  containerSize: { width: number; height: number };
}

export const PostOffice = ({ position, containerSize }: PostOfficeProps) => {
  // Calculate size based on container dimensions
  const size = Math.min(containerSize.width, containerSize.height) * 0.1;

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        fontSize: `${size}px`,
      }}
    >
      <span role="img" aria-label="post office">🏤</span>
    </div>
  );
}; 