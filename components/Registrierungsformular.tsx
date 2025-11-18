"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function Registrierungsformular() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'admin',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validierung
    if (formData.password !== formData.confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }

    // Lade bestehende Benutzer
    const existingUsers = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      : [];

    // Prüfe ob E-Mail bereits existiert
    if (existingUsers.some((u: { email: string }) => u.email === formData.email)) {
      setError('Diese E-Mail ist bereits registriert.');
      return;
    }

    // Erstelle eindeutige User-Kennung (UUID-ähnlich)
    const generateUserId = () => {
      return 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
    };

    // Erstelle neuen Benutzer mit eindeutiger User-Kennung
    const newUser = {
      id: generateUserId(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    // Speichere Benutzer
    const updatedUsers = [...existingUsers, newUser];
    if (typeof window !== 'undefined') {
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  return (
    <div className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700 p-8 w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Registrierung</h2>
        <p className="text-cyan-300">Erstelle deinen Account</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-600 bg-opacity-20 border border-red-500 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-600 bg-opacity-20 border border-green-500 rounded-lg text-green-300 text-sm">
          Registrierung erfolgreich! Du wirst zum Login weitergeleitet...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder="Dein Name"
          />
        </div>

        {/* E-Mail */}
        <div>
          <label className="block text-cyan-400 text-sm font-medium mb-2">
            E-Mail *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            placeholder="Mindestens 6 Zeichen"
          />
        </div>

        {/* Passwort bestätigen */}
        <div>
          <label className="block text-cyan-400 text-sm font-medium mb-2">
            Passwort bestätigen *
          </label>
          <input
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-400"
            placeholder="Passwort wiederholen"
          />
        </div>

        {/* Rolle */}
        <div>
          <label className="block text-cyan-400 text-sm font-medium mb-2">
            Als registrieren
          </label>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="user"
                checked={formData.role === 'user'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
                className="w-4 h-4 text-cyan-600 bg-gray-800 border-gray-600 focus:ring-cyan-400"
              />
              <span className="text-white">Benutzer</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="admin"
                checked={formData.role === 'admin'}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
                className="w-4 h-4 text-cyan-600 bg-gray-800 border-gray-600 focus:ring-cyan-400"
              />
              <span className="text-white">Admin</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={success}
          className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors duration-200 border border-cyan-400"
        >
          Registrieren ⚔️
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Bereits registriert?{' '}
          <a href="/login" className="text-cyan-400 hover:text-cyan-300">
            Jetzt anmelden
          </a>
        </p>
      </div>
    </div>
  );
}

