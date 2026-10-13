// /app/src/components/Dashboard.jsx
import React from 'react';
import StatsCard from './StatsCard';
import CourseCard from './CourseCard';
import {
  BookOpen,
  Sparkles,
  Award,
  Play,
  Clock,
  ArrowRight,
  Sliders,
  Compass,
  CheckCircle2,
  Flame,
  User,
  Zap,
  TrendingUp,
  RefreshCw
} from './icons';

export default function Dashboard({
  preferences,
  courses,
  onSelectCourse,
  onUpdateStatus,
  onNavigateTo,
  activeProfileKey,
  onSwitchProfile
}) {
  // Statistics calculated from actual frontend state
  const totalCourses = courses.length;
  const inProgressCourses = courses.filter((c) => c.status === 'in-progress');
  const completedCourses = courses.filter((c) => c.status === 'completed');
  const strongRecommendations = courses.filter((c) => c.score >= 70);
  const weeklyHours = preferences.studyHours || 5;

  // Top recommended courses (top 3)
  const topRecommended = [...courses]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Active persona greeting
  const profileName = activeProfileKey === 'profileA' ? 'Alex Chen' : activeProfileKey === 'profileB' ? 'Priya Sharma' : 'Learner';
  const profileAvatar = activeProfileKey === 'profileA' ? '👨‍💻' : activeProfileKey === 'profileB' ? '👩‍💻' : '🎓';

  return (
    <div className="dashboard-container space-y-8 max-w-7xl mx-auto">
      {/* 1. Student Greeting & Motivation Banner (Physics Wallah Vibe) */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-purple-200 text-xs font-semibold backdrop-blur-md">
              <Flame size={14} className="text-amber-400 fill-amber-400" />
              <span>Physics Wallah Inspired Ed-Tech Experience</span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Namaste, {profileName}!</span>
              <span>{profileAvatar}</span>
            </h1>

            <p className="text-purple-100 text-xs md:text-sm max-w-2xl leading-relaxed">
              Welcome back to <strong>SkillPath</strong>. You have committed <strong>{weeklyHours} study hours/week</strong>.
              Your tailored curriculum has been calibrated using our 4-factor recommendation engine.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigateTo('roadmap')}
                className="px-5 py-2.5 rounded-xl bg-white text-purple-900 hover:bg-purple-50 text-xs font-bold shadow-md transition-all flex items-center gap-2 group"
              >
                <span>View Learning Roadmap</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onNavigateTo('explore')}
                className="px-4 py-2.5 rounded-xl bg-purple-700/80 hover:bg-purple-700 text-white border border-purple-400/40 text-xs font-bold transition-all flex items-center gap-2"
              >
                <Compass size={14} />
                <span>Explore Catalog</span>
              </button>
            </div>
          </div>

          {/* Quick Profile Summary Badge Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white min-w-[200px] shrink-0 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-200">
                Active Profile
              </span>
              <button
                onClick={() => onSwitchProfile(activeProfileKey === 'profileA' ? 'profileB' : 'profileA')}
                className="text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-1 transition-colors"
                title="Toggle between Profile A and Profile B"
              >
                <RefreshCw size={11} />
                <span>Switch</span>
              </button>
            </div>

            <p className="text-sm font-extrabold">{profileName}</p>

            <div className="text-[11px] text-purple-200 space-y-1 pt-1 border-t border-white/15">
              <div>🎯 <strong>Focus:</strong> {preferences.interests.join(', ') || 'General Tech'}</div>
              <div>⚡ <strong>Skills:</strong> {preferences.skills.join(', ') || 'Foundational'}</div>
            </div>
          </div>
        </div>

        {/* Decorative background glows */}
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Preferences Summary Bar */}
      <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">Current Study Preferences</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-400">Interests:</span>
            {preferences.interests.map((intr) => (
              <span key={intr} className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold border border-purple-200/80">
                {intr}
              </span>
            ))}
            <span className="text-slate-300">|</span>
            <span className="font-semibold text-slate-400">Current Skills:</span>
            {preferences.skills.map((sk) => (
              <span key={sk} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
                {sk}
              </span>
            ))}
            <span className="text-slate-300">|</span>
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              {weeklyHours} hrs / week
            </span>
          </div>
        </div>

        <button
          onClick={() => onNavigateTo('profile')}
          className="text-xs font-bold px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-all flex items-center gap-1.5 shrink-0"
        >
          <Sliders size={13} />
          <span>Edit Preferences</span>
        </button>
      </div>

      {/* 3. Key Statistics Row (Actual frontend state calculations) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total Courses"
          value={totalCourses}
          subtitle="Full curriculum catalog"
          icon={BookOpen}
          color="purple"
        />

        <StatsCard
          title="Recommended"
          value={strongRecommendations.length}
          subtitle="Match score >= 70%"
          badge="High Fit"
          icon={Sparkles}
          color="indigo"
        />

        <StatsCard
          title="In Progress"
          value={inProgressCourses.length}
          subtitle="Currently learning"
          icon={Play}
          color="blue"
        />

        <StatsCard
          title="Completed"
          value={completedCourses.length}
          subtitle="Milestones achieved"
          icon={Award}
          color="emerald"
        />

        <StatsCard
          title="Study Time"
          value={`${weeklyHours}h`}
          subtitle="Weekly target commitment"
          icon={Clock}
          color="amber"
        />
      </div>

      {/* 4. Continue Learning Section (if any in-progress courses exist) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Play size={16} className="fill-indigo-700" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">Continue Learning</h2>
          </div>
          {inProgressCourses.length > 0 && (
            <button
              onClick={() => onNavigateTo('mylearning')}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
            >
              <span>View All ({inProgressCourses.length})</span>
              <ChevronRightIcon />
            </button>
          )}
        </div>

        {inProgressCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelectCourse={onSelectCourse}
                onUpdateStatus={onUpdateStatus}
                compact
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl shrink-0">
                🚀
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Ready to start a new course?
                </h3>
                <p className="text-xs text-slate-500">
                  No courses currently in progress. Pick your highest recommended course below to begin!
                </p>
              </div>
            </div>

            {topRecommended[0] && (
              <button
                onClick={() => onUpdateStatus(topRecommended[0].id, 'in-progress')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 shrink-0"
              >
                <Play size={12} className="fill-white" />
                <span>Start "{topRecommended[0].title.slice(0, 22)}..."</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 5. Recommended For You Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
              <Sparkles size={16} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recommended For You
              </h2>
              <p className="text-xs text-slate-500">
                Ranked by 40% Interest, 30% Skill, 15% Difficulty & 15% Time Compatibility
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTo('explore')}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
          >
            <span>Browse All Courses</span>
            <ChevronRightIcon />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topRecommended.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onSelectCourse={onSelectCourse}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      </div>

      {/* 6. View Learning Roadmap Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-purple-900/50">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Interactive Roadmap Preview
          </span>
          <h2 className="text-xl md:text-2xl font-black">
            Dependency-Aware Learning Tracks
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Never get stuck without prerequisites. See how HTML unlocks CSS and JavaScript, how JavaScript leads to React, and how C or Python unlocks Data Structures & Algorithms.
          </p>
        </div>

        <button
          onClick={() => onNavigateTo('roadmap')}
          className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center gap-2 shrink-0 group"
        >
          <span>Open Full Interactive Roadmap</span>
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}