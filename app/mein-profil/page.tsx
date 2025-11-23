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

type GalleryImage = {
  id: string;
  profile_id: number;
  user_id: string;
  image_url: string;
  image_path: string;
  caption: string | null;
  display_order: number;
  created_at: string;
};

export default function MeinProfil() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageCaption, setImageCaption] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadProfile();
  }, [user, isAuthenticated]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/profiles/${user.id}`);
      const data = await response.json();

      if (!response.ok) {
        console.error('Fehler beim Laden des Profils:', data.error);
        setHasProfile(false);
        return;
      }

      if (data.profile) {
        setProfile(data.profile);
        setHasProfile(true);
        // Lade Galeriebilder
        loadGallery(data.profile.id);
      } else {
        setHasProfile(false);
      }
    } catch (error) {
      console.error('Fehler beim Laden des Profils:', error);
      setHasProfile(false);
    }
  };

  const loadGallery = async (profileId: number) => {
    try {
      const response = await fetch(`/api/gallery/${profileId}`);
      const data = await response.json();

      if (response.ok) {
        setGalleryImages(data.images || []);
      } else {
        // Zeige Fehlermeldung nur wenn es ein Setup-Problem ist
        if (data.error?.includes('nicht gefunden') || data.error?.includes('Migration')) {
          console.error('Galerie-Setup-Fehler:', data.error);
          if (data.hint) {
            console.error('Hinweis:', data.hint);
          }
        }
      }
    } catch (error) {
      console.error('Fehler beim Laden der Galerie:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !profile || !user) {
      setUploadError('Bitte wähle ein Bild aus');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('profileId', profile.id.toString());
      formData.append('userId', user.id);
      if (imageCaption) {
        formData.append('caption', imageCaption);
      }

      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Erstelle eine detaillierte Fehlermeldung
        let errorMessage = data.error || 'Fehler beim Hochladen';
        if (data.hint) {
          errorMessage += `\n\n💡 Hinweis: ${data.hint}`;
        }
        if (data.details) {
          errorMessage += `\n\nDetails: ${data.details}`;
        }
        throw new Error(errorMessage);
      }

      // Galerie neu laden
      await loadGallery(profile.id);
      
      // Modal schließen und zurücksetzen
      setShowUploadModal(false);
      setSelectedFile(null);
      setImageCaption('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      setUploadError(error.message || 'Fehler beim Hochladen des Bildes');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Möchtest du dieses Bild wirklich löschen?')) {
      return;
    }

    try {
      const response = await fetch(`/api/gallery/image/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Fehler beim Löschen');
      }

      // Galerie neu laden
      if (profile) {
        await loadGallery(profile.id);
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      alert('Fehler beim Löschen des Bildes');
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
                Profil erstellen ❤️
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

          {/* Bildergalerie */}
          {hasProfile && profile && (
            <div className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8 mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Bildergalerie</h2>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>📷</span>
                  Bild hinzufügen
                </button>
              </div>

              {galleryImages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">Noch keine Bilder in der Galerie</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Erstes Bild hochladen
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.image_url}
                        alt={image.caption || 'Galeriebild'}
                        className="w-full h-48 object-cover rounded-lg border-2 border-gray-700 hover:border-cyan-400 transition-colors"
                      />
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Bild löschen"
                      >
                        ×
                      </button>
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2 rounded-b-lg">
                          {image.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-6 max-w-md w-full">
                <h3 className="text-2xl font-bold text-white mb-4">Bild hochladen</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Bild auswählen
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={handleFileSelect}
                      className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
                    />
                    {selectedFile && (
                      <p className="text-gray-400 text-sm mt-2">
                        Ausgewählt: {selectedFile.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Beschreibung (optional)
                    </label>
                    <input
                      type="text"
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      placeholder="Beschreibe dein Bild..."
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {uploadError && (
                    <div className="bg-red-900 bg-opacity-50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm whitespace-pre-line">
                      {uploadError}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleUpload}
                      disabled={!selectedFile || isUploading}
                      className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                    >
                      {isUploading ? 'Wird hochgeladen...' : 'Hochladen'}
                    </button>
                    <button
                      onClick={() => {
                        setShowUploadModal(false);
                        setSelectedFile(null);
                        setImageCaption('');
                        setUploadError(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

