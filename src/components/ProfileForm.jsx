// /app/src/components/ProfileForm.jsx
import React, { useState, useEffect } from 'react';
import {
  INTEREST_OPTIONS,
  SKILL_OPTIONS
} from '../data/courses';
import {
  Sliders,
  Sparkles,
  Clock,
  BookOpen,
  Award,
  RefreshCw,
  Check,
  Zap,
  Info
} from './icons';

export default function ProfileForm({
  preferences,
  onSavePreferences,
  onFindCourses,
  onResetPreferences,
  activeProfileKey
}) {
  const [formData, setFormData] = useState({
    interests: preferences.interests || [],
    skills: preferences.skills || [],
    studyHours: preferences.studyHours || 5
  });

  const [savedNotification, setSavedNotification] = useState(false);

  // Sync when active profile or external preferences prop changes
  useEffect(() => {
    setFormData({
      interests: preferences.interests || [],
      skills: preferences.skills || [],
      studyHours: preferences.studyHours || 5
    });
  }, [preferences, activeProfileKey]);

  // Handle toggling of interests
  const toggleInterest = (interest) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      const nextInterests = exists
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: nextInterests };
    });
  };

  // Handle toggling of skills with 'None' handling
  const toggleSkill = (skill) => {
    setFormData((prev) => {
      if (skill === 'None') {
        // Toggling 'None' clears all other skills
        const hasNone = prev.skills.includes('None');
        return {
          ...prev,
          skills: hasNone ? [] : ['None']
        };
      }

      // Toggling any actual skill removes 'None'
      const withoutNone = prev.skills.filter((s) => s !== 'None');
      const exists = withoutNone.includes(skill);
      const nextSkills = exists
        ? withoutNone.filter((s) => s !== skill)
        : [...withoutNone, skill];

      return {
        ...prev,
        skills: nextSkills.length === 0 ? ['None'] : nextSkills
      };
    });
  };

  // Handle study hours change
  const handleHoursChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setFormData((prev) => ({ ...prev, studyHours: val }));
  };

  // Form submission / Find My Courses action
  const handleSubmit = (e) => {
    e?.preventDefault();
    onSavePreferences(formData);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
    if (onFindCourses) {
      onFindCourses();
    }
  };

  // Pacing descriptor based on hours slider
  const getPacingLabel = (hours) => {
    if (hours <= 3) return { text: 'Casual & Relaxed', color: 'text-blue-600', bg: 'bg-blue-50', emoji: '🌱' };
    if (hours <= 7) return { text: 'Balanced & Steady', color: 'text-purple-600', bg: 'bg-purple-50', emoji: '🎯' };
    if (hours <= 12) return { text: 'Accelerated Focus', color: 'text-indigo-600', bg: 'bg-indigo-50', emoji: '🚀' };
    return { text: 'Intensive Bootcamp', color: 'text-rose-600', bg: 'bg-rose-50', emoji: '🔥' };
  };

  const paceInfo = getPacingLabel(formData.studyHours);

  return (
    <div className="profile-form-container max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md mb-3">
            <Sliders size={14} />
            <span>Learning Preferences Engine</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            Customize Your Skill Journey
          </h2>
          <p className="text-purple-100 text-sm max-w-2xl leading-relaxed">
            Tell us what you want to learn, what you already know, and how much time you have.
            Our deterministic recommendation engine recomputes match scores in real time!
          </p>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {savedNotification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check size={18} className="text-emerald-600 font-bold" />
            <span className="text-sm font-bold">
              Preferences successfully updated! Recommendations recomputed.
            </span>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
            Saved
          </span>
        </div>
      )}

      {/* Main Form Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm space-y-8">
        {/* SECTION 1: Interests Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-base font-bold text-slate-900 block">
                Target Interests & Domains <span className="text-purple-600 font-extrabold">*</span>
              </label>
              <p className="text-xs text-slate-500">
                Select one or more domains you are eager to master (40% scoring weight).
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">
              {formData.interests.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-2">
            {INTEREST_OPTIONS.map((interest) => {
              const isSelected = formData.interests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`p-3 rounded-2xl text-xs font-semibold text-left transition-all border flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-200'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 hover:border-purple-300'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="leading-tight">{interest}</span>
                  {isSelected && <Check size={14} className="shrink-0 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: Existing Skills Selection */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-base font-bold text-slate-900 block">
                Your Current Skills <span className="text-purple-600 font-extrabold">*</span>
              </label>
              <p className="text-xs text-slate-500">
                Select skills you already know. Helps resolve prerequisites and calculate skill match (30% weight).
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {formData.skills.length} Selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-2">
            {SKILL_OPTIONS.map((skill) => {
              const isSelected = formData.skills.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`p-3 rounded-2xl text-xs font-semibold text-left transition-all border flex items-center justify-between gap-2 ${
                    isSelected
                      ? skill === 'None'
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 hover:border-indigo-300'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="leading-tight">{skill}</span>
                  {isSelected && <Check size={14} className="shrink-0 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: Study Hours Slider (1 - 20) */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="study-hours-slider" className="text-base font-bold text-slate-900 block">
                Weekly Study Commitment
              </label>
              <p className="text-xs text-slate-500">
                How many hours can you dedicate each week? (15% scoring weight & week estimation).
              </p>
            </div>

            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 ${paceInfo.bg}`}>
              <span className="text-sm">{paceInfo.emoji}</span>
              <span className={`text-xs font-bold ${paceInfo.color}`}>
                {paceInfo.text}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">1 hr/wk (Minimum)</span>
              <div className="text-center">
                <span className="text-4xl font-extrabold text-purple-700 tracking-tight">
                  {formData.studyHours}
                </span>
                <span className="text-sm font-bold text-slate-600 ml-1">hours / week</span>
              </div>
              <span className="text-xs font-bold text-slate-400">20 hrs/wk (Maximum)</span>
            </div>

            <input
              id="study-hours-slider"
              type="range"
              min="1"
              max="20"
              step="1"
              value={formData.studyHours}
              onChange={handleHoursChange}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600 hover:accent-purple-700 transition-all"
              aria-label="Weekly study hours slider from 1 to 20"
            />

            <div className="flex justify-between text-[11px] font-semibold text-slate-400 px-1">
              <span>Light Pace (1-4h)</span>
              <span>Consistent (5-8h)</span>
              <span>Dedicated (9-14h)</span>
              <span>Intensive (15-20h)</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: Action Controls Row */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onResetPreferences}
            className="w-full sm:w-auto text-xs font-semibold px-4 py-3 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} />
            <span>Reset to Profile Defaults</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-md shadow-purple-300 hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <Sparkles size={16} />
              <span>Find My Courses</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}