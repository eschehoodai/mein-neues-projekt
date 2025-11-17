"use client";

import { useRef, useState } from 'react';

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
};

const sampleProfiles: UserProfile[] = [
  {
    id: 1,
    name: "Esche",
    age: 29,
    location: "Oberndorf",
    status: "Online verfügbar",
    interests: ["Essen", "Kraftsport", "Sport", "Deep Talk", "Moonchild"],
    height: "196 cm",
    children: "Keine Kinder",
    education: "Ausbildung",
    languages: ["Deutsch"],
    description: "Bin neu in Stuttgart und auf der Suche nach neuen Freunden mit denen man etwas unternehmen kann 😊 Bin auch Single, also für ein First Date zu haben 😘",
    avatar: "https://via.placeholder.com/150/4F46E5/FFFFFF?text=Esche",
    online: true,
    verified: true,
    seeking: "Neue Freunde oder Chats, mal sehen was passiert",
  },
  {
    id: 2,
    name: "Max Mustermann",
    age: 32,
    location: "Stuttgart",
    status: "Online",
    interests: ["Reisen", "Fotografie", "Kochen"],
    height: "180 cm",
    children: "Keine Kinder",
    education: "Studium",
    languages: ["Deutsch", "Englisch"],
    description: "Abenteuerlustiger Entwickler sucht interessante Gespräche und gemeinsame Erlebnisse.",
    avatar: "https://via.placeholder.com/150/10B981/FFFFFF?text=Max",
    online: true,
    verified: true,
    seeking: "Interessante Gespräche und neue Freunde",
  },
  {
    id: 3,
    name: "Anna Beispiel",
    age: 27,
    location: "München",
    status: "Offline",
    interests: ["Yoga", "Lesen", "Natur"],
    height: "168 cm",
    children: "Keine Kinder",
    education: "Studium",
    languages: ["Deutsch", "Spanisch"],
    description: "Ruhe suchende Seele, die tiefgründige Gespräche und entspannte Treffen schätzt.",
    avatar: "https://via.placeholder.com/150/EF4444/FFFFFF?text=Anna",
    online: false,
    verified: false,
    seeking: "Tiefe Gespräche und gemeinsame Entdeckungen",
  },
];

export default function Profil() {
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

  const ProfileCard = ({ profile }: { profile: UserProfile }) => (
    <div className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-6 mb-6 w-full max-w-md hover:bg-opacity-95 transition-all duration-300">
      {/* Profil Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400"
          />
          <div>
            <h3 className="text-xl font-bold text-white">{profile.name}, {profile.age}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <div className={`w-3 h-3 rounded-full ${profile.online ? 'bg-green-400' : 'bg-gray-500'}`}></div>
              <span className="text-gray-200 text-sm">{profile.status}</span>
              {profile.verified && (
                <span className="text-yellow-400 text-sm">✓ Verifiziert</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-cyan-400 text-sm">{profile.location}</span>
        </div>
      </div>

      {/* Profil Details */}
      <div className="space-y-3 mb-4">
        {/* Seeking */}
        <div>
          <span className="text-gray-400 text-xs">Auf der Suche nach</span>
          <p className="text-gray-100 font-medium">{profile.seeking}</p>
        </div>

        {/* Interessen */}
        <div>
          <span className="text-gray-400 text-xs">Interessen</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {profile.interests.map((interest, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-cyan-600 bg-opacity-20 text-cyan-200 rounded-full text-xs border border-cyan-400 border-opacity-30"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Weitere Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Größe</span>
            <p className="text-gray-100">{profile.height}</p>
          </div>
          <div>
            <span className="text-gray-400">Kinder</span>
            <p className="text-gray-100">{profile.children}</p>
          </div>
          <div>
            <span className="text-gray-400">Ausbildung</span>
            <p className="text-gray-100">{profile.education}</p>
          </div>
          <div>
            <span className="text-gray-400">Sprachen</span>
            <p className="text-gray-100">{profile.languages.join(', ')}</p>
          </div>
        </div>
      </div>

      {/* Beschreibung */}
      <p className="text-gray-200 text-sm leading-relaxed mb-4 bg-gray-800 bg-opacity-50 p-3 rounded-lg">
        {profile.description}
      </p>

      {/* Action Button */}
      <button className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors duration-200 border border-cyan-400">
        Chat starten ⚔️
      </button>
    </div>
  );

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
              Profilverzeichnis
            </h1>
            <p className="text-xl text-cyan-300">
              Entdecke spannende Profile in deiner Nähe
            </p>
          </div>

          {/* Profilkarten Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {sampleProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>

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
