// /app/src/components/DemoProfiles.jsx
import React from 'react';
import { DEMO_PROFILES } from '../data/courses';
import { User, Check, RefreshCw, Sparkles, Clock, BookOpen, ArrowRight } from './icons';

export default function DemoProfiles({
  activeProfileKey,
  onSwitchProfile,
  onResetDemo,
  currentPreferences
}) {
  return (
    <div className="demo-profiles-container space-y-6">
      {/* Intro Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
              <User size={18} />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Demo Persona Switcher
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Switch between pre-configured learner personas as requested. Each profile maintains its own separate course progress, completed prerequisites, recommendation scores, and roadmap state in local storage.
          </p>
        </div>

        <button
          onClick={onResetDemo}
          className="text-xs font-semibold px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-all flex items-center gap-1.5 shrink-0 shadow-2xs"
          title="Reset current profile progress and preferences to default"
        >
          <RefreshCw size={14} />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile A Card */}
        {(() => {
          const profA = DEMO_PROFILES.profileA;
          const isActive = activeProfileKey === 'profileA';
          return (
            <div
              className={`rounded-3xl p-6 border transition-all duration-300 relative flex flex-col justify-between ${
                isActive
                  ? 'bg-purple-50/50 border-purple-400 ring-2 ring-purple-200 shadow-md'
                  : 'bg-white border-slate-200 hover:border-purple-200 hover:shadow-sm'
              }`}
            >
              {isActive && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white shadow-xs">
                  <Check size={12} strokeWidth={3} />
                  Active Profile
                </span>
              )}

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl p-2 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    {profA.avatar}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 uppercase">
                        Profile A
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        {profA.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {profA.tagline}
                    </p>
                  </div>
                </div>

                {/* Profile Details List */}
                <div className="space-y-3 py-3 border-y border-slate-100/90 text-xs text-slate-700">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Interests (40% Weight):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {profA.interests.map((intr) => (
                        <span
                          key={intr}
                          className="px-2.5 py-1 rounded-lg bg-purple-100/80 text-purple-800 font-semibold"
                        >
                          {intr}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Known Skills (30% Weight):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {profA.skills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2.5 py-1 rounded-lg bg-indigo-100/80 text-indigo-800 font-semibold"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Weekly Study Hours:
                    </span>
                    <span className="font-extrabold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                      {profA.studyHours} hours / week
                    </span>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 text-[11px] text-amber-900 font-medium">
                    📌 <strong>Initial Readiness:</strong> Knows HTML &rarr; CSS and JS are Ready to Start! React is locked until JS is completed.
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onSwitchProfile('profileA')}
                  disabled={isActive}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-purple-200 text-purple-800 cursor-default'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                  }`}
                >
                  {isActive ? (
                    <span>Currently Selected</span>
                  ) : (
                    <>
                      <span>Switch to Profile A</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })()}

        {/* Profile B Card */}
        {(() => {
          const profB = DEMO_PROFILES.profileB;
          const isActive = activeProfileKey === 'profileB';
          return (
            <div
              className={`rounded-3xl p-6 border transition-all duration-300 relative flex flex-col justify-between ${
                isActive
                  ? 'bg-purple-50/50 border-purple-400 ring-2 ring-purple-200 shadow-md'
                  : 'bg-white border-slate-200 hover:border-purple-200 hover:shadow-sm'
              }`}
            >
              {isActive && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white shadow-xs">
                  <Check size={12} strokeWidth={3} />
                  Active Profile
                </span>
              )}

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl p-2 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    {profB.avatar}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 uppercase">
                        Profile B
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        {profB.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      {profB.tagline}
                    </p>
                  </div>
                </div>

                {/* Profile Details List */}
                <div className="space-y-3 py-3 border-y border-slate-100/90 text-xs text-slate-700">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Interests (40% Weight):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {profB.interests.map((intr) => (
                        <span
                          key={intr}
                          className="px-2.5 py-1 rounded-lg bg-purple-100/80 text-purple-800 font-semibold"
                        >
                          {intr}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Known Skills (30% Weight):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {profB.skills.map((sk) => (
                        <span
                          key={sk}
                          className="px-2.5 py-1 rounded-lg bg-indigo-100/80 text-indigo-800 font-semibold"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Weekly Study Hours:
                    </span>
                    <span className="font-extrabold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                      {profB.studyHours} hours / week
                    </span>
                  </div>

                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 text-[11px] text-emerald-900 font-medium">
                    📌 <strong>Initial Readiness:</strong> Knows Python &rarr; DSA and Intro to AI are Ready to Start! Unlocks algorithm roadmap.
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onSwitchProfile('profileB')}
                  disabled={isActive}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-purple-200 text-purple-800 cursor-default'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                  }`}
                >
                  {isActive ? (
                    <span>Currently Selected</span>
                  ) : (
                    <>
                      <span>Switch to Profile B</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}