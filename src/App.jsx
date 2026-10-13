// /app/src/App.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CourseGrid from './components/CourseGrid';
import LearningRoadmap from './components/LearningRoadmap';
import MyLearning from './components/MyLearning';
import ProfileForm from './components/ProfileForm';
import DemoProfiles from './components/DemoProfiles';
import CourseDetailsModal from './components/CourseDetailsModal';

import { COURSES, DEMO_PROFILES } from './data/courses';
import { getRecommendedCourses } from './utils/recommendationEngine';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from './components/icons';

// Local storage key helpers
const PREFS_STORAGE_PREFIX = 'skillpath_prefs_';
const PROGRESS_STORAGE_PREFIX = 'skillpath_progress_';
const ACTIVE_PROFILE_KEY = 'skillpath_active_profile';

export default function App() {
  // 1. Navigation state ('dashboard' | 'explore' | 'mylearning' | 'roadmap' | 'profile')
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 2. Active demo profile state ('profileA' | 'profileB')
  const [activeProfileKey, setActiveProfileKey] = useState(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_PROFILE_KEY);
      return saved === 'profileB' ? 'profileB' : 'profileA';
    } catch {
      return 'profileA';
    }
  });

  // 3. User Preferences state for active profile
  const [preferences, setPreferences] = useState(() => {
    try {
      const defaultProfile = DEMO_PROFILES.profileA;
      const saved = localStorage.getItem(`${PREFS_STORAGE_PREFIX}profileA`);
      if (saved) return JSON.parse(saved);
      return {
        interests: defaultProfile.interests,
        skills: defaultProfile.skills,
        studyHours: defaultProfile.studyHours
      };
    } catch {
      return {
        interests: ['Web Development', 'UI/UX Design'],
        skills: ['HTML', 'Basic Computer Knowledge'],
        studyHours: 5
      };
    }
  });

  // 4. Progress map state for active profile
  // format: { [courseId]: { status: 'completed' | 'in-progress' | 'not-started', progress: 0-100 } }
  const [progressMap, setProgressMap] = useState(() => {
    try {
      const saved = localStorage.getItem(`${PROGRESS_STORAGE_PREFIX}profileA`);
      if (saved) return JSON.parse(saved);

      // Default Profile A initial progress
      const initial = {};
      DEMO_PROFILES.profileA.initialCompletedCourses.forEach((id) => {
        initial[id] = { status: 'completed', progress: 100 };
      });
      DEMO_PROFILES.profileA.initialInProgressCourses.forEach((id) => {
        initial[id] = { status: 'in-progress', progress: 35 };
      });
      return initial;
    } catch {
      return {
        'html-fund': { status: 'completed', progress: 100 },
        'css-responsive': { status: 'in-progress', progress: 35 }
      };
    }
  });

  // 5. Selected course for details modal
  const [selectedCourse, setSelectedCourse] = useState(null);

  // 6. Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  }, []);

  // Sync active profile selection changes
  const switchProfile = (profileKey) => {
    try {
      const preset = DEMO_PROFILES[profileKey] || DEMO_PROFILES.profileA;
      setActiveProfileKey(profileKey);
      localStorage.setItem(ACTIVE_PROFILE_KEY, profileKey);

      // Load preferences for this profile
      const savedPrefs = localStorage.getItem(`${PREFS_STORAGE_PREFIX}${profileKey}`);
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      } else {
        const defaultPrefs = {
          interests: [...preset.interests],
          skills: [...preset.skills],
          studyHours: preset.studyHours
        };
        setPreferences(defaultPrefs);
        localStorage.setItem(`${PREFS_STORAGE_PREFIX}${profileKey}`, JSON.stringify(defaultPrefs));
      }

      // Load progress for this profile
      const savedProgress = localStorage.getItem(`${PROGRESS_STORAGE_PREFIX}${profileKey}`);
      if (savedProgress) {
        setProgressMap(JSON.parse(savedProgress));
      } else {
        const defaultProgress = {};
        preset.initialCompletedCourses.forEach((id) => {
          defaultProgress[id] = { status: 'completed', progress: 100 };
        });
        preset.initialInProgressCourses.forEach((id) => {
          defaultProgress[id] = { status: 'in-progress', progress: 40 };
        });
        setProgressMap(defaultProgress);
        localStorage.setItem(
          `${PROGRESS_STORAGE_PREFIX}${profileKey}`,
          JSON.stringify(defaultProgress)
        );
      }

      showToast(`Switched to ${preset.name} (${profileKey === 'profileA' ? 'Profile A' : 'Profile B'})`, 'info');
    } catch (e) {
      console.error('Error switching profile:', e);
    }
  };

  // Save preferences and persist in localStorage
  const handleSavePreferences = (newPrefs) => {
    setPreferences(newPrefs);
    try {
      localStorage.setItem(
        `${PREFS_STORAGE_PREFIX}${activeProfileKey}`,
        JSON.stringify(newPrefs)
      );
      showToast('Learning preferences saved & recommendations recomputed!', 'success');
    } catch (e) {
      console.error('Failed to persist preferences:', e);
    }
  };

  // Reset current profile to default configuration
  const handleResetDemo = () => {
    try {
      const preset = DEMO_PROFILES[activeProfileKey] || DEMO_PROFILES.profileA;

      const resetPrefs = {
        interests: [...preset.interests],
        skills: [...preset.skills],
        studyHours: preset.studyHours
      };

      const resetProgress = {};
      preset.initialCompletedCourses.forEach((id) => {
        resetProgress[id] = { status: 'completed', progress: 100 };
      });
      preset.initialInProgressCourses.forEach((id) => {
        resetProgress[id] = { status: 'in-progress', progress: 35 };
      });

      setPreferences(resetPrefs);
      setProgressMap(resetProgress);

      localStorage.setItem(`${PREFS_STORAGE_PREFIX}${activeProfileKey}`, JSON.stringify(resetPrefs));
      localStorage.setItem(`${PROGRESS_STORAGE_PREFIX}${activeProfileKey}`, JSON.stringify(resetProgress));

      showToast(`Reset ${preset.name}'s preferences and progress to defaults.`, 'info');
    } catch (e) {
      console.error('Reset error:', e);
    }
  };

  // Update a course status ('not-started' | 'in-progress' | 'completed')
  const handleUpdateStatus = (courseId, nextStatus) => {
    setProgressMap((prev) => {
      const current = prev[courseId] || { status: 'not-started', progress: 0 };
      const nextProgress =
        nextStatus === 'completed' ? 100 : nextStatus === 'in-progress' ? (current.progress > 0 ? current.progress : 40) : 0;

      const updated = {
        ...prev,
        [courseId]: {
          status: nextStatus,
          progress: nextProgress
        }
      };

      try {
        localStorage.setItem(
          `${PROGRESS_STORAGE_PREFIX}${activeProfileKey}`,
          JSON.stringify(updated)
        );
      } catch (e) {
        console.error('Error updating progress:', e);
      }

      const courseTitle = COURSES.find((c) => c.id === courseId)?.title || 'Course';
      if (nextStatus === 'completed') {
        showToast(`🎉 "${courseTitle}" marked as Completed! Prerequisites updated.`, 'success');
      } else if (nextStatus === 'in-progress') {
        showToast(`🚀 "${courseTitle}" moved to In Progress!`, 'info');
      } else {
        showToast(`"${courseTitle}" marked as Not Started.`, 'info');
      }

      return updated;
    });

    // Also update selectedCourse if modal is open
    setSelectedCourse((prev) => {
      if (prev && prev.id === courseId) {
        return {
          ...prev,
          status: nextStatus,
          progressPercent: nextStatus === 'completed' ? 100 : nextStatus === 'in-progress' ? 40 : 0
        };
      }
      return prev;
    });
  };

  // Update custom progress percentage
  const handleUpdateCourseProgress = (courseId, percentage) => {
    setProgressMap((prev) => {
      const nextStatus = percentage >= 100 ? 'completed' : 'in-progress';
      const updated = {
        ...prev,
        [courseId]: {
          status: nextStatus,
          progress: percentage
        }
      };

      try {
        localStorage.setItem(
          `${PROGRESS_STORAGE_PREFIX}${activeProfileKey}`,
          JSON.stringify(updated)
        );
      } catch (e) {
        console.error('Error setting progress:', e);
      }

      return updated;
    });
  };

  // Compute recommended courses dynamically whenever COURSES, preferences, or progressMap changes
  const enrichedCourses = useMemo(() => {
    return getRecommendedCourses(COURSES, preferences, progressMap);
  }, [preferences, progressMap]);

  // Keep selectedCourse updated if underlying data changes
  const activeSelectedCourse = useMemo(() => {
    if (!selectedCourse) return null;
    return enrichedCourses.find((c) => c.id === selectedCourse.id) || selectedCourse;
  }, [selectedCourse, enrichedCourses]);

  // Stats counters
  const completedCount = useMemo(() => {
    return Object.keys(progressMap).filter(
      (id) => progressMap[id]?.status === 'completed'
    ).length;
  }, [progressMap]);

  const inProgressCount = useMemo(() => {
    return Object.keys(progressMap).filter(
      (id) => progressMap[id]?.status === 'in-progress'
    ).length;
  }, [progressMap]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-purple-100 selection:text-purple-900">
      {/* Toast Notification Container */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 max-w-md border transition-all animate-in slide-in-from-bottom-5 ${
            toast.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
              : toast.type === 'error'
              ? 'bg-rose-900 text-rose-100 border-rose-700'
              : 'bg-purple-900 text-purple-100 border-purple-700'
          }`}
          role="status"
          aria-live="polite"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          ) : (
            <Info size={18} className="text-purple-300 shrink-0" />
          )}
          <span className="text-xs font-bold leading-snug">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white ml-auto"
            aria-label="Dismiss message"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        activeProfileKey={activeProfileKey}
        onSwitchProfile={switchProfile}
        preferences={preferences}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          activeProfileKey={activeProfileKey}
          preferences={preferences}
          completedCount={completedCount}
          inProgressCount={inProgressCount}
          totalCourses={COURSES.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentView === 'dashboard' && (
            <Dashboard
              preferences={preferences}
              courses={enrichedCourses}
              onSelectCourse={setSelectedCourse}
              onUpdateStatus={handleUpdateStatus}
              onNavigateTo={setCurrentView}
              activeProfileKey={activeProfileKey}
              onSwitchProfile={switchProfile}
            />
          )}

          {currentView === 'explore' && (
            <CourseGrid
              courses={enrichedCourses}
              onSelectCourse={setSelectedCourse}
              onUpdateStatus={handleUpdateStatus}
              onNavigateToProfile={() => setCurrentView('profile')}
            />
          )}

          {currentView === 'mylearning' && (
            <MyLearning
              courses={enrichedCourses}
              onSelectCourse={setSelectedCourse}
              onUpdateStatus={handleUpdateStatus}
              onUpdateCourseProgress={handleUpdateCourseProgress}
              onExploreCourses={() => setCurrentView('explore')}
            />
          )}

          {currentView === 'roadmap' && (
            <LearningRoadmap
              courses={enrichedCourses}
              onSelectCourse={setSelectedCourse}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {currentView === 'profile' && (
            <div className="space-y-10">
              <ProfileForm
                preferences={preferences}
                onSavePreferences={handleSavePreferences}
                onFindCourses={() => setCurrentView('dashboard')}
                onResetPreferences={handleResetDemo}
                activeProfileKey={activeProfileKey}
              />

              <div className="pt-6 border-t border-slate-200">
                <DemoProfiles
                  activeProfileKey={activeProfileKey}
                  onSwitchProfile={switchProfile}
                  onResetDemo={handleResetDemo}
                  currentPreferences={preferences}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Course Details Modal */}
      {activeSelectedCourse && (
        <CourseDetailsModal
          course={activeSelectedCourse}
          onClose={() => setSelectedCourse(null)}
          onUpdateStatus={handleUpdateStatus}
          studyHours={preferences.studyHours || 5}
        />
      )}

      {/* Compact Mobile Bottom Navigation */}
      <nav
        className="lg:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-4 flex items-center justify-around shadow-lg"
        aria-label="Mobile Bottom Navigation"
      >
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            currentView === 'dashboard' ? 'text-purple-600' : 'text-slate-500'
          }`}
        >
          <Sparkles size={18} />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentView('explore')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            currentView === 'explore' ? 'text-purple-600' : 'text-slate-500'
          }`}
        >
          <CourseGridIcon />
          <span>Courses</span>
        </button>

        <button
          onClick={() => setCurrentView('mylearning')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold relative ${
            currentView === 'mylearning' ? 'text-purple-600' : 'text-slate-500'
          }`}
        >
          <BookOpenIcon />
          <span>Learning</span>
          {inProgressCount > 0 && (
            <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-purple-600" />
          )}
        </button>

        <button
          onClick={() => setCurrentView('roadmap')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            currentView === 'roadmap' ? 'text-purple-600' : 'text-slate-500'
          }`}
        >
          <RoadmapIcon />
          <span>Roadmap</span>
        </button>

        <button
          onClick={() => setCurrentView('profile')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
            currentView === 'profile' ? 'text-purple-600' : 'text-slate-500'
          }`}
        >
          <UserIcon />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}

// Mini SVG icons for mobile bottom bar
function CourseGridIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function RoadmapIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}