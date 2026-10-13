// /client/src/utils/recommendationEngine.js

/**
 * CourseCompass Recommendation Engine
 * -----------------------------------
 * Inputs:
 *   courses      : Array of course objects (from Supabase via db.js)
 *   preferences  : { interests: string[], skills: string[], studyHours: number }
 *   progressMap  : { [courseId]: { status: 'not-started'|'in-progress'|'completed', progress: number } }
 *
 * Output:
 *   Array of enriched courses with:
 *     - score, personalizedReason, readiness
 *     - prereqCheck { isSatisfied, warningText }
 *     - estimatedWeeks, scoreBreakdown
 *     - status (from progressMap)
 */

const WEEKLY_HOURS_DEFAULT = 5;

// Weights
const WEIGHT_INTEREST = 40;
const WEIGHT_SKILL = 30;
const WEIGHT_DIFFICULTY = 15;
const WEIGHT_TIME = 15;

/**
 * Difficulty ordering
 */
const DIFFICULTY_RANK = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

/**
 * Infer student's current level from known skills count
 */
function inferStudentLevel(skills = []) {
  const n = skills.length;
  if (n <= 2) return 'Beginner';
  if (n <= 5) return 'Intermediate';
  return 'Advanced';
}

/**
 * 1. INTEREST MATCH (0-40)
 */
function scoreInterest(course, interests = []) {
  if (!interests.length) return 0;
  const courseTopic = (course.category || course.topic || '').toLowerCase();
  const tags = (course.tags || []).map((t) => t.toLowerCase());

  for (const intr of interests) {
    const i = intr.toLowerCase();
    if (courseTopic === i) return WEIGHT_INTEREST; // exact topic match
    if (courseTopic.includes(i) || i.includes(courseTopic)) return WEIGHT_INTEREST * 0.8;
    if (tags.some((t) => t === i || t.includes(i) || i.includes(t))) {
      return WEIGHT_INTEREST * 0.6;
    }
  }
  return 0;
}

/**
 * 2. SKILL MATCH (0-30)
 * Fraction of required skills the student already knows
 */
function scoreSkill(course, knownSkills = []) {
  const required = course.requiredSkills || [];
  if (!required.length) return WEIGHT_SKILL * 0.5; // no prereq → partial credit
  const known = new Set(knownSkills.map((s) => s.toLowerCase()));
  let matched = 0;
  required.forEach((r) => {
    if (known.has(r.toLowerCase())) matched++;
  });
  return (matched / required.length) * WEIGHT_SKILL;
}

/**
 * 3. DIFFICULTY FIT (0-15)
 */
function scoreDifficulty(course, studentLevel) {
  const cRank = DIFFICULTY_RANK[course.difficulty] || 1;
  const sRank = DIFFICULTY_RANK[studentLevel] || 1;

  if (cRank === sRank) return WEIGHT_DIFFICULTY;
  if (cRank === sRank + 1) return WEIGHT_DIFFICULTY * 0.6; // slightly harder → OK
  if (cRank < sRank) return WEIGHT_DIFFICULTY * 0.4; // too easy
  return 0; // way too hard
}

/**
 * 4. TIME FIT (0-15)
 * Course should be completable within ~4 weeks at student's pace
 */
function scoreTime(course, studyHours = WEEKLY_HOURS_DEFAULT) {
  const totalHours = course.totalHours || course.durationHours || 0;
  if (!totalHours || !studyHours) return WEIGHT_TIME * 0.5;
  const weeksNeeded = totalHours / studyHours;
  if (weeksNeeded <= 4) return WEIGHT_TIME;
  if (weeksNeeded <= 8) return WEIGHT_TIME * 0.6;
  if (weeksNeeded <= 12) return WEIGHT_TIME * 0.3;
  return 0;
}

/**
 * Build human-readable reason from top scoring factor
 */
function buildReason(course, breakdown, preferences) {
  const { interestScore, skillScore, difficultyScore, timeScore } = breakdown;
  const reasons = [];

  if (interestScore >= WEIGHT_INTEREST * 0.8) {
    reasons.push(`Matches your interest in ${course.category || course.topic}.`);
  }
  if (skillScore >= WEIGHT_SKILL * 0.5 && (course.requiredSkills || []).length) {
    const matched = (course.requiredSkills || []).filter((r) =>
      (preferences.skills || [])
        .map((s) => s.toLowerCase())
        .includes(r.toLowerCase())
    );
    if (matched.length) {
      const pct = Math.round(
        (matched.length / course.requiredSkills.length) * 100
      );
      reasons.push(
        `You already know ${matched.join(', ')} — you're ${pct}% ready.`
      );
    }
  }
  if (timeScore >= WEIGHT_TIME * 0.8) {
    reasons.push(
      `Fits your ${preferences.studyHours || WEEKLY_HOURS_DEFAULT} hrs/week schedule.`
    );
  }
  if (difficultyScore >= WEIGHT_DIFFICULTY * 0.8) {
    reasons.push(`Perfect difficulty match for your current level.`);
  }

  if (!reasons.length) {
    reasons.push('Solid foundational course to broaden your skills.');
  }

  return reasons.slice(0, 2).join(' ');
}

/**
 * Check if prerequisites are satisfied
 * course.prerequisiteId → parent course
 */
function checkPrerequisites(course, allCourses, progressMap) {
  const prereqId = course.prerequisiteId;
  if (!prereqId) {
    return { isSatisfied: true, warningText: '' };
  }

  const prereqCourse = allCourses.find((c) => c.id === prereqId);
  const prereqStatus = progressMap[prereqId]?.status;

  if (prereqStatus === 'completed') {
    return { isSatisfied: true, warningText: '' };
  }

  const prereqTitle = prereqCourse?.title || 'the prerequisite course';
  return {
    isSatisfied: false,
    warningText: `Complete "${prereqTitle}" first to unlock this course.`,
  };
}

/**
 * MAIN FUNCTION
 */
export function getRecommendedCourses(
  courses = [],
  preferences = {},
  progressMap = {}
) {
  const interests = preferences.interests || [];
  const knownSkills = preferences.skills || [];
  const studyHours = preferences.studyHours || WEEKLY_HOURS_DEFAULT;
  const studentLevel = inferStudentLevel(knownSkills);

  const enriched = courses.map((course) => {
    const interestScore = scoreInterest(course, interests);
    const skillScore = scoreSkill(course, knownSkills);
    const difficultyScore = scoreDifficulty(course, studentLevel);
    const timeScore = scoreTime(course, studyHours);

    const rawScore =
      interestScore + skillScore + difficultyScore + timeScore;
    const score = Math.round(rawScore);

    const scoreBreakdown = {
      interestScore: Math.round(interestScore),
      skillScore: Math.round(skillScore),
      difficultyScore: Math.round(difficultyScore),
      timeScore: Math.round(timeScore),
    };

    const personalizedReason = buildReason(
      course,
      { interestScore, skillScore, difficultyScore, timeScore },
      preferences
    );

    const prereqCheck = checkPrerequisites(course, courses, progressMap);

    const totalHours = course.totalHours || course.durationHours || 0;
    const estimatedWeeks = studyHours
      ? Math.max(1, Math.ceil(totalHours / studyHours))
      : Math.max(1, Math.ceil(totalHours / WEEKLY_HOURS_DEFAULT));

    const status = progressMap[course.id]?.status || 'not-started';
    const progressPercent = progressMap[course.id]?.progress || 0;

    // Readiness
    let readiness;
    if (status === 'completed') readiness = 'Completed';
    else if (status === 'in-progress') readiness = 'In Progress';
    else if (!prereqCheck.isSatisfied) readiness = 'Prerequisite Required';
    else readiness = 'Ready to Start';

    return {
      ...course,
      score,
      scoreBreakdown,
      personalizedReason,
      prereqCheck,
      estimatedWeeks,
      status,
      progressPercent,
      readiness,
    };
  });

  // Sort by score desc
  return enriched.sort((a, b) => b.score - a.score);
}