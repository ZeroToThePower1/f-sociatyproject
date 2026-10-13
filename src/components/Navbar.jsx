// /app/src/components/Navbar.jsx
import React, { useState } from 'react';
import {
  GraduationCap,
  Flame,
  User,
  Menu,
  X,
  Sparkles,
  Compass,
  Layers,
  BookOpen,
  RefreshCw,
  Clock
} from './icons';

export default function Navbar({
  currentView,
  onNavigate,
  activeProfileKey,
  onSwitchProfile,
  preferences,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'explore', label: 'Courses', icon: Compass },
    { id: 'mylearning', label: 'My Learning', icon: BookOpen },
    { id: 'roadmap', label: 'Roadmap', icon: Layers },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <header className="skillpath-navbar bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo Brand on Navbar */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-sm shadow-purple-200 group-hover:scale-105 transition-transform">
              <GraduationCap size={20} strokeWidth={2.2} />
            </div>
            <div>
              <span className="text-lg font-black text-slate-900 tracking-tight">
                Skill<span className="text-purple-600">Path</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded ml-1.5 uppercase">
                Ed-Tech
              </span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Quick Nav Links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Header Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs'
                    : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={14} className={isActive ? 'text-purple-600' : 'text-slate-400'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Streak & Persona Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Daily Streak Indicator */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold"
            title="3 Day Learning Streak Active!"
          >
            <Flame size={14} className="text-amber-500 fill-amber-500" />
            <span>3d Streak</span>
          </div>

          {/* Weekly Commitment pill */}
          <div
            onClick={() => onNavigate('profile')}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold cursor-pointer hover:bg-purple-100 transition-colors"
            title="Weekly Study Hours Commitment"
          >
            <Clock size={13} className="text-purple-600" />
            <span>{preferences.studyHours || 5}h/wk</span>
          </div>

          {/* Quick Persona Switcher Button & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-xs font-bold text-slate-800 transition-all shadow-2xs"
              aria-label="Profile switcher dropdown"
              aria-expanded={profileDropdownOpen}
            >
              <span className="text-sm">
                {activeProfileKey === 'profileA' ? '👨‍💻' : '👩‍💻'}
              </span>
              <span className="hidden sm:inline">
                {activeProfileKey === 'profileA' ? 'Alex Chen' : 'Priya Sharma'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-extrabold uppercase">
                {activeProfileKey === 'profileA' ? 'Profile A' : 'Profile B'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Active Demo Persona
                  </span>
                  <p className="font-extrabold text-slate-800 text-xs mt-0.5">
                    {activeProfileKey === 'profileA' ? 'Alex Chen (Frontend)' : 'Priya Sharma (AI & DSA)'}
                  </p>
                </div>

                <div className="p-1 space-y-1">
                  <button
                    onClick={() => {
                      onSwitchProfile('profileA');
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-left font-semibold flex items-center justify-between ${
                      activeProfileKey === 'profileA'
                        ? 'bg-purple-50 text-purple-800 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>👨‍💻</span>
                      <div>
                        <div className="font-bold text-slate-900">Alex Chen (Profile A)</div>
                        <div className="text-[10px] text-slate-500">Web Dev + UI/UX (5h/wk)</div>
                      </div>
                    </div>
                    {activeProfileKey === 'profileA' && <span className="text-purple-600 font-bold">✓</span>}
                  </button>

                  <button
                    onClick={() => {
                      onSwitchProfile('profileB');
                      setProfileDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-left font-semibold flex items-center justify-between ${
                      activeProfileKey === 'profileB'
                        ? 'bg-purple-50 text-purple-800 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>👩‍💻</span>
                      <div>
                        <div className="font-bold text-slate-900">Priya Sharma (Profile B)</div>
                        <div className="text-[10px] text-slate-500">AI + DSA (10h/wk)</div>
                      </div>
                    </div>
                    {activeProfileKey === 'profileB' && <span className="text-purple-600 font-bold">✓</span>}
                  </button>
                </div>

                <div className="pt-1 mt-1 border-t border-slate-100 px-2">
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-center py-1.5 text-[11px] font-bold text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    Configure Custom Profile &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-500'} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold px-2">
            <span className="text-slate-500">Daily Streak: 🔥 3 Days</span>
            <span className="text-purple-700 font-bold">Target: {preferences.studyHours || 5}h / week</span>
          </div>
        </div>
      )}
    </header>
  );
}