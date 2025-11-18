"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

type UserProfile = {
  id: number;
  name: string;
  age: number;
  location: string;
  status: string;
  interests: string[];
  height: string;
  children: string;
  education: string;
  languages: string[];
  description: string;
  avatar: string;
  online: boolean;
  verified: boolean;
  seeking: string;
  userId?: string;
};

export default function MeinProfil() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadProfile();
  }, [user, isAuthenticated]);

  const loadProfile = () => {
    if (!user || typeof window === 'undefined') return;

    const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '[]');
    const userProfile = userProfiles.find((p: UserProfile) => p.userId === user.id);

    if (userProfile) {
      setProfile(userProfile);
      setHasProfile(true);
    } else {
      setHasProfile(false);
    }
  };

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

  if (!isAuthenticated) {
    return null;
  }

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
      <main className="relative z-20 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Mein Profil
            </h1>
            <p className="text-xl text-cyan-300">
              {hasProfile ? 'Dein persönliches Profil' : 'Erstelle dein Profil'}
            </p>
          </div>

          {!hasProfile ? (
            // Kein Profil vorhanden
            <div className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8 text-center">
              <p className="text-gray-300 text-lg mb-6">
                Du hast noch kein Profil erstellt.
              </p>
              <button
                onClick={() => router.push('/profil-erstellen')}
                className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xl rounded-xl transition-colors duration-200 border border-cyan-400"
              >
                Profil erstellen ⚔️
              </button>
            </div>
          ) : profile ? (
            // Profil anzeigen
            <div className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8">
              {/* Profil Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-cyan-400"
                  />
                  <div>
                    <h2 className="text-3xl font-bold text-white">{profile.name}, {profile.age}</h2>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className={`w-3 h-3 rounded-full ${profile.online ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                      <span className="text-gray-200 text-sm">{profile.status}</span>
                      {profile.verified && (
                        <span className="text-yellow-400 text-sm">✓ Verifiziert</span>
                      )}
                    </div>
                    <p className="text-cyan-400 text-sm mt-1">{profile.location}</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/profil-erstellen')}
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
                >
                  Bearbeiten
                </button>
              </div>

              {/* Profil Details */}
              <div className="space-y-6">
                {/* Seeking */}
                <div>
                  <span className="text-gray-400 text-sm">Auf der Suche nach</span>
                  <p className="text-gray-100 font-medium mt-1">{profile.seeking}</p>
                </div>

                {/* Interessen */}
                <div>
                  <span className="text-gray-400 text-sm">Interessen</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-cyan-600 bg-opacity-20 text-cyan-200 rounded-full text-sm border border-cyan-400 border-opacity-30"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Weitere Details */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-gray-400 text-sm">Größe</span>
                    <p className="text-gray-100 font-medium">{profile.height}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Kinder</span>
                    <p className="text-gray-100 font-medium">{profile.children}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Ausbildung</span>
                    <p className="text-gray-100 font-medium">{profile.education}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Sprachen</span>
                    <p className="text-gray-100 font-medium">{profile.languages.join(', ')}</p>
                  </div>
                </div>

                {/* Beschreibung */}
                <div>
                  <span className="text-gray-400 text-sm">Beschreibung</span>
                  <p className="text-gray-200 text-sm leading-relaxed mt-2 bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                    {profile.description}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Play/Pause Button */}
          <div className="text-center mt-12">
            <button
              onClick={togglePlay}
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xl rounded-full shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
              <span className="text-2xl">⚔️</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

