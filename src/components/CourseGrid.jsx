// /app/src/components/CourseGrid.jsx
import React, { useState, useMemo } from 'react';
import CourseCard from './CourseCard';
import { CATEGORIES, DIFFICULTIES } from '../data/courses';
import { Search, Filter, Sliders, X, Sparkles, BookOpen } from './icons';

export default function CourseGrid({
  courses,
  onSelectCourse,
  onUpdateStatus,
  onNavigateToProfile
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedReadiness, setSelectedReadiness] = useState('All');
  const [sortBy, setSortBy] = useState('score'); // 'score' | 'duration-asc' | 'duration-desc' | 'alphabetical'

  // Readiness filter options
  const readinessOptions = [
    'All',
    'Ready to Start',
    'In Progress',
    'Completed',
    'Prerequisite Required'
  ];

  // Filtering and sorting logic
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = (course.title || '').toLowerCase().includes(q);
          const matchDesc = (course.description || '').toLowerCase().includes(q);
          const matchCat = (course.category || '').toLowerCase().includes(q);
          const matchTags = (course.tags || []).some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchCat && !matchTags) return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && course.category !== selectedCategory) {
          return false;
        }

        // Difficulty filter
        if (selectedDifficulty !== 'All' && course.difficulty !== selectedDifficulty) {
          return false;
        }

        // Readiness filter
        if (selectedReadiness !== 'All' && course.readiness !== selectedReadiness) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') {
          return b.score - a.score;
        }
        if (sortBy === 'duration-asc') {
          return a.totalHours - b.totalHours;
        }
        if (sortBy === 'duration-desc') {
          return b.totalHours - a.totalHours;
        }
        if (sortBy === 'alphabetical') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [courses, searchQuery, selectedCategory, selectedDifficulty, selectedReadiness, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedReadiness('All');
    setSortBy('score');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedReadiness !== 'All';

  return (
    <div className="course-grid-container space-y-6">
      {/* Top Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        {/* Search Row */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by course title, topic, or tag (e.g. React, C, AI, SQL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all"
              aria-label="Search courses"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search query"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Controls: Difficulty, Readiness, Sort */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Difficulty select */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="filter-difficulty" className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                Difficulty:
              </label>
              <select
                id="filter-difficulty"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="text-xs font-semibold px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>

            {/* Readiness select */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="filter-readiness" className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                Readiness:
              </label>
              <select
                id="filter-readiness"
                value={selectedReadiness}
                onChange={(e) => setSelectedReadiness(e.target.value)}
                className="text-xs font-semibold px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {readinessOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort select */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="filter-sort" className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                Sort:
              </label>
              <select
                id="filter-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold px-2.5 py-2 bg-purple-50 border border-purple-200 rounded-xl text-purple-800 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="score">Best Recommendation Match</option>
                <option value="duration-asc">Duration (Shortest first)</option>
                <option value="duration-desc">Duration (Longest first)</option>
                <option value="alphabetical">Title (A to Z)</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold px-3 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1"
                aria-label="Reset all filters"
              >
                <X size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Slider / Row */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter size={13} />
            Category:
          </span>
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
                aria-pressed={isSelected}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm font-semibold text-slate-700">
          Showing <span className="text-purple-600 font-bold">{filteredCourses.length}</span> of {courses.length} courses
        </p>
        <span className="text-xs text-slate-500 font-medium">
          Scores updated from active profile preferences
        </span>
      </div>

      {/* Courses Grid or Empty State */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onSelectCourse={onSelectCourse}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      ) : (
        /* Empty State with action controls */
        <div className="bg-white rounded-3xl p-12 border border-dashed border-slate-300 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
            <BookOpen size={30} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              No matching courses found
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              We couldn't find any courses matching your search criteria or current filter selections.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold shadow-sm transition-all"
            >
              Reset Filters
            </button>
            {onNavigateToProfile && (
              <button
                onClick={onNavigateToProfile}
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold transition-all"
              >
                Edit Preferences
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}