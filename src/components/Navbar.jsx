import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate('/auth');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#10131a]/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center">
      <div className="max-w-[1400px] mx-auto w-full px-6 md:px-8 flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <span className="material-symbols-outlined text-[#c2c1ff] text-[28px] group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_stories
          </span>
          <span className="text-2xl font-bold text-white tracking-tight">
            StudyGenius AI
          </span>
        </Link>

        {/* Navigation Links - Centered */}
        <div className="hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
          <Link 
            to="/dashboard" 
            className="text-[13px] font-bold text-on-surface-variant hover:text-white transition-colors tracking-wide"
          >
            Dashboard
          </Link>
          <Link 
            to="/leaderboard" 
            className="text-[13px] font-bold text-on-surface-variant hover:text-white transition-colors tracking-wide"
          >
            Leaderboard
          </Link>
        </div>

        {/* Trailing Actions */}
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-6">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-white transition-all scale-95 active:scale-90"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Logout
              </button>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 cursor-pointer hover:border-[#c2c1ff]/50 transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant text-[28px]">account_circle</span>
              </div>
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-gradient-to-r from-[#5e5ce6] to-[#6f00be] px-8 py-2.5 rounded-xl text-sm font-black text-white shadow-lg shadow-indigo-500/20"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
