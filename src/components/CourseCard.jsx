// /app/src/components/CourseCard.jsx
import React from 'react';
import {
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  Play,
  Sparkles,
  BookOpen,
  AlertCircle,
  Award,
  ChevronRight,
  TrendingUp,
  Flame
} from './icons';

export default function CourseCard({
  course,
  onSelectCourse,
  onUpdateStatus,
  compact = false
}) {
  const {
    id,
    title,
    category,
    difficulty,
    durationWeeks,
    totalHours,
    estimatedWeeks,
    shortDescription,
    score,
    personalizedReason,
    status,
    readiness,
    prereqCheck,
    requiredSkills,
    rating,
    enrolledCount
  } = course;

  // Difficulty badge styling
  const difficultyColors = {
    Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Intermediate: 'bg-violet-50 text-violet-700 border-violet-200',
    Advanced: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  // Readiness / Status pill styling
  const renderReadinessBadge = () => {
    switch (readiness) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
            <CheckCircle2 size={13} className="text-emerald-700" />
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-300 animate-pulse-slow">
            <Play size={13} className="fill-indigo-700 text-indigo-700" />
            In Progress
          </span>
        );
      case 'Ready to Start':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300">
            <Unlock size={13} className="text-purple-700" />
            Ready to Start
          </span>
        );
      case 'Prerequisite Required':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <Lock size={13} className="text-amber-700" />
            Prerequisite Required
          </span>
        );
    }
  };

  // Score badge coloring
  const getScoreColor = (num) => {
    if (num >= 85) return 'bg-purple-600 text-white';
    if (num >= 70) return 'bg-indigo-600 text-white';
    if (num >= 50) return 'bg-amber-500 text-white';
    return 'bg-slate-500 text-white';
  };

  return (
    <div
      className={`course-card bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative group hover:shadow-xl hover:-translate-y-1 ${
        status === 'in-progress'
          ? 'border-purple-300 ring-2 ring-purple-100 shadow-md'
          : status === 'completed'
          ? 'border-emerald-200 bg-emerald-50/10'
          : 'border-slate-200/90 shadow-sm hover:border-purple-200'
      }`}
    >
      {/* Top Banner & Header info */}
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
              {category}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                difficultyColors[difficulty] || difficultyColors.Beginner
              }`}
            >
              {difficulty}
            </span>
          </div>

          {/* Recommendation Score Pill */}
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs ${getScoreColor(
              score
            )}`}
            title={`Recommendation Score: ${score}/100`}
            aria-label={`Recommendation Match: ${score}%`}
          >
            <Sparkles size={12} />
            <span>{score}% Match</span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelectCourse(course)}
          className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-2 cursor-pointer mb-2"
        >
          {title}
        </h3>

        {/* Short Description */}
        <p className="text-xs font-normal text-slate-600 line-clamp-2 mb-3 leading-relaxed">
          {shortDescription}
        </p>

        {/* Key Attributes Bar */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 py-2 border-y border-slate-100 mb-3">
          <div className="flex items-center gap-1 font-medium">
            <Clock size={13} className="text-purple-600" />
            <span>{totalHours} hrs</span>
            <span className="text-slate-400">({durationWeeks} wks)</span>
          </div>
          {estimatedWeeks && (
            <div className="flex items-center gap-1 font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
              <TrendingUp size={12} />
              <span>~{estimatedWeeks} wks at pace</span>
            </div>
          )}
          {rating && (
            <div className="flex items-center gap-1 ml-auto text-amber-600 font-semibold">
              <span>★ {rating}</span>
              <span className="text-slate-400 font-normal">
                ({(enrolledCount / 1000).toFixed(1)}k)
              </span>
            </div>
          )}
        </div>

        {/* Required Skills tags */}
        <div className="mb-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Prerequisites / Skills:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {requiredSkills && requiredSkills.length > 0 ? (
              requiredSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60"
                >
                  {sk}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-slate-400">None (Open to all)</span>
            )}
          </div>
        </div>

        {/* Personalized Recommendation Reason */}
        {personalizedReason && (
          <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-2.5 mb-3">
            <div className="flex items-start gap-2">
              <span className="text-sm shrink-0">💡</span>
              <p className="text-xs text-purple-950 font-medium leading-relaxed">
                {personalizedReason}
              </p>
            </div>
          </div>
        )}

        {/* Missing Prerequisite Warning Banner if locked */}
        {!prereqCheck.isSatisfied && readiness === 'Prerequisite Required' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 mb-3">
            <div className="flex items-start gap-2">
              <AlertCircle size={15} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-900">
                  Prerequisite Warning
                </p>
                <p className="text-[11px] font-medium text-amber-800 leading-snug">
                  {prereqCheck.warningText}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions & Status Dropdown */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Readiness Status Pill */}
          <div>{renderReadinessBadge()}</div>

          {/* Working Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <label htmlFor={`status-select-${id}`} className="sr-only">
              Update Status for {title}
            </label>
            <select
              id={`status-select-${id}`}
              value={status}
              onChange={(e) => onUpdateStatus(id, e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 shadow-2xs hover:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors"
            >
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onSelectCourse(course)}
            className="flex-1 text-xs font-semibold py-2 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-purple-700 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            aria-label={`View Course Details for ${title}`}
          >
            <BookOpen size={14} />
            <span>Course Details</span>
          </button>

          {status !== 'completed' ? (
            <button
              onClick={() => {
                if (status === 'in-progress') {
                  onUpdateStatus(id, 'completed');
                } else {
                  onUpdateStatus(id, 'in-progress');
                }
              }}
              className={`text-xs font-bold py-2 px-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                status === 'in-progress'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
              aria-label={
                status === 'in-progress'
                  ? `Mark ${title} as Completed`
                  : `Start Learning ${title}`
              }
            >
              {status === 'in-progress' ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Mark Done</span>
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
              className="text-xs font-semibold py-2 px-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-all flex items-center justify-center gap-1.5"
              aria-label={`Review ${title}`}
            >
              <CheckCircle2 size={14} className="text-emerald-700" />
              <span>Reviewing</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}