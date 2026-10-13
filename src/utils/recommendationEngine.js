/**
 * SkillPath Smart Recommendation Engine
 * Deterministic scoring algorithm adhering to:
 * - Interest match: 40%
 * - Skill match: 30%
 * - Difficulty suitability: 15%
 * - Weekly time compatibility: 15%
 *
 * Enforces strict prerequisite dependency resolution:
 * - CSS requires HTML
 * - JavaScript requires HTML
 * - React requires JavaScript
 * - DSA requires either C Fundamentals OR Python Programming
 */

/**
 * Validates prerequisite conditions for a course against user's completed courses
 * @param {Object} course - The course object
 * @param {Array<string>} completedCourseIds - Array of completed course IDs
 * @param {Array<Object>} allCourses - Full list of courses for title lookup
 * @returns {Object} { isSatisfied, missingCourseIds, missingCourseTitles, warningText }
 */
export function checkPrerequisites(course, completedCourseIds = [], allCourses = []) {
  const completedSet = new Set(completedCourseIds);
  const prereqs = course.prerequisites;

  // No prerequisites needed
  if (!prereqs || (Array.isArray(prereqs) && prereqs.length === 0)) {
    return {
      isSatisfied: true,
      missingCourseIds: [],
      missingCourseTitles: [],
      warningText: ''
    };
  }

  // Handle alternative prerequisites: e.g. DSA requires C OR Python
  if (typeof prereqs === 'object' && !Array.isArray(prereqs) && prereqs.type === 'OR') {
    const hasAny = prereqs.options.some((optId) => completedSet.has(optId));
    if (hasAny) {
      return {
        isSatisfied: true,
        missingCourseIds: [],
        missingCourseTitles: [],
        warningText: ''
      };
    }

    const missingTitles = prereqs.options.map((id) => {
      const found = allCourses.find((c) => c.id === id);
      return found ? found.title : id;
    });

    return {
      isSatisfied: false,
      missingCourseIds: prereqs.options,
      missingCourseTitles: missingTitles,
      warningText: `Requires either "${missingTitles.join('" OR "')}"`
    };
  }

  // Standard array of prerequisite course IDs: e.g. CSS requires HTML, React requires JS
  if (Array.isArray(prereqs)) {
    const missing = prereqs.filter((id) => !completedSet.has(id));
    if (missing.length === 0) {
      return {
        isSatisfied: true,
        missingCourseIds: [],
        missingCourseTitles: [],
        warningText: ''
      };
    }

    const missingTitles = missing.map((id) => {
      const found = allCourses.find((c) => c.id === id);
      return found ? found.title : id;
    });

    return {
      isSatisfied: false,
      missingCourseIds: missing,
      missingCourseTitles: missingTitles,
      warningText: `Requires completion of: ${missingTitles.join(', ')}`
    };
  }

  return {
    isSatisfied: true,
    missingCourseIds: [],
    missingCourseTitles: [],
    warningText: ''
  };
}

/**
 * Returns the exact readiness status of a course:
 * "Completed", "In Progress", "Ready to Start", or "Prerequisite Required"
 */
export function getCourseReadiness(course, progressStatus = 'not-started', completedCourseIds = [], allCourses = []) {
  if (progressStatus === 'completed') {
    return 'Completed';
  }
  if (progressStatus === 'in-progress') {
    return 'In Progress';
  }

  // Not started: check prerequisites
  const prereqCheck = checkPrerequisites(course, completedCourseIds, allCourses);
  if (prereqCheck.isSatisfied) {
    return 'Ready to Start';
  }

  return 'Prerequisite Required';
}

/**
 * Calculates deterministic score out of 100 based on user preferences and course data
 */
export function calculateCourseScore(course, preferences = {}, completedCourseIds = [], allCourses = []) {
  const {
    interests = [],
    skills = [],
    studyHours = 5
  } = preferences;

  const userSkills = new Set(skills.filter((s) => s !== 'None'));
  const hasBasicComputer = userSkills.has('Basic Computer Knowledge') || userSkills.size > 0;
  const prereqCheck = checkPrerequisites(course, completedCourseIds, allCourses);

  // 1. INTEREST MATCH (40% -> Max 40 points)
  let interestScore = 0;
  if (interests.length === 0) {
    // Neutral interest default
    interestScore = 20;
  } else {
    const hasCategoryMatch = interests.some((interest) => {
      const cat = (course.category || '').toLowerCase();
      const intr = interest.toLowerCase();
      return cat.includes(intr) || intr.includes(cat);
    });

    const matchingTags = (course.tags || []).filter((tag) =>
      interests.some((intr) => tag.toLowerCase().includes(intr.toLowerCase()) || intr.toLowerCase().includes(tag.toLowerCase()))
    );

    if (hasCategoryMatch) {
      interestScore = 32 + Math.min(8, matchingTags.length * 4); // 32 - 40
    } else if (matchingTags.length > 0) {
      interestScore = 24 + Math.min(10, matchingTags.length * 3); // 24 - 34
    } else {
      // General value in tech curriculum
      interestScore = 10;
    }
  }

  // 2. SKILL MATCH (30% -> Max 30 points)
  let skillScore = 0;
  const hasSkills = userSkills.size > 0;

  if (!hasSkills) {
    // User has no prior skills: Beginner starter courses get higher boost
    if (course.difficulty === 'Beginner') {
      skillScore = 25;
    } else {
      skillScore = 12;
    }
  } else {
    // Check if course required skills match user skills
    const courseNeedsHtml = (course.requiredSkills || []).some((s) => s.includes('HTML'));
    const courseNeedsJs = (course.requiredSkills || []).some((s) => s.includes('JavaScript'));
    const courseNeedsPyOrC = (course.requiredSkills || []).some((s) => s.includes('Python') || s.includes('C'));

    // If course builds directly upon skills the user already possesses
    let directSkillSynergy = false;
    if (courseNeedsHtml && userSkills.has('HTML')) directSkillSynergy = true;
    if (courseNeedsJs && userSkills.has('JavaScript')) directSkillSynergy = true;
    if (courseNeedsPyOrC && (userSkills.has('Python') || userSkills.has('C Programming'))) directSkillSynergy = true;

    // Does user already have the exact skill taught by this course?
    const alreadyMastered = (
      (course.id === 'html-fund' && userSkills.has('HTML')) ||
      (course.id === 'css-responsive' && userSkills.has('CSS')) ||
      (course.id === 'js-essentials' && userSkills.has('JavaScript')) ||
      (course.id === 'python-prog' && userSkills.has('Python')) ||
      (course.id === 'c-prog' && userSkills.has('C Programming')) ||
      (course.id === 'sql-db' && userSkills.has('SQL'))
    );

    if (alreadyMastered) {
      // Good for reinforcing or advancing, but not primary new learning
      skillScore = 18;
    } else if (directSkillSynergy) {
      skillScore = 29; // Super high synergy
    } else if (course.difficulty === 'Beginner' && hasBasicComputer) {
      skillScore = 24;
    } else if (prereqCheck.isSatisfied) {
      skillScore = 21;
    } else {
      skillScore = 13;
    }
  }

  // 3. DIFFICULTY SUITABILITY (15% -> Max 15 points)
  let difficultyScore = 0;
  // Estimate user tier based on skills count and completed courses
  const userExperiencePoints = userSkills.size + completedCourseIds.length;
  const isBeginnerUser = userExperiencePoints <= 2;
  const isIntermediateUser = userExperiencePoints >= 3;

  if (course.difficulty === 'Beginner') {
    if (isBeginnerUser) {
      difficultyScore = 15;
    } else {
      difficultyScore = 12;
    }
  } else if (course.difficulty === 'Intermediate') {
    if (prereqCheck.isSatisfied) {
      difficultyScore = isIntermediateUser ? 15 : 13;
    } else {
      // Prerequisite not satisfied, difficulty is less suitable right now
      difficultyScore = 8;
    }
  } else {
    // Advanced
    difficultyScore = isIntermediateUser ? 14 : 9;
  }

  // 4. WEEKLY TIME COMPATIBILITY (15% -> Max 15 points)
  let timeScore = 0;
  const neededHours = course.estimatedHoursPerWeek || 4;
  const userHours = Math.max(1, Math.min(20, studyHours));

  if (userHours >= neededHours) {
    // User can fulfill or exceed required weekly hours
    const ratio = userHours / neededHours;
    if (ratio <= 2.2) {
      timeScore = 15; // Sweet spot
    } else {
      timeScore = 14; // Plenty of time, can fast-track
    }
  } else {
    // User has fewer hours than recommended pace
    const ratio = userHours / neededHours;
    timeScore = Math.max(5, Math.round(ratio * 15));
  }

  // Deterministic sum capped cleanly
  const rawScore = interestScore + skillScore + difficultyScore + timeScore;
  const finalScore = Math.max(20, Math.min(99, Math.round(rawScore)));

  return {
    totalScore: finalScore,
    breakdown: {
      interestScore: Math.round(interestScore),
      skillScore: Math.round(skillScore),
      difficultyScore: Math.round(difficultyScore),
      timeScore: Math.round(timeScore)
    }
  };
}

/**
 * Calculates estimated completion weeks based on total course hours and user's weekly study hours
 */
export function calculateEstimatedWeeks(totalHours, weeklyHours = 5) {
  const safeWeekly = Math.max(1, weeklyHours);
  return Math.max(1, Math.ceil(totalHours / safeWeekly));
}

/**
 * Generates an inspiring, personalized Physics Wallah-style ed-tech explanation
 */
export function generatePersonalizedReason(course, score, preferences, prereqCheck, estimatedWeeks) {
  const { interests = [], skills = [], studyHours = 5 } = preferences;
  const userSkills = skills.filter((s) => s !== 'None');

  // If prerequisites are missing, clearly advise user
  if (!prereqCheck.isSatisfied) {
    return `🔒 High potential match, but you need ${prereqCheck.missingCourseTitles.join(' or ')} first. Complete the prerequisite to unlock!`;
  }

  // Check category match
  const matchesInterest = interests.some((intr) =>
    (course.category || '').toLowerCase().includes(intr.toLowerCase())
  );

  // Check synergy with existing skills
  const hasHtml = userSkills.includes('HTML');
  const hasPython = userSkills.includes('Python');
  const hasC = userSkills.includes('C Programming');
  const hasJs = userSkills.includes('JavaScript');

  if (course.id === 'css-responsive' && hasHtml) {
    return `💡 Excellent progression! You know HTML; learning CSS will let you design complete, responsive web applications in ~${estimatedWeeks} weeks (${studyHours}h/wk).`;
  }

  if (course.id === 'js-essentials' && hasHtml) {
    return `🚀 Perfect next step! Building on your HTML knowledge, JavaScript unlocks dynamic UI logic and APIs within ~${estimatedWeeks} weeks.`;
  }

  if (course.id === 'react-beginners' && hasJs) {
    return `⭐ High-demand frontend milestone! Your JavaScript foundation makes this ideal for building modern SPAs in ~${estimatedWeeks} weeks.`;
  }

  if (course.id === 'dsa') {
    if (hasPython) {
      return `🧠 Top-tier algorithm track! Your Python skills satisfy the prerequisite, enabling deep problem-solving practice in ~${estimatedWeeks} weeks.`;
    }
    if (hasC) {
      return `🧠 Solid competitive track! Your C programming foundation provides deep memory understanding for trees and graphs in ~${estimatedWeeks} weeks.`;
    }
  }

  if (course.id === 'intro-ai' && hasPython) {
    return `🤖 Direct AI track! Your Python skills satisfy the prerequisite for neural networks, machine learning, and LLM foundations in ~${estimatedWeeks} weeks.`;
  }

  if (course.id === 'ui-ux-design' && interests.includes('UI/UX Design')) {
    return `🎨 Tailored for your UI/UX interest! Master design thinking, color theory, and Figma prototypes at your pace (${estimatedWeeks} weeks).`;
  }

  if (matchesInterest) {
    return `🎯 Direct match for your ${course.category} interest. Fits your ${studyHours}h/week schedule comfortably for completion in ~${estimatedWeeks} weeks.`;
  }

  if (course.difficulty === 'Beginner') {
    return `✨ Great foundational course to expand your skills. Requires ~${estimatedWeeks} weeks at your current ${studyHours}h/week dedication.`;
  }

  return `📈 Recommended upskill milestone to broaden your tech portfolio. Target completion in ~${estimatedWeeks} weeks at ${studyHours}h/week.`;
}

/**
 * Recomputes and enriches all courses with scores, status, estimated weeks, and reasons
 * Returns list sorted by recommendation score descending
 */
export function getRecommendedCourses(allCourses, preferences, progressMap = {}) {
  // progressMap format: { [courseId]: 'not-started' | 'in-progress' | 'completed' }
  const completedIds = Object.keys(progressMap).filter(
    (id) => progressMap[id]?.status === 'completed' || progressMap[id] === 'completed'
  );

  const weeklyHours = preferences.studyHours || 5;

  const enriched = allCourses.map((course) => {
    // Current course status in user profile
    const rawProgress = progressMap[course.id];
    const status = typeof rawProgress === 'object' ? rawProgress.status : (rawProgress || 'not-started');
    const progressPercent = typeof rawProgress === 'object' ? (rawProgress.progress || 0) : (status === 'completed' ? 100 : status === 'in-progress' ? 40 : 0);

    const prereqCheck = checkPrerequisites(course, completedIds, allCourses);
    const readiness = getCourseReadiness(course, status, completedIds, allCourses);
    const scoreResult = calculateCourseScore(course, preferences, completedIds, allCourses);
    const estimatedWeeks = calculateEstimatedWeeks(course.totalHours, weeklyHours);
    const reason = generatePersonalizedReason(course, scoreResult.totalScore, preferences, prereqCheck, estimatedWeeks);

    return {
      ...course,
      score: scoreResult.totalScore,
      scoreBreakdown: scoreResult.breakdown,
      status, // 'not-started' | 'in-progress' | 'completed'
      progressPercent,
      readiness, // 'Ready to Start' | 'Prerequisite Required' | 'In Progress' | 'Completed'
      prereqCheck,
      estimatedWeeks,
      personalizedReason: reason
    };
  });

  // Sort deterministically:
  // 1. Highest score first
  // 2. If tied, ready/in-progress prioritized over prerequisite required
  return enriched.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Prioritize ready courses
    const order = { 'In Progress': 3, 'Ready to Start': 2, 'Completed': 1, 'Prerequisite Required': 0 };
    return (order[b.readiness] || 0) - (order[a.readiness] || 0);
  });
}