// /client/src/lib/db.js
import { supabase } from './supabaseClient';

// ============================================================
// COURSES
// ============================================================
export async function fetchCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(`fetchCourses: ${error.message}`);

  // Transform Supabase row → app's course shape
  // (matching what CourseCard, CourseGrid, CourseDetailsModal expect)
  return data.map((row) => ({
    id: row.id,
    title: row.name,
    category: row.topic,              // CourseGrid uses `category`
    topic: row.topic,
    difficulty: row.difficulty,
    requiredSkills: row.required_skills || [],
    totalHours: row.duration_hours || 0,
    durationHours: row.duration_hours || 0,
    // Derive durationWeeks: totalHours / 5 (avg 5 hr/week)
    durationWeeks: Math.max(1, Math.ceil((row.duration_hours || 0) / 5)),
    description: row.description || '',
    shortDescription: row.short_description || row.description || '',
    prerequisiteId: row.prerequisite_course_id || null,
    syllabus: row.syllabus || [],
    learningOutcomes: row.learning_outcomes || [],
    rating: Number(row.rating) || 4.5,
    enrolledCount: row.enrolled_count || 1000,
    tags: [row.topic, row.difficulty],   // used in search
  }));
}

// ============================================================
// PROFILE
// ============================================================
export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error(`fetchProfile: ${error.message}`);
  return data;
}

export async function upsertProfile(userId, profile) {
  const payload = {
    user_id: userId,
    name: profile.name || '',
    interests: profile.interests || [],
    known_skills: profile.skills || [],
    hours_per_week: profile.studyHours || 5,
  };

  const { data, error } = await supabase
    .from('student_profiles')
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw new Error(`upsertProfile: ${error.message}`);
  return data;
}

// ============================================================
// PROGRESS
// ============================================================
export async function fetchProgress(userId) {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('student_id', userId);

  if (error) throw new Error(`fetchProgress: ${error.message}`);

  const map = {};
  data.forEach((row) => {
    map[row.course_id] = {
      status: row.status,
      progress:
        row.status === 'completed' ? 100 : row.status === 'in_progress' ? 40 : 0,
    };
  });
  return map;
}

export async function upsertProgress(userId, courseId, status) {
  const dbStatus = status.replace(/-/g, '_');

  const { error } = await supabase
    .from('progress')
    .upsert(
      {
        student_id: userId,
        course_id: courseId,
        status: dbStatus,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'student_id,course_id' }
    );

  if (error) throw new Error(`upsertProgress: ${error.message}`);
}

export async function upsertProgressPercent(userId, courseId, percentage) {
  const status =
    percentage >= 100 ? 'completed' : percentage > 0 ? 'in_progress' : 'not_started';
  const { error } = await supabase
    .from('progress')
    .upsert(
      {
        student_id: userId,
        course_id: courseId,
        status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'student_id,course_id' }
    );
  if (error) throw new Error(`upsertProgressPercent: ${error.message}`);
}