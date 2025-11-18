"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useRef } from 'react';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [error, setError] = useState('');

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Debug: Zeige was gesucht wird
    console.log('Login-Versuch:', { email, role, passwordLength: password.length });

    const success = await login(email.trim(), password, role);
    if (success) {
      router.push('/');
    } else {
      setError('Ungültige Anmeldedaten. Bitte überprüfe deine E-Mail, Passwort und Rolle.');
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
          <div className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Anmelden</h1>
              <p className="text-cyan-300">Melde dich mit deinem Account an</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-600 bg-opacity-20 border border-red-500 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rolle Auswahl */}
              <div>
                <label className="block text-cyan-400 text-sm font-medium mb-2">
                  Als anmelden
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="user"
                      checked={role === 'user'}
                      onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                      className="w-4 h-4 text-cyan-600 bg-gray-800 border-gray-600 focus:ring-cyan-400"
                    />
                    <span className="text-white">Benutzer</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="admin"
                      checked={role === 'admin'}
                      onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                      className="w-4 h-4 text-cyan-600 bg-gray-800 border-gray-600 focus:ring-cyan-400"
                    />
                    <span className="text-white">Admin</span>
                  </label>
                </div>
              </div>

              {/* E-Mail */}
              <div>
                <label className="block text-cyan-400 text-sm font-medium mb-2">
                  E-Mail *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  placeholder="deine@email.de"
                />
              </div>

              {/* Passwort */}
              <div>
                <label className="block text-cyan-400 text-sm font-medium mb-2">
                  Passwort *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                  placeholder="••••••••"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors duration-200 border border-cyan-400"
              >
                Anmelden ⚔️
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Noch kein Account?{' '}
                <a href="/registrierung" className="text-cyan-400 hover:text-cyan-300">
                  Jetzt registrieren
                </a>
              </p>
            </div>
          </div>

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

