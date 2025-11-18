"use client";

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

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

export default function Home() {
  const router = useRouter();
  const { isAdmin, isAuthenticated } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [interestsInput, setInterestsInput] = useState('');
  const [languagesInput, setLanguagesInput] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadProfiles();
    }
  }, [isAdmin]);

  const loadProfiles = async () => {
    try {
      const response = await fetch('/api/profiles');
      const data = await response.json();

      if (!response.ok) {
        console.error('Fehler beim Laden der Profile:', data.error);
        setProfiles([]);
        return;
      }

      setProfiles(data.profiles || []);
    } catch (error) {
      console.error('Fehler beim Laden der Profile:', error);
      setProfiles([]);
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

  const startEdit = (profile: UserProfile) => {
    setEditingProfile(profile);
    setEditedProfile({ ...profile });
    setInterestsInput('');
    setLanguagesInput('');
  };

  const cancelEdit = () => {
    setEditingProfile(null);
    setEditedProfile(null);
  };

  const addInterest = () => {
    if (editedProfile && interestsInput.trim() && !editedProfile.interests.includes(interestsInput.trim())) {
      setEditedProfile({
        ...editedProfile,
        interests: [...editedProfile.interests, interestsInput.trim()],
      });
      setInterestsInput('');
    }
  };

  const removeInterest = (interest: string) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        interests: editedProfile.interests.filter((i) => i !== interest),
      });
    }
  };

  const addLanguage = () => {
    if (editedProfile && languagesInput.trim() && !editedProfile.languages.includes(languagesInput.trim())) {
      setEditedProfile({
        ...editedProfile,
        languages: [...editedProfile.languages, languagesInput.trim()],
      });
      setLanguagesInput('');
    }
  };

  const removeLanguage = (language: string) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        languages: editedProfile.languages.filter((l) => l !== language),
      });
    }
  };

  const saveProfile = async () => {
    if (!editedProfile) return;

    try {
      const response = await fetch('/api/profiles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editedProfile.id,
          userId: (editedProfile as any).userId,
          name: editedProfile.name,
          age: editedProfile.age,
          location: editedProfile.location,
          status: editedProfile.status,
          interests: editedProfile.interests,
          height: editedProfile.height,
          children: editedProfile.children,
          education: editedProfile.education,
          languages: editedProfile.languages,
          description: editedProfile.description,
          avatar: editedProfile.avatar,
          online: editedProfile.online,
          verified: editedProfile.verified,
          seeking: editedProfile.seeking,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Fehler beim Speichern:', data.error);
        alert(`Fehler beim Speichern: ${data.error}`);
        return;
      }

      setEditingProfile(null);
      setEditedProfile(null);
      
      // Lade Profile neu
      await loadProfiles();
    } catch (error) {
      console.error('Fehler beim Speichern des Profils:', error);
      alert('Fehler beim Speichern des Profils.');
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
      <main className="relative z-20 min-h-screen flex flex-col items-center justify-center p-8">
        {isAdmin ? (
          // Admin Ansicht - Profil Bearbeitung
          <div className="w-full max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Admin - Profil Verwaltung
              </h1>
              <p className="text-xl text-cyan-300 mb-4">
                Bearbeite und verwalte alle Profile
              </p>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    if (confirm('Möchtest du wirklich alle Profile und Nachrichten löschen?')) {
                      localStorage.removeItem('userProfiles');
                      localStorage.removeItem('messages');
                      loadProfiles();
                      alert('Alle Profile wurden gelöscht.');
                    }
                  }
                }}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Alle Profile löschen
              </button>
            </div>

            {editingProfile && editedProfile ? (
              // Bearbeitungsformular
              <div className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8 mb-6">
                <h2 className="text-2xl font-bold text-white mb-6">Profil bearbeiten: {editedProfile.name}</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-cyan-400 text-sm font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-400 text-sm font-medium mb-2">Alter *</label>
                      <input
                        type="number"
                        value={editedProfile.age}
                        onChange={(e) => setEditedProfile({ ...editedProfile, age: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-400 text-sm font-medium mb-2">Standort *</label>
                      <input
                        type="text"
                        value={editedProfile.location}
                        onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-400 text-sm font-medium mb-2">Status *</label>
                      <select
                        value={editedProfile.status}
                        onChange={(e) => setEditedProfile({ ...editedProfile, status: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Online verfügbar">Online verfügbar</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-cyan-400 text-sm font-medium mb-2">Größe *</label>
                      <input
                        type="text"
                        value={editedProfile.height}
                        onChange={(e) => setEditedProfile({ ...editedProfile, height: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-400 text-sm font-medium mb-2">Kinder *</label>
                      <input
                        type="text"
                        value={editedProfile.children}
                        onChange={(e) => setEditedProfile({ ...editedProfile, children: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-400 text-sm font-medium mb-2">Ausbildung *</label>
                      <input
                        type="text"
                        value={editedProfile.education}
                        onChange={(e) => setEditedProfile({ ...editedProfile, education: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-400 text-sm font-medium mb-2">Avatar URL *</label>
                      <input
                        type="url"
                        value={editedProfile.avatar}
                        onChange={(e) => setEditedProfile({ ...editedProfile, avatar: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-cyan-400 text-sm font-medium mb-2">Interessen</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={interestsInput}
                        onChange={(e) => setInterestsInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                        placeholder="Interesse eingeben"
                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={addInterest}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editedProfile.interests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-cyan-600 bg-opacity-20 text-cyan-200 rounded-full text-sm flex items-center gap-2"
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

                  <div>
                    <label className="block text-cyan-400 text-sm font-medium mb-2">Sprachen</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={languagesInput}
                        onChange={(e) => setLanguagesInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                        placeholder="Sprache eingeben"
                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={addLanguage}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editedProfile.languages.map((language, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-cyan-600 bg-opacity-20 text-cyan-200 rounded-full text-sm flex items-center gap-2"
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

                  <div>
                    <label className="block text-cyan-400 text-sm font-medium mb-2">Beschreibung *</label>
                    <textarea
                      value={editedProfile.description}
                      onChange={(e) => setEditedProfile({ ...editedProfile, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-cyan-400 text-sm font-medium mb-2">Auf der Suche nach *</label>
                    <input
                      type="text"
                      value={editedProfile.seeking}
                      onChange={(e) => setEditedProfile({ ...editedProfile, seeking: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center space-x-2 text-cyan-400 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={editedProfile.online}
                        onChange={(e) => setEditedProfile({ ...editedProfile, online: e.target.checked })}
                        className="w-4 h-4 text-cyan-600 bg-gray-800 border-gray-600 rounded"
                      />
                      <span>Online</span>
                    </label>
                    <label className="flex items-center space-x-2 text-cyan-400 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={editedProfile.verified}
                        onChange={(e) => setEditedProfile({ ...editedProfile, verified: e.target.checked })}
                        className="w-4 h-4 text-cyan-600 bg-gray-800 border-gray-600 rounded"
                      />
                      <span>Verifiziert</span>
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={saveProfile}
                      className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors"
                    >
                      Speichern ✓
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl transition-colors"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Profil Liste
              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-white">{profile.name}, {profile.age}</h3>
                        <p className="text-gray-300">{profile.location}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${profile.online ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                          <span className="text-gray-400 text-sm">{profile.status}</span>
                          {profile.verified && (
                            <span className="text-yellow-400 text-sm">✓ Verifiziert</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => startEdit(profile)}
                      className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Bearbeiten
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : isAuthenticated ? (
          // Eingeloggte User - Willkommensnachricht
          <div className="w-full max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
              Willkommen zurück! ⚔️
            </h1>
            <p className="text-xl md:text-2xl text-cyan-300 font-light drop-shadow-lg mb-8">
              Entdecke neue Profile und starte spannende Gespräche
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push('/profil')}
                className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-lg rounded-full shadow-2xl transition-all duration-300"
              >
                Profile entdecken
              </button>
              <button
                onClick={() => router.push('/mein-profil')}
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold text-lg rounded-full shadow-2xl transition-all duration-300"
              >
                Mein Profil
              </button>
            </div>
          </div>
        ) : (
          // Nicht eingeloggt - Landing Page
          <div className="w-full max-w-6xl mx-auto">
            {/* Hero-Bereich */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
                Finde jemanden, bei dem es sofort klickt.
              </h1>
              <p className="text-2xl md:text-3xl text-cyan-300 font-light mb-8 drop-shadow-lg">
                Die Dating-App, auf der täglich neue Lieben entstehen.
              </p>
              <p className="text-xl text-white mb-8">
                Jetzt kostenlos starten – in 60 Sekunden bist du dabei ❤️
              </p>
              
              {/* Großer animierter Button */}
              <button
                onClick={() => router.push('/registrierung')}
                className="px-12 py-6 bg-gradient-to-r from-pink-600 via-red-500 to-pink-600 text-white font-bold text-2xl rounded-full shadow-2xl transition-all duration-300 hover:scale-105 animate-pulse hover:animate-none"
              >
                JETZT BEITRETEN UND REGISTRIEREN ⚔️
              </button>
            </div>

            {/* Benefit-Überschriften */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              <div className="bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-cyan-400 mb-3">⚡ In 60 Sekunden startklar</h3>
                <p className="text-gray-300">Registrieren, Foto hochladen, losswipen</p>
              </div>
              <div className="bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-cyan-400 mb-3">✓ Echte Profile, echte Menschen</h3>
                <p className="text-gray-300">Wir prüfen jedes Profil manuell</p>
              </div>
              <div className="bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-cyan-400 mb-3">🎯 Smarte Matches</h3>
                <p className="text-gray-300">Unser Algorithmus lernt, was du wirklich magst</p>
              </div>
              <div className="bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-cyan-400 mb-3">💬 Direkt chatten</h3>
                <p className="text-gray-300">Kein langes Warten: Match = sofort Nachricht schreiben</p>
              </div>
              <div className="bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-xl p-6 border border-gray-700 md:col-span-2 lg:col-span-1">
                <h3 className="text-xl font-bold text-cyan-400 mb-3">💚 100 % kostenlos starten</h3>
                <p className="text-gray-300">Keine versteckten Kosten, keine Abos nötig</p>
              </div>
            </div>

            {/* "So funktioniert's" Sektion */}
            <div className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8 md:p-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
                So funktioniert's
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-cyan-600 rounded-full flex items-center justify-center text-4xl font-bold text-white mx-auto mb-4">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Profil erstellen</h3>
                  <p className="text-gray-300">
                    Lade deine besten Fotos hoch und erzähl in 2 Minuten, wer du bist.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-cyan-600 rounded-full flex items-center justify-center text-4xl font-bold text-white mx-auto mb-4">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Matches entdecken</h3>
                  <p className="text-gray-300">
                    Swipe durch spannende Singles in deiner Nähe – oder lass dich vom Algorithmus überraschen.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-cyan-600 rounded-full flex items-center justify-center text-4xl font-bold text-white mx-auto mb-4">
                    3
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Chatten & treffen</h3>
                  <p className="text-gray-300">
                    Bei einem Match könnt ihr sofort schreiben und euch verabreden. So einfach ist das.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PLAY/PAUSE BUTTON - Nur für nicht eingeloggte User */}
        {!isAuthenticated && !isAdmin && (
          <div className="mt-8">
            <button
              onClick={togglePlay}
              className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xl rounded-full shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
              <span className="text-2xl">⚔️</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}