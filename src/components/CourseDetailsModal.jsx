// /app/src/components/CourseDetailsModal.jsx
import React from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  Play,
  Sparkles,
  BookOpen,
  Award,
  AlertCircle,
  TrendingUp,
  Flame,
  Check
} from './icons';

export default function CourseDetailsModal({
  course,
  onClose,
  onUpdateStatus,
  studyHours = 5
}) {
  if (!course) return null;

  const {
    id,
    title,
    category,
    difficulty,
    durationWeeks,
    totalHours,
    estimatedWeeks,
    description,
    syllabus = [],
    learningOutcomes = [],
    score,
    scoreBreakdown,
    personalizedReason,
    status,
    readiness,
    prereqCheck,
    requiredSkills = [],
    rating,
    reviewsCount,
    enrolledCount
  } = course;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-6 md:p-8 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            aria-label="Close course details"
          >
            <X size={20} />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-xs text-white">
              {category}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 text-purple-200">
              {difficulty}
            </span>
            <div className="ml-auto inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-purple-900 text-xs font-black shadow-sm">
              <Sparkles size={13} className="text-purple-600" />
              <span>{score}% Recommended</span>
            </div>
          </div>

          <h2 id="course-modal-title" className="text-2xl md:text-3xl font-black tracking-tight mb-2">
            {title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-purple-100 pt-2 border-t border-white/20">
            <div className="flex items-center gap-1 font-semibold">
              <Clock size={14} />
              <span>{totalHours} Total Hours ({durationWeeks} Weeks)</span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-amber-300">
              <span>★ {rating} ({reviewsCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{(enrolledCount / 1000).toFixed(1)}k Students Enrolled</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6 text-slate-800 text-xs">
          {/* Recommendation Reason Box */}
          {personalizedReason && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                <Sparkles size={16} className="text-purple-600" />
                <span>Why This Course Was Recommended</span>
              </div>
              <p className="text-xs text-purple-950 font-medium leading-relaxed">
                {personalizedReason}
              </p>

              {scoreBreakdown && (
                <div className="pt-2 border-t border-purple-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                  <div className="bg-white/80 p-2 rounded-xl">
                    <span className="text-slate-500 block">Interest (40%)</span>
                    <span className="font-bold text-purple-700">{scoreBreakdown.interestScore} / 40</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl">
                    <span className="text-slate-500 block">Skill (30%)</span>
                    <span className="font-bold text-purple-700">{scoreBreakdown.skillScore} / 30</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl">
                    <span className="text-slate-500 block">Difficulty (15%)</span>
                    <span className="font-bold text-purple-700">{scoreBreakdown.difficultyScore} / 15</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl">
                    <span className="text-slate-500 block">Pace (15%)</span>
                    <span className="font-bold text-purple-700">{scoreBreakdown.timeScore} / 15</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Prerequisite Alert if not satisfied */}
          {!prereqCheck.isSatisfied && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 mb-0.5">
                  Prerequisites Required to Start
                </h4>
                <p className="text-xs text-amber-800 leading-snug">
                  {prereqCheck.warningText}. You must mark prerequisite courses as "Completed" in your profile or My Learning view to satisfy this requirement.
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Course Overview
            </h4>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
              {description}
            </p>
          </div>

          {/* Pace & Duration Estimation */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Estimated Time to Complete
              </span>
              <span className="text-sm font-extrabold text-slate-900">
                ~{estimatedWeeks} Weeks at {studyHours} hrs/week
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-purple-100 text-purple-800 text-xs font-bold flex items-center gap-1.5">
              <TrendingUp size={14} />
              <span>Personalized Pace</span>
            </div>
          </div>

          {/* Learning Outcomes */}
          {learningOutcomes.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                What You'll Learn
              </h4>
              <ul className="space-y-2">
                {learningOutcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="p-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="text-xs text-slate-700 leading-relaxed font-medium">
                      {outcome}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Course Syllabus */}
          {syllabus.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Curriculum Syllabus
              </h4>
              <div className="space-y-2">
                {syllabus.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 flex items-center gap-3 font-medium"
                  >
                    <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Current Status:</span>
            <select
              value={status}
              onChange={(e) => onUpdateStatus(id, e.target.value)}
              className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 shadow-2xs hover:border-purple-400"
            >
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              Close
            </button>

            {status !== 'completed' ? (
              <button
                onClick={() => {
                  onUpdateStatus(id, status === 'in-progress' ? 'completed' : 'in-progress');
                }}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2 ${
                  status === 'in-progress'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {status === 'in-progress' ? (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Mark as Completed</span>
                  </>
                ) : (
                  <>
                    <Play size={13} className="fill-white" />
                    <span>Start Course</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => onUpdateStatus(id, 'in-progress')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={14} />
                <span>Mark In Progress Again</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
