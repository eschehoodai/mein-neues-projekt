"use client";

import { useRef, useState } from 'react';
import Registrierungsformular from '../../components/Registrierungsformular';

export default function Registrierung() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* VIDEO HINTERGRUND */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Ihr Browser unterstützt kein Video.
      </video>

      {/* DUNKLER OVERLAY */}
      <div className="fixed inset-0 bg-black opacity-50 z-10"></div>

      {/* INHALT */}
      <main className="relative z-20 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Registrierungsformular />
        </div>

        {/* Play/Pause Button */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={togglePlay}
            className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xl rounded-full shadow-2xl transition-all duration-300 flex items-center gap-3"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
            <span className="text-2xl">⚔️</span>
          </button>
        </div>
      </main>
    </div>
  );
}

