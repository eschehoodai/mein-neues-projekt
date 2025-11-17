'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-black bg-opacity-80 backdrop-blur-sm border-b border-cyan-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="text-xl font-bold text-cyan-400">
            ⚔️ Mein Projekt
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-8">
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
          </div>
        </div>
      </div>
    </nav>
  );
}
