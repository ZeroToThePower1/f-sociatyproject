// /app/src/components/Sidebar.jsx
import React from 'react';
import {
  BookOpen,
  Compass,
  Layers,
  User,
  Sliders,
  Sparkles,
  Flame,
  Award,
  ChevronRight,
  GraduationCap,
  Play
} from './icons';

export default function Sidebar({
  currentView,
  onNavigate,
  activeProfileKey,
  preferences,
  completedCount,
  inProgressCount,
  totalCourses = 10
}) {
  const navItems = [
    { id: 'dashboard', label: 'Home Dashboard', icon: Sparkles },
    { id: 'explore', label: 'Explore Courses', icon: Compass },
    { id: 'mylearning', label: 'My Learning', icon: BookOpen, badge: inProgressCount > 0 ? `${inProgressCount}` : null },
    { id: 'roadmap', label: 'Learning Roadmap', icon: Layers },
    { id: 'profile', label: 'My Profile', icon: User }
  ];

  return (
    <aside className="skillpath-sidebar w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-30 hidden lg:flex">
      {/* Top Branding Section */}
      <div>
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* SkillPath Original Logo Emblem */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-md shadow-purple-200 group-hover:scale-105 transition-transform">
              <GraduationCap size={22} strokeWidth={2.2} />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-slate-900 tracking-tight">
                  Skill<span className="text-purple-600">Path</span>
                </span>
                <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-purple-100 text-purple-700">
                  PW Ed
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 block -mt-0.5">
                Smart Course Recommender
              </span>
            </div>
          </div>
        </div>

        {/* Motivational Learning Tagline */}
        <div className="mx-4 my-3 p-3 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100/80 text-xs">
          <div className="flex items-center gap-1.5 text-purple-900 font-bold mb-1">
            <Flame size={14} className="text-amber-500 fill-amber-500" />
            <span>Daily Streak: 3 Days 🔥</span>
          </div>
          <p className="text-[11px] text-purple-700/90 leading-tight">
            "Seekho Dil Se, Badho SkillPath Se!"
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                    : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/60'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={isActive ? 'text-white' : 'text-slate-500'}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white text-purple-700'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Summary Card in Sidebar */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Curriculum Progress
            </span>
            <span className="text-[11px] font-black text-purple-700">
              {completedCount} / {totalCourses}
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${Math.round((completedCount / totalCourses) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Commitment:</span>
            <span className="font-bold text-slate-800">{preferences.studyHours || 5}h / week</span>
          </div>
        </div>

        {/* Active persona footer */}
        <div
          onClick={() => onNavigate('profile')}
          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100/80 cursor-pointer transition-colors"
          title="Click to view My Profile"
        >
          <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-sm font-bold">
            {activeProfileKey === 'profileA' ? '👨‍💻' : '👩‍💻'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">
              {activeProfileKey === 'profileA' ? 'Alex Chen' : 'Priya Sharma'}
            </p>
            <p className="text-[10px] text-purple-600 font-semibold truncate">
              {activeProfileKey === 'profileA' ? 'Frontend Track' : 'AI & DSA Track'}
            </p>
          </div>
          <ChevronRight size={14} className="text-slate-400" />
        </div>
      </div>
    </aside>
  );
}