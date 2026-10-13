// /client/src/components/AdminPanel.jsx
import './AdminPanel.css';

import React, { useState, useEffect } from 'react';
import {
  adminFetchStats,
  adminFetchAllProfiles,
  adminFetchAllProgress,
  adminCreateCourse,
  adminUpdateCourse,
  adminDeleteCourse,
} from '../lib/adminService';
import { fetchCourses } from '../lib/db';
import {
  BookOpen,
  User,
  CheckCircle2,
  Play,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from './icons';

const TABS = [
  { id: 'stats', label: 'Overview', icon: TrendingUp },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'users', label: 'Users', icon: User },
  { id: 'progress', label: 'Progress', icon: CheckCircle2 },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [progressList, setProgressList] = useState([]);

  // Course modal
  const [editingCourse, setEditingCourse] = useState(null); // null = closed, {} = new, {...} = edit
  const [courseForm, setCourseForm] = useState({
    title: '',
    category: 'Web Development',
    difficulty: 'Beginner',
    totalHours: 10,
    durationWeeks: 2,
    description: '',
    shortDescription: '',
    requiredSkills: [],
    rating: 4.5,
    enrolledCount: 1000,
  });

  // ---------------------------------------------------------------
  // Load all admin data
  // ---------------------------------------------------------------
  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsData, coursesData, profilesData, progressData] = await Promise.all([
        adminFetchStats(),
        fetchCourses(),
        adminFetchAllProfiles(),
        adminFetchAllProgress(),
      ]);
      setStats(statsData);
      setCourses(coursesData);
      setProfiles(profilesData);
      setProgressList(progressData);
    } catch (err) {
      console.error('Admin load error:', err);
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const notifySuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  // ---------------------------------------------------------------
  // Course CRUD handlers
  // ---------------------------------------------------------------
  const openNewCourse = () => {
    setCourseForm({
      title: '',
      category: 'Web Development',
      difficulty: 'Beginner',
      totalHours: 10,
      durationWeeks: 2,
      description: '',
      shortDescription: '',
      requiredSkills: [],
      rating: 4.5,
      enrolledCount: 1000,
    });
    setEditingCourse({});
  };

  const openEditCourse = (course) => {
    setCourseForm({
      title: course.title || '',
      category: course.category || 'Web Development',
      difficulty: course.difficulty || 'Beginner',
      totalHours: course.totalHours || 10,
      durationWeeks: course.durationWeeks || 2,
      description: course.description || '',
      shortDescription: course.shortDescription || '',
      requiredSkills: course.requiredSkills || [],
      rating: course.rating || 4.5,
      enrolledCount: course.enrolledCount || 1000,
      prerequisiteId: course.prerequisiteId || null,
    });
    setEditingCourse(course);
  };

  const handleSaveCourse = async () => {
    if (!courseForm.title.trim()) {
      setError('Course title required');
      return;
    }
    try {
      setLoading(true);
      if (editingCourse?.id) {
        await adminUpdateCourse(editingCourse.id, courseForm);
        notifySuccess(`Course "${courseForm.title}" updated`);
      } else {
        await adminCreateCourse(courseForm);
        notifySuccess(`Course "${courseForm.title}" created`);
      }
      setEditingCourse(null);
      await loadAll();
    } catch (err) {
      console.error('Save course error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (course) => {
    if (!window.confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
    try {
      setLoading(true);
      await adminDeleteCourse(course.id);
      notifySuccess(`Course "${course.title}" deleted`);
      await loadAll();
    } catch (err) {
      console.error('Delete course error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Skill toggle helper
  const toggleRequiredSkill = (skill) => {
    setCourseForm((prev) => {
      const exists = prev.requiredSkills.includes(skill);
      return {
        ...prev,
        requiredSkills: exists
          ? prev.requiredSkills.filter((s) => s !== skill)
          : [...prev.requiredSkills, skill],
      };
    });
  };

  const ALL_SKILLS = [
    'HTML', 'CSS', 'JavaScript', 'React', 'Python',
    'Statistics', 'UI/UX Design Principles', 'Node.js',
  ];

  // ---------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-purple-200 text-xs font-semibold backdrop-blur-md mb-2">
              <Sparkles size={13} />
              <span>Admin Console</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              SkillPath Administration
            </h1>
            <p className="text-xs text-purple-200 mt-1">
              Manage courses, view users, and monitor platform activity.
            </p>
          </div>

          <button
            onClick={loadAll}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5">
          <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="text-rose-600">
            <X size={14} />
          </button>
        </div>
      )}
      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2.5">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          <span className="flex-1">{success}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-sm flex items-center gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------- TAB: STATS ---------------- */}
      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatBox label="Total Courses" value={stats.totalCourses} color="purple" icon={BookOpen} />
          <StatBox label="Total Users" value={stats.totalUsers} color="indigo" icon={User} />
          <StatBox label="Progress Records" value={stats.totalProgressRecords} color="blue" icon={TrendingUp} />
          <StatBox label="Completed" value={stats.completedCount} color="emerald" icon={CheckCircle2} />
          <StatBox label="In Progress" value={stats.inProgressCount} color="amber" icon={Play} />
        </div>
      )}

      {/* ---------------- TAB: COURSES ---------------- */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              {courses.length} courses in catalog
            </p>
            <button
              onClick={openNewCourse}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>New Course</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-left text-slate-500 font-bold uppercase tracking-wider">
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Difficulty</th>
                    <th className="px-4 py-3">Hours</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr
                      key={course.id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50"
                    >
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {course.title}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{course.category}</td>
                      <td className="px-4 py-3 text-slate-600">{course.difficulty}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {course.totalHours}h
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditCourse(course)}
                            className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50"
                            title="Edit"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {courses.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-slate-400">
                        No courses yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB: USERS ---------------- */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-slate-500 font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Interests</th>
                  <th className="px-4 py-3">Skills</th>
                  <th className="px-4 py-3">Hours/Week</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr
                    key={profile.id}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {profile.name || 'Anonymous'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {(profile.interests || []).slice(0, 3).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {(profile.known_skills || []).slice(0, 3).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {profile.hours_per_week}h
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {profile.created_at
                        ? new Date(profile.created_at).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}
                {profiles.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-400">
                      No users yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------- TAB: PROGRESS ---------------- */}
      {activeTab === 'progress' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-slate-500 font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {progressList.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {p.student_profiles?.name || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {p.courses?.name || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={p.status} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {p.updated_at
                        ? new Date(p.updated_at).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}
                {progressList.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-slate-400">
                      No progress records yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------- COURSE MODAL ---------------- */}
      {editingCourse !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setEditingCourse(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {editingCourse?.id ? 'Edit Course' : 'New Course'}
              </h2>
              <button
                onClick={() => setEditingCourse(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <Field label="Title">
                <input
                  type="text"
                  value={courseForm.title}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="e.g. Advanced React Patterns"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Category">
                  <select
                    value={courseForm.category}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  >
                    <option>Web Development</option>
                    <option>Data Science</option>
                    <option>UI/UX Design</option>
                    <option>Computer Science</option>
                  </select>
                </Field>

                <Field label="Difficulty">
                  <select
                    value={courseForm.difficulty}
                    onChange={(e) =>
                      setCourseForm({ ...courseForm, difficulty: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Total Hours">
                  <input
                    type="number"
                    min="1"
                    value={courseForm.totalHours}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        totalHours: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </Field>
                <Field label="Rating (0-5)">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={courseForm.rating}
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        rating: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </Field>
              </div>

              <Field label="Short Description">
                <input
                  type="text"
                  value={courseForm.shortDescription}
                  onChange={(e) =>
                    setCourseForm({
                      ...courseForm,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  placeholder="One-line summary"
                />
              </Field>

              <Field label="Full Description">
                <textarea
                  rows="3"
                  value={courseForm.description}
                  onChange={(e) =>
                    setCourseForm({ ...courseForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs resize-none"
                  placeholder="Detailed overview..."
                />
              </Field>

              <Field label="Required Skills">
                <div className="flex flex-wrap gap-1.5">
                  {ALL_SKILLS.map((skill) => {
                    const isSelected = courseForm.requiredSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleRequiredSkill(skill)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setEditingCourse(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCourse}
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save size={14} />
                <span>{editingCourse?.id ? 'Update' : 'Create'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------
function StatBox({ label, value, color = 'purple', icon: Icon }) {
  const colors = {
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm space-y-2">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
        {Icon ? <Icon size={16} /> : null}
      </div>
      <div>
        <div className="text-2xl font-black text-slate-900">{value}</div>
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    completed: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    in_progress: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    not_started: 'bg-slate-100 text-slate-700 border-slate-300',
  };
  const label = {
    completed: 'Completed',
    in_progress: 'In Progress',
    not_started: 'Not Started',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
        map[status] || map.not_started
      }`}
    >
      {label[status] || status}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}