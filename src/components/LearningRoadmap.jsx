// /app/src/components/LearningRoadmap.jsx
import React from 'react';
import {
  CheckCircle2,
  Lock,
  Unlock,
  Play,
  ArrowRight,
  Sparkles,
  Info,
  ChevronRight,
  BookOpen,
  AlertCircle
} from './icons';

export default function LearningRoadmap({
  courses,
  onSelectCourse,
  onUpdateStatus
}) {
  // Helper to find enriched course by ID
  const getCourse = (id) => courses.find((c) => c.id === id) || { id, title: id };

  const htmlCourse = getCourse('html-fund');
  const cssCourse = getCourse('css-responsive');
  const jsCourse = getCourse('js-essentials');
  const reactCourse = getCourse('react-beginners');

  const cCourse = getCourse('c-prog');
  const pythonCourse = getCourse('python-prog');
  const dsaCourse = getCourse('dsa');

  const sqlCourse = getCourse('sql-db');
  const aiCourse = getCourse('intro-ai');

  const uiuxCourse = getCourse('ui-ux-design');

  // Render a Roadmap Node Card
  const renderNodeCard = (course, stepNumber, note = '') => {
    const isCompleted = course.readiness === 'Completed';
    const isInProgress = course.readiness === 'In Progress';
    const isReady = course.readiness === 'Ready to Start';
    const isLocked = course.readiness === 'Prerequisite Required';

    const nodeBorder = isCompleted
      ? 'border-emerald-300 bg-emerald-50/30'
      : isInProgress
      ? 'border-purple-400 bg-purple-50/40 shadow-md ring-2 ring-purple-200'
      : isReady
      ? 'border-indigo-300 bg-white hover:border-indigo-400'
      : 'border-slate-200 bg-slate-50/70 opacity-90';

    return (
      <div
        className={`roadmap-node rounded-2xl border p-4 transition-all duration-200 relative group flex flex-col justify-between ${nodeBorder}`}
      >
        <div>
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-[11px] font-bold text-slate-700">
                {stepNumber}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {course.category}
              </span>
            </div>

            {/* Status Pill */}
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 size={12} /> Done
              </span>
            )}
            {isInProgress && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                <Play size={10} className="fill-purple-700" /> Active
              </span>
            )}
            {isReady && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300">
                <Unlock size={11} /> Ready
              </span>
            )}
            {isLocked && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                <Lock size={11} /> Locked
              </span>
            )}
          </div>

          {/* Title */}
          <h4
            onClick={() => onSelectCourse(course)}
            className="text-sm font-bold text-slate-900 hover:text-purple-700 transition-colors cursor-pointer mb-1 leading-snug"
          >
            {course.title}
          </h4>

          {note && (
            <p className="text-[11px] font-medium text-slate-500 mb-2">
              {note}
            </p>
          )}

          {/* Missing Prereq Message */}
          {isLocked && course.prereqCheck && !course.prereqCheck.isSatisfied && (
            <div className="bg-amber-100/70 border border-amber-300 rounded-lg p-2 text-[11px] text-amber-900 font-semibold mb-2 flex items-start gap-1.5">
              <AlertCircle size={13} className="shrink-0 mt-0.5 text-amber-700" />
              <span>{course.prereqCheck.warningText}</span>
            </div>
          )}
        </div>

        {/* Footer Quick Action */}
        <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between gap-2">
          <button
            onClick={() => onSelectCourse(course)}
            className="text-[11px] font-semibold text-slate-600 hover:text-purple-700 transition-colors flex items-center gap-1"
          >
            <BookOpen size={12} />
            <span>Details</span>
          </button>

          <select
            value={course.status}
            onChange={(e) => onUpdateStatus(course.id, e.target.value)}
            className="text-[11px] font-semibold py-1 px-2 rounded-lg border border-slate-300 bg-white text-slate-800 shadow-2xs hover:border-purple-400"
            aria-label={`Update progress for ${course.title}`}
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="learning-roadmap-container space-y-8 max-w-5xl mx-auto">
      {/* Intro Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-purple-700">
          <Sparkles size={20} />
          <h2 className="text-xl font-extrabold text-slate-900">
            Interactive Dependency-Aware Roadmap
          </h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Visual learning paths ordered strictly by prerequisite dependencies. Dependent courses remain locked until their prerequisites are fulfilled. Notice that <strong>DSA</strong> accepts either <strong>C Programming</strong> OR <strong>Python</strong>!
        </p>

        {/* Roadmap Legend */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs font-semibold">
          <span className="text-slate-400 uppercase tracking-wider text-[11px]">Legend:</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 size={12} /> Completed
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
            <Play size={10} className="fill-purple-700" /> In Progress
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
            <Unlock size={11} /> Ready to Start
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
            <Lock size={11} /> Prerequisite Required (Locked)
          </span>
        </div>
      </div>

      {/* TRACK 1: Modern Web Development Path */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
              🌐
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Track 1: Full-Stack Web Development
              </h3>
              <p className="text-xs text-slate-500">
                Sequential dependency: HTML &rarr; CSS & JS &rarr; React
              </p>
            </div>
          </div>
        </div>

        {/* Node Layout for Web Dev */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start relative pt-2">
          {/* Step 1: HTML */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Step 1: Foundation
            </div>
            {renderNodeCard(htmlCourse, 1, 'Fundamental markup required for CSS and JS')}
          </div>

          {/* Step 2: CSS and JavaScript */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Step 2: Core Styling & Interactivity (Requires HTML)
            </div>
            <div className="space-y-3">
              {renderNodeCard(cssCourse, '2A', 'Requires HTML Fundamentals')}
              {renderNodeCard(jsCourse, '2B', 'Requires HTML Fundamentals')}
            </div>
          </div>

          {/* Step 3: React */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Step 3: SPA Framework (Requires JS)
            </div>
            {renderNodeCard(reactCourse, 3, 'Requires JavaScript Essentials')}
          </div>
        </div>
      </div>

      {/* TRACK 2: Core Systems, Algorithms & DSA Track (Alternative Prerequisites) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
              🧠
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Track 2: Data Structures, Logic & Algorithms
              </h3>
              <p className="text-xs text-slate-500">
                Supports Alternative Prerequisites: Complete <strong>either C Programming OR Python</strong> to unlock DSA!
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-2">
          {/* Step 1: Foundational Language Choice */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Step 1: Choose Your Programming Foundation (Pick Either)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderNodeCard(cCourse, '1A', 'Systems & Memory Model')}
              {renderNodeCard(pythonCourse, '1B', 'High-level & Versatile')}
            </div>

            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-center justify-between">
              <span className="font-semibold">Alternative Prerequisite Rule:</span>
              <span className="px-2 py-0.5 rounded-md bg-purple-200 text-purple-900 font-extrabold text-[11px]">
                C Programming OR Python
              </span>
            </div>
          </div>

          {/* Step 2: DSA */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Step 2: Technical Interview & Competitive Problem Solving
            </div>
            {renderNodeCard(dsaCourse, 2, 'Requires C Fundamentals OR Python')}
          </div>
        </div>
      </div>

      {/* TRACK 3: AI, Data Science & Databases */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-sm">
              🤖
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Track 3: Artificial Intelligence & Data Management
              </h3>
              <p className="text-xs text-slate-500">
                Python and SQL form the data foundation powering machine learning models
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-2">
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Step 1: Data Foundations
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderNodeCard(pythonCourse, '1A', 'Core AI language')}
              {renderNodeCard(sqlCourse, '1B', 'Relational database querying')}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Step 2: Machine Learning & Generative AI
            </div>
            {renderNodeCard(aiCourse, 2, 'Requires Python Programming')}
          </div>
        </div>
      </div>

      {/* TRACK 4: Product Design & UI/UX Track */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-sm">
              🎨
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Track 4: Product & Interface Design
              </h3>
              <p className="text-xs text-slate-500">
                Master design systems, typography, and wireframes to complement web development
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-md pt-2">
          {renderNodeCard(uiuxCourse, 1, 'Open to all (No programming prerequisites required)')}
        </div>
      </div>
    </div>
  );
}