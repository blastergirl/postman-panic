'use client';

import { useEffect, useRef, useState } from 'react';

interface BackgroundMusicProps {
  isPlaying: boolean;
}

export const BackgroundMusic = ({ isPlaying }: BackgroundMusicProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Try to play audio as soon as component mounts
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set volume to 30%
      audioRef.current.play().catch(e => {
        console.log('Waiting for user interaction before playing audio:', e);
      });
    }
  }, []); // Empty dependency array means this runs once on mount

  const toggleMute = () => {
    if (audioRef.current) {
      setIsMuted(!isMuted);
      audioRef.current.muted = !isMuted;
    }
  };

  return (
    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
      <button
        onClick={toggleMute}
        className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors"
        title={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
      <audio
        ref={audioRef}
        loop
        autoPlay
        muted={isMuted}
        preload="auto"
      >
        <source src="/Speedy Delivery.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}; 