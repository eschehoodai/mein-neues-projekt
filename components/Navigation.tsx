'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-black bg-opacity-80 backdrop-blur-sm border-b border-cyan-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="text-xl font-bold text-cyan-400">
            ❤️ NEXT DATING
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <div className="flex space-x-4">
              <Link
                href="/"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  pathname === '/'
                    ? 'text-cyan-400 bg-cyan-600 bg-opacity-20'
                    : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-600 hover:bg-opacity-10'
                }`}
              >
                Home
              </Link>
              <Link
                href="/profil"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  pathname === '/profil'
                    ? 'text-cyan-400 bg-cyan-600 bg-opacity-20'
                    : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-600 hover:bg-opacity-10'
                }`}
              >
                Profil
              </Link>
              <Link
                href="/profil-erstellen"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  pathname === '/profil-erstellen'
                    ? 'text-cyan-400 bg-cyan-600 bg-opacity-20'
                    : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-600 hover:bg-opacity-10'
                }`}
              >
                Profil erstellen
              </Link>
              <Link
                href="/registrierung"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  pathname === '/registrierung'
                    ? 'text-cyan-400 bg-cyan-600 bg-opacity-20'
                    : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-600 hover:bg-opacity-10'
                }`}
              >
                Registrierung
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    href="/mein-profil"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      pathname === '/mein-profil'
                        ? 'text-cyan-400 bg-cyan-600 bg-opacity-20'
                        : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-600 hover:bg-opacity-10'
                    }`}
                  >
                    Mein Profil
                  </Link>
                  <Link
                    href="/nachrichten"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      pathname === '/nachrichten' || pathname?.startsWith('/chat')
                        ? 'text-cyan-400 bg-cyan-600 bg-opacity-20'
                        : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-600 hover:bg-opacity-10'
                    }`}
                  >
                    Nachrichten
                  </Link>
                </>
              )}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4 border-l border-gray-700 pl-4">
              {isAuthenticated ? (
                <>
                  <span className="text-cyan-300 text-sm">
                    {user?.name} {user?.role === 'admin' && '(Admin)'}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      router.push('/');
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                  >
                    Abmelden
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    pathname === '/login'
                      ? 'text-cyan-400 bg-cyan-600 bg-opacity-20'
                      : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  }`}
                >
                  Anmelden
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
