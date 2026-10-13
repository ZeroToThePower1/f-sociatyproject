// /client/src/lib/adminService.js
import { supabase } from './supabaseClient';

// ============================================================
// ADMIN CHECK
// ============================================================
export function isAdmin(user) {
  return user?.user_metadata?.role === 'admin';
}

// ============================================================
// COURSES — ADMIN CRUD
// ============================================================
export async function adminCreateCourse(courseData) {
  const payload = {
    name: courseData.title,
    topic: courseData.category,
    difficulty: courseData.difficulty,
    required_skills: courseData.requiredSkills || [],
    duration_hours: courseData.totalHours || 0,
    description: courseData.description || '',
    short_description: courseData.shortDescription || '',
    prerequisite_course_id: courseData.prerequisiteId || null,
    syllabus: courseData.syllabus || [],
    learning_outcomes: courseData.learningOutcomes || [],
    rating: courseData.rating || 4.5,
    enrolled_count: courseData.enrolledCount || 1000,
  };

  const { data, error } = await supabase
    .from('courses')
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(`Create course failed: ${error.message}`);
  return data;
}

export async function adminUpdateCourse(courseId, courseData) {
  const payload = {
    name: courseData.title,
    topic: courseData.category,
    difficulty: courseData.difficulty,
    required_skills: courseData.requiredSkills || [],
    duration_hours: courseData.totalHours || 0,
    description: courseData.description || '',
    short_description: courseData.shortDescription || '',
    prerequisite_course_id: courseData.prerequisiteId || null,
    syllabus: courseData.syllabus || [],
    learning_outcomes: courseData.learningOutcomes || [],
    rating: courseData.rating || 4.5,
    enrolled_count: courseData.enrolledCount || 1000,
  };

  const { data, error } = await supabase
    .from('courses')
    .update(payload)
    .eq('id', courseId)
    .select()
    .single();

  if (error) throw new Error(`Update course failed: ${error.message}`);
  return data;
}

export async function adminDeleteCourse(courseId) {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', courseId);

  if (error) throw new Error(`Delete course failed: ${error.message}`);
}

// ============================================================
// USERS — READ ALL
// ============================================================
export async function adminFetchAllProfiles() {
  const { data, error } = await supabase
    .from('student_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Fetch profiles failed: ${error.message}`);
  return data || [];
}

// ============================================================
// PROGRESS — READ ALL (with joined data)
// ============================================================
export async function adminFetchAllProgress() {
  // Step 1: Fetch all progress rows
  const { data: progressData, error: progressError } = await supabase
    .from('progress')
    .select('*')
    .order('updated_at', { ascending: false });

  if (progressError) {
    throw new Error(`Fetch progress failed: ${progressError.message}`);
  }

  if (!progressData || progressData.length === 0) {
    return [];
  }

  // Step 2: Fetch all courses and profiles for lookup
  const [coursesRes, profilesRes] = await Promise.all([
    supabase.from('courses').select('id, name, topic'),
    supabase.from('student_profiles').select('user_id, name, interests'),
  ]);

  if (coursesRes.error) {
    throw new Error(`Fetch courses failed: ${coursesRes.error.message}`);
  }
  if (profilesRes.error) {
    throw new Error(`Fetch profiles failed: ${profilesRes.error.message}`);
  }

  // Step 3: Build lookup maps
  const coursesMap = {};
  (coursesRes.data || []).forEach((c) => {
    coursesMap[c.id] = c;
  });

  const profilesMap = {};
  (profilesRes.data || []).forEach((p) => {
    profilesMap[p.user_id] = p;
  });

  // Step 4: Join manually
  const enriched = progressData.map((p) => ({
    ...p,
    courses: coursesMap[p.course_id] || null,
    student_profiles: profilesMap[p.student_id] || null,
  }));

  return enriched;
}

// ============================================================
// STATS
// ============================================================
export async function adminFetchStats() {
  const [coursesRes, profilesRes, progressRes] = await Promise.all([
    supabase.from('courses').select('id', { count: 'exact', head: true }),
    supabase.from('student_profiles').select('id', { count: 'exact', head: true }),
    supabase.from('progress').select('status'),
  ]);

  if (coursesRes.error) throw new Error(coursesRes.error.message);
  if (profilesRes.error) throw new Error(profilesRes.error.message);
  if (progressRes.error) throw new Error(progressRes.error.message);

  const progressData = progressRes.data || [];
  const completed = progressData.filter((p) => p.status === 'completed').length;
  const inProgress = progressData.filter((p) => p.status === 'in_progress').length;

  return {
    totalCourses: coursesRes.count || 0,
    totalUsers: profilesRes.count || 0,
    totalProgressRecords: progressData.length,
    completedCount: completed,
    inProgressCount: inProgress,
  };
}