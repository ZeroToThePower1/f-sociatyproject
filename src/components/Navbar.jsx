// /client/src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
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
  Clock,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from './icons';

export default function Navbar({
  currentView,
  onNavigate,
  preferences,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  currentUser,
  onLogout,
  isAdmin = false,
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Sparkles },
    { id: 'explore', label: 'Courses', icon: Compass },
    { id: 'mylearning', label: 'My Learning', icon: BookOpen },
    { id: 'roadmap', label: 'Roadmap', icon: Layers },
    { id: 'profile', label: 'Profile', icon: User },
    // Admin link (only for admins)
    ...(isAdmin
      ? [{ id: 'admin', label: 'Admin', icon: ShieldCheck }]
      : []),
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // User display info
  const userEmail = currentUser?.email || 'User';
  const userName = currentUser?.user_metadata?.name || userEmail.split('@')[0];
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogoutClick = () => {
    setProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    if (onLogout) onLogout();
  };

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
            const isAdminLink = item.id === 'admin';
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs'
                    : isAdminLink
                    ? 'text-amber-700 hover:text-amber-800 hover:bg-amber-50 border border-amber-200/60'
                    : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  size={14}
                  className={
                    isActive
                      ? 'text-purple-600'
                      : isAdminLink
                      ? 'text-amber-600'
                      : 'text-slate-400'
                  }
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Streak, Hours & User Menu */}
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
            <span>{preferences?.studyHours || 5}h/wk</span>
          </div>

          {/* User Avatar & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 transition-all shadow-2xs"
              aria-label="User menu"
              aria-expanded={profileDropdownOpen}
            >
              {/* Avatar circle */}
              <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center text-xs font-black shadow-sm">
                {userInitial}
              </span>
              <span className="hidden sm:inline text-xs font-bold text-slate-800 max-w-[100px] truncate">
                {userName}
              </span>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform ${
                  profileDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 text-xs">
                {/* User Info Header */}
                <div className="px-3 py-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center text-sm font-black shadow-sm">
                      {userInitial}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold text-slate-900 text-xs truncate">
                        {userName}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      ● Signed In
                    </span>
                    {isAdmin && (
                      <span className="inline-block text-[9px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        ⚡ Admin
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                  >
                    <User size={13} className="text-slate-400" />
                    <span>My Profile</span>
                  </button>

                  {/* Admin Panel shortcut (dropdown) */}
                  {isAdmin && (
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left font-semibold text-amber-800 hover:bg-amber-50 flex items-center gap-2 transition-colors"
                    >
                      <ShieldCheck size={13} className="text-amber-600" />
                      <span>Admin Panel</span>
                    </button>
                  )}

                  <button
                    onClick={handleLogoutClick}
                    className="w-full px-3 py-2 rounded-xl text-left font-semibold text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={13} className="text-rose-500" />
                    <span>Log Out</span>
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
          {/* User info on mobile */}
          <div className="flex items-center gap-2.5 px-2 py-2 mb-1 rounded-xl bg-slate-50 border border-slate-100">
            <span className="w-9 h-9 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center text-sm font-black">
              {userInitial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-slate-900 text-xs truncate">{userName}</p>
              <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
            </div>
            {isAdmin && (
              <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                ⚡ Admin
              </span>
            )}
          </div>

          {/* Nav items */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const isAdminLink = item.id === 'admin';
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
                    : isAdminLink
                    ? 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                    : 'text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                <Icon
                  size={18}
                  className={
                    isActive
                      ? 'text-white'
                      : isAdminLink
                      ? 'text-amber-600'
                      : 'text-slate-500'
                  }
                />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Stats row */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold px-2">
            <span className="text-slate-500">Daily Streak: 🔥 3 Days</span>
            <span className="text-purple-700 font-bold">
              Target: {preferences?.studyHours || 5}h / week
            </span>
          </div>

          {/* Logout on mobile */}
          <button
            onClick={handleLogoutClick}
            className="w-full mt-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </header>
  );
}