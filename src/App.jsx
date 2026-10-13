// /client/src/App.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CourseGrid from './components/CourseGrid';
import LearningRoadmap from './components/LearningRoadmap';
import MyLearning from './components/MyLearning';
import ProfileForm from './components/ProfileForm';
import CourseDetailsModal from './components/CourseDetailsModal';
import AdminPanel from './components/AdminPanel';

// Auth screens
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';

// Supabase
import { supabase } from './lib/supabaseClient';
import {
  fetchCourses,
  fetchProfile,
  fetchProgress,
  upsertProfile,
  upsertProgress,
  upsertProgressPercent,
} from './lib/db';
import { isAdmin } from './lib/adminService';

import { getRecommendedCourses } from './utils/recommendationEngine';
import { CheckCircle2, Info, Sparkles, X } from './components/icons';

export default function App() {
  // -------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------
  const [currentView, setCurrentView] = useState('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthView =
    currentView === 'login' ||
    currentView === 'signup' ||
    currentView === 'forgot-password';

  // -------------------------------------------------------------------------
  // Auth (Supabase)
  // -------------------------------------------------------------------------
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // -------------------------------------------------------------------------
  // Data (from Supabase)
  // -------------------------------------------------------------------------
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [preferences, setPreferences] = useState({
    interests: [],
    skills: [],
    studyHours: 5,
  });
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState(null);

  // -------------------------------------------------------------------------
  // UI state
  // -------------------------------------------------------------------------
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  }, []);

  // -------------------------------------------------------------------------
  // Session restore + auth listener
  // -------------------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        setCurrentUser(session.user);
        setCurrentView('dashboard');
      } else {
        setCurrentView('login');
      }
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setCurrentUser(session?.user ?? null);
      if (session?.user) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('login');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // -------------------------------------------------------------------------
  // FETCH DATA FROM SUPABASE when user logs in
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!currentUser) {
      setCourses([]);
      setProgressMap({});
      setPreferences({ interests: [], skills: [], studyHours: 5 });
      return;
    }

    let cancelled = false;

    (async () => {
      setDataLoading(true);
      setDataError(null);
      try {
        const [coursesData, progressData, profileData] = await Promise.all([
          fetchCourses(),
          fetchProgress(currentUser.id),
          fetchProfile(currentUser.id),
        ]);

        if (cancelled) return;

        setCourses(coursesData);
        setProgressMap(progressData);

        if (profileData) {
          setPreferences({
            interests: profileData.interests || [],
            skills: profileData.known_skills || [],
            studyHours: profileData.hours_per_week || 5,
          });
        } else {
          const defaultProfile = {
            interests: ['Web Development'],
            skills: ['Basic Computer Knowledge'],
            studyHours: 5,
          };
          setPreferences(defaultProfile);
          await upsertProfile(currentUser.id, {
            ...defaultProfile,
            name: currentUser.email,
          });
        }
      } catch (err) {
        console.error('Data fetch failed:', err);
        if (!cancelled) setDataError(err.message || 'Failed to load data');
        showToast('Failed to load data from server.', 'error');
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentUser, showToast]);

  // -------------------------------------------------------------------------
  // Auth handlers
  // -------------------------------------------------------------------------
  const handleLogin = async (user) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleSignup = async (user) => {
    showToast(`Account created for ${user.email}. Please log in.`, 'success');
    setCurrentView('login');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Logout error:', e);
    }
    setCurrentUser(null);
    setCourses([]);
    setProgressMap({});
    showToast('Logged out.', 'info');
    setCurrentView('login');
  };

  // -------------------------------------------------------------------------
  // Preferences — save to Supabase
  // -------------------------------------------------------------------------
  const handleSavePreferences = async (newPrefs) => {
    setPreferences(newPrefs);
    if (!currentUser) return;
    try {
      await upsertProfile(currentUser.id, {
        ...newPrefs,
        name: currentUser.user_metadata?.name || currentUser.email,
      });
      showToast('Preferences saved!', 'success');
    } catch (err) {
      console.error('Save prefs error:', err);
      showToast('Failed to save preferences.', 'error');
    }
  };

  // -------------------------------------------------------------------------
  // Progress — save to Supabase
  // -------------------------------------------------------------------------
  const handleUpdateStatus = async (courseId, nextStatus) => {
    setProgressMap((prev) => {
      const current = prev[courseId] || { status: 'not-started', progress: 0 };
      const nextProgress =
        nextStatus === 'completed'
          ? 100
          : nextStatus === 'in-progress'
          ? current.progress > 0
            ? current.progress
            : 40
          : 0;
      return {
        ...prev,
        [courseId]: { status: nextStatus, progress: nextProgress },
      };
    });

    setSelectedCourse((prev) => {
      if (prev && prev.id === courseId) {
        return {
          ...prev,
          status: nextStatus,
          progressPercent:
            nextStatus === 'completed'
              ? 100
              : nextStatus === 'in-progress'
              ? 40
              : 0,
        };
      }
      return prev;
    });

    const courseTitle = courses.find((c) => c.id === courseId)?.title || 'Course';
    if (nextStatus === 'completed') {
      showToast(`🎉 "${courseTitle}" marked as Completed!`, 'success');
    } else if (nextStatus === 'in-progress') {
      showToast(`🚀 "${courseTitle}" moved to In Progress!`, 'info');
    } else {
      showToast(`"${courseTitle}" marked as Not Started.`, 'info');
    }

    if (currentUser) {
      try {
        await upsertProgress(currentUser.id, courseId, nextStatus);
      } catch (err) {
        console.error('Progress save error:', err);
        showToast('Failed to save progress.', 'error');
      }
    }
  };

  const handleUpdateCourseProgress = async (courseId, percentage) => {
    setProgressMap((prev) => {
      const nextStatus = percentage >= 100 ? 'completed' : 'in-progress';
      return {
        ...prev,
        [courseId]: { status: nextStatus, progress: percentage },
      };
    });

    if (currentUser) {
      try {
        await upsertProgressPercent(currentUser.id, courseId, percentage);
      } catch (err) {
        console.error('Progress percent save error:', err);
      }
    }
  };

  // -------------------------------------------------------------------------
  // Derived
  // -------------------------------------------------------------------------
  const enrichedCourses = useMemo(() => {
    return getRecommendedCourses(courses, preferences, progressMap);
  }, [courses, preferences, progressMap]);

  const activeSelectedCourse = useMemo(() => {
    if (!selectedCourse) return null;
    return (
      enrichedCourses.find((c) => c.id === selectedCourse.id) || selectedCourse
    );
  }, [selectedCourse, enrichedCourses]);

  const completedCount = useMemo(
    () =>
      Object.keys(progressMap).filter(
        (id) => progressMap[id]?.status === 'completed'
      ).length,
    [progressMap]
  );

  const inProgressCount = useMemo(
    () =>
      Object.keys(progressMap).filter(
        (id) => progressMap[id]?.status === 'in-progress'
      ).length,
    [progressMap]
  );

  const adminUser = isAdmin(currentUser);

  // -------------------------------------------------------------------------
  // Loading screen
  // -------------------------------------------------------------------------
  if (authLoading || (currentUser && dataLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {authLoading ? 'Loading SkillPath...' : 'Fetching your data...'}
          </span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Error screen
  // -------------------------------------------------------------------------
  if (currentUser && dataError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-xl border border-rose-200">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <Info size={28} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            Oops! Data load nahi hua
          </h2>
          <p className="text-xs text-slate-500 mb-5 break-words">{dataError}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors"
            >
              Retry
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-purple-100 selection:text-purple-900">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 max-w-md border ${
            toast.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
              : toast.type === 'error'
              ? 'bg-rose-900 text-rose-100 border-rose-700'
              : 'bg-purple-900 text-purple-100 border-purple-700'
          }`}
          role="status"
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

      {!isAuthView && (
        <Navbar
          currentView={currentView}
          onNavigate={setCurrentView}
          preferences={preferences}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          currentUser={currentUser}
          onLogout={handleLogout}
          isAdmin={adminUser}
        />
      )}

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {!isAuthView && (
          <Sidebar
            currentView={currentView}
            onNavigate={setCurrentView}
            preferences={preferences}
            completedCount={completedCount}
            inProgressCount={inProgressCount}
            totalCourses={courses.length}
            currentUser={currentUser}
            isAdmin={adminUser}
          />
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentView === 'login' && (
            <Login onLogin={handleLogin} onNavigate={setCurrentView} />
          )}

          {currentView === 'signup' && (
            <Signup onSignup={handleSignup} onNavigate={setCurrentView} />
          )}

          {currentView === 'forgot-password' && (
            <ForgotPassword
              onNavigate={setCurrentView}
              onResetSuccess={(email) =>
                showToast(`Password reset for ${email}.`, 'info')
              }
            />
          )}

          {currentView === 'dashboard' && (
            <Dashboard
              preferences={preferences}
              courses={enrichedCourses}
              onSelectCourse={setSelectedCourse}
              onUpdateStatus={handleUpdateStatus}
              onNavigateTo={setCurrentView}
              currentUser={currentUser}
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
            <ProfileForm
              preferences={preferences}
              onSavePreferences={handleSavePreferences}
              onFindCourses={() => setCurrentView('dashboard')}
            />
          )}

          {/* -------------------- ADMIN VIEW -------------------- */}
          {currentView === 'admin' && adminUser && (
            <AdminPanel />
          )}

          {/* Admin non-authorized fallback */}
          {currentView === 'admin' && !adminUser && (
            <div className="max-w-md mx-auto text-center bg-white rounded-3xl p-8 border border-rose-200 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <Info size={28} />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Access Denied
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Aapke paas admin permissions nahi hain.
              </p>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </main>
      </div>

      {activeSelectedCourse && (
        <CourseDetailsModal
          course={activeSelectedCourse}
          onClose={() => setSelectedCourse(null)}
          onUpdateStatus={handleUpdateStatus}
          studyHours={preferences.studyHours || 5}
        />
      )}

      {!isAuthView && (
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
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mini SVG icons for mobile bottom bar
// ---------------------------------------------------------------------------
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