"use client";

import { useRef, useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Registrierungsformular from '../../components/Registrierungsformular';

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

export default function ProfilErstellen() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [interestsInput, setInterestsInput] = useState('');
  const [languagesInput, setLanguagesInput] = useState('');

  const [formData, setFormData] = useState<Omit<UserProfile, 'id' | 'verified'>>({
    name: '',
    age: 0,
    location: '',
    status: 'Online',
    interests: [],
    height: '',
    children: '',
    education: '',
    languages: [],
    description: '',
    avatar: '',
    online: true,
    seeking: '',
  });

  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      // Lade bestehendes Profil, falls vorhanden
      const existingProfiles = JSON.parse(localStorage.getItem('userProfiles') || '[]');
      const existingProfile = existingProfiles.find((p: UserProfile & { userId?: string }) => p.userId === user.id);
      
      if (existingProfile) {
        setFormData({
          name: existingProfile.name,
          age: existingProfile.age,
          location: existingProfile.location,
          status: existingProfile.status,
          interests: existingProfile.interests,
          height: existingProfile.height,
          children: existingProfile.children,
          education: existingProfile.education,
          languages: existingProfile.languages,
          description: existingProfile.description,
          avatar: existingProfile.avatar,
          online: existingProfile.online,
          seeking: existingProfile.seeking,
        });
      }
    }
  }, [user]);

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

  const addInterest = () => {
    if (interestsInput.trim() && !formData.interests.includes(interestsInput.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interestsInput.trim()],
      });
      setInterestsInput('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((i) => i !== interest),
    });
  };

  const addLanguage = () => {
    if (languagesInput.trim() && !formData.languages.includes(languagesInput.trim())) {
      setFormData({
        ...formData,
        languages: [...formData.languages, languagesInput.trim()],
      });
      setLanguagesInput('');
    }
  };

  const removeLanguage = (language: string) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((l) => l !== language),
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Lade bestehende Profile aus LocalStorage
    const existingProfiles = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('userProfiles') || '[]') 
      : [];
    
    // Prüfe ob User bereits ein Profil hat
    const existingProfileIndex = existingProfiles.findIndex((p: UserProfile & { userId?: string }) => p.userId === user.id);
    
    let updatedProfiles;
    if (existingProfileIndex >= 0) {
      // Aktualisiere bestehendes Profil
      updatedProfiles = [...existingProfiles];
      updatedProfiles[existingProfileIndex] = {
        ...formData,
        id: existingProfiles[existingProfileIndex].id,
        verified: existingProfiles[existingProfileIndex].verified,
        userId: user.id,
      };
    } else {
      // Erstelle neues Profil
      const newId = existingProfiles.length > 0 
        ? Math.max(...existingProfiles.map((p: UserProfile) => p.id)) + 1 
        : Date.now();
      
      const newProfile: UserProfile & { userId: string } = {
        ...formData,
        id: newId,
        verified: false,
        userId: user.id,
      };
      
      updatedProfiles = [...existingProfiles, newProfile];
    }
    
    // Speichere in LocalStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('userProfiles', JSON.stringify(updatedProfiles));
    }
    
    // Weiterleitung zur "Mein Profil" Seite
    router.push('/mein-profil');
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
      <main className="relative z-20 min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          {!isAuthenticated ? (
            // Wenn nicht eingeloggt, zeige Registrierungsformular
            <>
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  Registrierung erforderlich
                </h1>
                <p className="text-xl text-cyan-300">
                  Bitte registriere dich, um ein Profil zu erstellen
                </p>
              </div>
              <Registrierungsformular />
            </>
          ) : (
            // Wenn eingeloggt, zeige Profil-Erstellungsformular
            <>
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  Profil erstellen
                </h1>
                <p className="text-xl text-cyan-300">
                  Fülle dein Profil aus und teile es mit anderen
                </p>
              </div>

              {/* FORMULAR */}
          <form onSubmit={handleSubmit} className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-cyan-400 text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Alter */}
              <div>
                <label className="block text-cyan-400 text-sm font-medium mb-2">
                  Alter *
                </label>
                <input
                  type="number"
                  required
                  min="18"
                  value={formData.age || ''}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Standort */}
              <div>
                <label className="block text-cyan-400 text-sm font-medium mb-2">
                  Standort *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-cyan-400 text-sm font-medium mb-2">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Online verfügbar">Online verfügbar</option>
                </select>
              </div>

              {/* Online Status */}
              <div>
                <label className="flex items-center space-x-2 text-cyan-400 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={formData.online}
                    onChange={(e) => setFormData({ ...formData, online: e.target.checked })}
                    className="w-4 h-4 text-cyan-600 bg-gray-800 border-gray-600 rounded focus:ring-cyan-400"
                  />
                  <span>Online</span>
                </label>
              </div>

              {/* Interessen */}
              <div>
                <label className="block text-cyan-400 text-sm font-medium mb-2">
                  Interessen
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={interestsInput}
                    onChange={(e) => setInterestsInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                    placeholder="Interesse eingeben und Enter drücken"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={addInterest}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                  >
                    Hinzufügen
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-cyan-600 bg-opacity-20 text-cyan-200 rounded-full text-sm border border-cyan-400 border-opacity-30 flex items-center gap-2"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Größe */}
              <div>
                <label className="block text-cyan-400 text-sm font-medium mb-2">
                  Größe *
                </label>
                <input
                  type="text"
                  required
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="z.B. 180 cm"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Kinder */}
              <div>
                <label className="block text-cyan-400 text-sm font-medium mb-2">
                  Kinder *
                </label>
                <input
                  type="text"
                  required
                  value={formData.children}
                  onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                  placeholder="z.B. Keine Kinder"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Ausbildung */}
              <div>
                <label className="block text-cyan-400 text-sm font-medium mb-2">
                  Ausbildung *
                </label>
                <input
                  type="text"
                  required
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  placeholder="z.B. Studium, Ausbildung"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Sprachen */}
              <div>
                <label className="block text-cyan-400 text-sm font-medium mb-2">
                  Sprachen
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={languagesInput}
                    onChange={(e) => setLanguagesInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                    placeholder="Sprache eingeben und Enter drücken"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={addLanguage}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                  >
                    Hinzufügen
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.languages.map((language, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-cyan-600 bg-opacity-20 text-cyan-200 rounded-full text-sm border border-cyan-400 border-opacity-30 flex items-center gap-2"
                    >
                      {language}
                      <button
                        type="button"
                        onClick={() => removeLanguage(language)}
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Beschreibung */}
              <div>
                <label className="block text-cyan-400 text-sm font-medium mb-2">
                  Beschreibung *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-cyan-400 text-sm font-medium mb-2">
                  Avatar URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://via.placeholder.com/150/4F46E5/FFFFFF?text=Name"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Auf der Suche nach */}
              <div>
                <label className="block text-cyan-400 text-sm font-medium mb-2">
                  Auf der Suche nach *
                </label>
                <input
                  type="text"
                  required
                  value={formData.seeking}
                  onChange={(e) => setFormData({ ...formData, seeking: e.target.value })}
                  placeholder="z.B. Neue Freunde oder Chats"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xl rounded-xl transition-colors duration-200 border border-cyan-400"
                >
                  Profil erstellen ⚔️
                </button>
              </div>
            </div>
          </form>
            </>
          )}

          {/* Play/Pause Button */}
          <div className="text-center mt-8">
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

