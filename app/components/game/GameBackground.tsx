export const GameBackground = () => {
  return (
    <div className="absolute inset-0">
      <svg width="100%" height="100%" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        {/* Sky */}
        <rect width="800" height="600" fill="#87CEEB" />
        
        {/* Sun */}
        <circle cx="700" cy="80" r="40" fill="#FFD700" />
        
        {/* Clouds */}
        <g className="animate-float-slow">
          <path d="M 100 100 q 30 -20 60 0 q 30 -20 60 0 q 30 -20 60 0 q -30 20 -90 20 q -60 0 -90 -20" fill="white" />
          <path d="M 500 150 q 20 -15 40 0 q 20 -15 40 0 q 20 -15 40 0 q -20 15 -60 15 q -40 0 -60 -15" fill="white" />
        </g>

        {/* Houses - Left Side */}
        <g>
          {/* House 1 */}
          <rect x="50" y="200" width="100" height="200" fill="#FFB6C1" />
          <polygon points="50,200 100,150 150,200" fill="#CD5C5C" />
          <rect x="80" y="250" width="40" height="60" fill="#8B4513" />
          <rect x="70" y="220" width="30" height="30" fill="#87CEEB" />
          <rect x="100" y="220" width="30" height="30" fill="#87CEEB" />
          
          {/* House 2 */}
          <rect x="200" y="220" width="100" height="180" fill="#98FB98" />
          <polygon points="200,220 250,170 300,220" fill="#228B22" />
          <rect x="230" y="270" width="40" height="60" fill="#8B4513" />
          <rect x="220" y="240" width="30" height="30" fill="#87CEEB" />
          <rect x="250" y="240" width="30" height="30" fill="#87CEEB" />
        </g>

        {/* Houses - Right Side */}
        <g>
          {/* House 3 */}
          <rect x="500" y="210" width="100" height="190" fill="#DEB887" />
          <polygon points="500,210 550,160 600,210" fill="#8B4513" />
          <rect x="530" y="260" width="40" height="60" fill="#8B4513" />
          <rect x="520" y="230" width="30" height="30" fill="#87CEEB" />
          <rect x="550" y="230" width="30" height="30" fill="#87CEEB" />
          
          {/* House 4 */}
          <rect x="650" y="230" width="100" height="170" fill="#E6E6FA" />
          <polygon points="650,230 700,180 750,230" fill="#483D8B" />
          <rect x="680" y="280" width="40" height="60" fill="#8B4513" />
          <rect x="670" y="250" width="30" height="30" fill="#87CEEB" />
          <rect x="700" y="250" width="30" height="30" fill="#87CEEB" />
        </g>

        {/* Road */}
        <rect x="0" y="400" width="800" height="200" fill="#808080" />
        <rect x="0" y="450" width="800" height="5" fill="white" strokeDasharray="10 20" />
        
        {/* Trees */}
        <g>
          <circle cx="150" cy="380" r="20" fill="#228B22" />
          <rect x="145" y="380" width="10" height="20" fill="#8B4513" />
          
          <circle cx="400" cy="380" r="25" fill="#228B22" />
          <rect x="395" y="380" width="10" height="25" fill="#8B4513" />
          
          <circle cx="600" cy="380" r="20" fill="#228B22" />
          <rect x="595" y="380" width="10" height="20" fill="#8B4513" />
        </g>

        {/* Bushes */}
        <g>
          <circle cx="100" cy="420" r="15" fill="#228B22" />
          <circle cx="300" cy="420" r="15" fill="#228B22" />
          <circle cx="500" cy="420" r="15" fill="#228B22" />
          <circle cx="700" cy="420" r="15" fill="#228B22" />
        </g>
      </svg>
    </div>
  );
}; 