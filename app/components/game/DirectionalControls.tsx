interface DirectionalControlsProps {
  onDirectionChange: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export const DirectionalControls = ({ onDirectionChange }: DirectionalControlsProps) => {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 grid grid-cols-3 gap-2 md:hidden">
      {/* Up arrow */}
      <button
        className="col-start-2 w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm 
                   text-white text-2xl flex items-center justify-center 
                   active:bg-white/30 transition-colors"
        onClick={() => onDirectionChange('up')}
      >
        ↑
      </button>
      
      <div className="col-start-1 col-span-3 flex justify-center gap-2">
        {/* Left arrow */}
        <button
          className="w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm 
                     text-white text-2xl flex items-center justify-center 
                     active:bg-white/30 transition-colors"
          onClick={() => onDirectionChange('left')}
        >
          ←
        </button>
        
        {/* Down arrow */}
        <button
          className="w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm 
                     text-white text-2xl flex items-center justify-center 
                     active:bg-white/30 transition-colors"
          onClick={() => onDirectionChange('down')}
        >
          ↓
        </button>
        
        {/* Right arrow */}
        <button
          className="w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm 
                     text-white text-2xl flex items-center justify-center 
                     active:bg-white/30 transition-colors"
          onClick={() => onDirectionChange('right')}
        >
          →
        </button>
      </div>
    </div>
  );
}; 