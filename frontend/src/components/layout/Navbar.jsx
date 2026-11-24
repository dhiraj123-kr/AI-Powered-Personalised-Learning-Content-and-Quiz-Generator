import React from 'react';
import { Menu, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function Navbar({ onMenuToggle }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white/80 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 text-gray-500 rounded-xl hover:bg-gray-100 lg:hidden focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
          <span className="font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            AI Model: Gemini 1.5
          </span>
          <span className="text-gray-300">|</span>
          <span className="capitalize">Level: <strong>{user?.learningLevel || 'Beginner'}</strong></span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/content"
          className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-sm hover:opacity-95 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Generate Notes
        </Link>

        {/* User Pill */}
        <Link
          to="/profile"
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition border border-gray-100"
        >
          <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <span className="text-xs font-semibold text-gray-700 hidden sm:inline">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
        </Link>
      </div>
    </header>
  );
}
