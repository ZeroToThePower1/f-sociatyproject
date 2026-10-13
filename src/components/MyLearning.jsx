// /app/src/components/MyLearning.jsx
import React, { useState } from 'react';
import {
  CheckCircle2,
  Play,
  Clock,
  BookOpen,
  Sparkles,
  Unlock,
  Lock,
  ChevronRight,
  TrendingUp,
  Award
} from './icons';

export default function MyLearning({
  courses,
  onSelectCourse,
  onUpdateStatus,
  onUpdateCourseProgress,
  onExploreCourses
}) {
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'in-progress' | 'completed' | 'not-started'

  // Counters
  const completedCourses = courses.filter((c) => c.status === 'completed');
  const inProgressCourses = courses.filter((c) => c.status === 'in-progress');
  const notStartedCourses = courses.filter((c) => c.status === 'not-started');

  const overallPercent = Math.round((completedCourses.length / courses.length) * 100);

  // Filter courses by selected tab
  const displayedCourses = courses.filter((c) => {
    if (activeTab === 'All') return true;
    return c.status === activeTab;
  });

  return (
    <div className="my-learning-container space-y-6 max-w-5xl mx-auto">
      {/* Progress Overview Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 rounded-3xl p-6 md:p-8 text-white shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md inline-block mb-2">
              My Learning Journey
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Track Your Course Milestones
            </h2>
            <p className="text-xs text-purple-100 max-w-xl mt-1 leading-relaxed">
              Every status update instantly unlocks dependent roadmap nodes and updates your recommendation scores across the entire platform.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0 min-w-[140px]">
            <span className="text-3xl font-black">{completedCourses.length} / {courses.length}</span>
            <span className="text-xs block text-purple-200 font-semibold mt-0.5">Courses Completed</span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-white/20">
          <div className="flex justify-between text-xs font-semibold text-purple-100">
            <span>Overall Curriculum Mastery</span>
            <span>{overallPercent}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-sm flex items-center gap-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('All')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
            activeTab === 'All'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>All Courses</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeTab === 'All' ? 'bg-purple-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {courses.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('in-progress')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
            activeTab === 'in-progress'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Play size={12} className={activeTab === 'in-progress' ? 'fill-white' : 'fill-slate-600'} />
          <span>In Progress</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeTab === 'in-progress' ? 'bg-indigo-700 text-white' : 'bg-indigo-50 text-indigo-700 font-bold'}`}>
            {inProgressCourses.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
            activeTab === 'completed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 size={13} />
          <span>Completed</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeTab === 'completed' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700 font-bold'}`}>
            {completedCourses.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('not-started')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
            activeTab === 'not-started'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Not Started</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${activeTab === 'not-started' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
            {notStartedCourses.length}
          </span>
        </button>
      </div>

      {/* Courses List */}
      {displayedCourses.length > 0 ? (
        <div className="space-y-4">
          {displayedCourses.map((course) => {
            const isCompleted = course.status === 'completed';
            const isInProgress = course.status === 'in-progress';
            const isNotStarted = course.status === 'not-started';

            return (
              <div
                key={course.id}
                className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/15'
                    : isInProgress
                    ? 'border-purple-300 ring-1 ring-purple-100'
                    : 'border-slate-200/90'
                }`}
              >
                {/* Left course info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {course.category}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                      {course.difficulty}
                    </span>

                    {/* Readiness Pill */}
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <CheckCircle2 size={12} /> Completed
                      </span>
                    )}
                    {isInProgress && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 animate-pulse-slow">
                        <Play size={10} className="fill-purple-700" /> In Progress
                      </span>
                    )}
                    {isNotStarted && course.readiness === 'Ready to Start' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                        <Unlock size={11} /> Ready to Start
                      </span>
                    )}
                    {isNotStarted && course.readiness === 'Prerequisite Required' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                        <Lock size={11} /> Prerequisite Required
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => onSelectCourse(course)}
                    className="text-base font-bold text-slate-900 hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    {course.shortDescription}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium pt-1">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-purple-600" />
                      {course.totalHours} hrs ({course.durationWeeks} wks)
                    </span>
                    <span className="text-purple-700 font-semibold">
                      ★ {course.rating}
                    </span>
                  </div>

                  {/* Progress bar for In-Progress courses */}
                  {isInProgress && (
                    <div className="pt-2 max-w-md space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-600">
                        <span>Course Completion</span>
                        <span className="text-purple-700">{course.progressPercent || 40}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full transition-all duration-300"
                          style={{ width: `${course.progressPercent || 40}%` }}
                        />
                      </div>
                      {/* Step increments */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400 font-semibold">Quick Progress:</span>
                        {[25, 50, 75, 100].map((pct) => (
                          <button
                            key={pct}
                            onClick={() => {
                              if (pct === 100) {
                                onUpdateStatus(course.id, 'completed');
                              } else {
                                onUpdateCourseProgress(course.id, pct);
                              }
                            }}
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-purple-100 hover:text-purple-800 text-slate-700 transition-colors"
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* Working Status Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <label htmlFor={`mylearning-select-${course.id}`} className="sr-only">
                      Change Status
                    </label>
                    <select
                      id={`mylearning-select-${course.id}`}
                      value={course.status}
                      onChange={(e) => onUpdateStatus(course.id, e.target.value)}
                      className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 shadow-2xs hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="not-started">Not Started</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <button
                    onClick={() => onSelectCourse(course)}
                    className="text-xs font-semibold py-2 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-purple-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <BookOpen size={13} />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty tab state */
        <div className="bg-white rounded-3xl p-12 border border-dashed border-slate-300 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <BookOpen size={28} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No courses found under "{activeTab}"
            </h3>
            <p className="text-xs text-slate-500">
              Browse our course catalog or update existing course statuses to populate this list.
            </p>
          </div>
          <button
            onClick={onExploreCourses}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all inline-flex items-center gap-1.5"
          >
            <span>Explore Courses</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
