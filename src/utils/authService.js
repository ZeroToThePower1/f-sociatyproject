// src/utils/authService.js
//
// Frontend-only demo authentication service.
// - Stores users in localStorage under 'skillpath_users'
// - Hashes passwords with SHA-256 + per-user salt using Web Crypto API
// - Seeds two demo accounts: alex@skillpath.edu / priya@skillpath.edu
//   Both use password: password123
//
// ⚠️ This is NOT production-grade. Do not use for real credentials.

const USERS_KEY = 'skillpath_users';
const SESSION_KEY = 'skillpath_current_user';

// ---------------------------------------------------------------------------
// Demo accounts exposed to the Login UI ("Quick Demo Sign-In" cards)
// ---------------------------------------------------------------------------
export const DEMO_ACCOUNTS = [
  {
    id: 'alex',
    name: 'Alex',
    role: 'Frontend Learner',
    avatar: '🧑‍💻',
    email: 'alex@skillpath.edu'
  },
  {
    id: 'priya',
    name: 'Priya',
    role: 'Data Science Learner',
    avatar: '👩‍🔬',
    email: 'priya@skillpath.edu'
  }
];

// ---------------------------------------------------------------------------
// Crypto helpers (SHA-256 + random salt, all client-side)
// ---------------------------------------------------------------------------
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function generateSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bufferToHex(bytes);
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}::${password}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bufferToHex(digest);
}

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------
function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to persist users:', e);
  }
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

// ---------------------------------------------------------------------------
// Seeding
// ---------------------------------------------------------------------------
let seedPromise = null;

async function ensureSeeded() {
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    const users = readUsers();
    let changed = false;

    for (const demo of DEMO_ACCOUNTS) {
      const key = normalizeEmail(demo.email);
      if (!users[key]) {
        const salt = generateSalt();
        const passwordHash = await hashPassword('password123', salt);
        users[key] = {
          id: demo.id,
          email: key,
          fullName: demo.name,
          role: demo.role,
          avatar: demo.avatar,
          salt,
          passwordHash,
          createdAt: new Date().toISOString(),
          isDemo: true
        };
        changed = true;
      }
    }

    if (changed) writeUsers(users);
  })();

  return seedPromise;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Log in with email + password.
 * @returns {Promise<{id,email,fullName,role,avatar}>}
 * @throws {Error} on invalid credentials
 */
export async function login({ email, password }) {
  await ensureSeeded();
  const users = readUsers();
  const key = normalizeEmail(email);
  const user = users[key];

  if (!user) {
    throw new Error('No account found with that email address.');
  }

  const attemptHash = await hashPassword(password, user.salt);
  if (attemptHash !== user.passwordHash) {
    throw new Error('Incorrect password. Please try again.');
  }

  const session = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    avatar: user.avatar
  };

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to persist session:', e);
  }

  return session;
}

/**
 * Create a new account.
 * @returns {Promise<{id,email,fullName}>}
 * @throws {Error} if email already exists or validation fails
 */
export async function signup({ fullName, email, password }) {
  await ensureSeeded();
  const users = readUsers();
  const key = normalizeEmail(email);

  if (!key || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) {
    throw new Error('Please enter a valid email address.');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }
  if (users[key]) {
    throw new Error('An account with this email already exists. Try logging in.');
  }

  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);

  const newUser = {
    id: `user_${Date.now()}`,
    email: key,
    fullName: String(fullName || '').trim() || key.split('@')[0],
    role: 'Learner',
    avatar: '🧑‍🎓',
    salt,
    passwordHash,
    createdAt: new Date().toISOString(),
    isDemo: false
  };

  users[key] = newUser;
  writeUsers(users);

  return {
    id: newUser.id,
    email: newUser.email,
    fullName: newUser.fullName
  };
}

/**
 * Step 1 of password reset: verify the email exists.
 * @returns {Promise<{message: string, canResetDemo: boolean}>}
 * @throws {Error} if no account exists
 */
export async function requestPasswordReset(email) {
  await ensureSeeded();
  const users = readUsers();
  const key = normalizeEmail(email);
  const user = users[key];

  if (!user) {
    throw new Error('No account found with that email address.');
  }

  return {
    message: `Account verified. Set a new password for ${user.email}.`,
    canResetDemo: true
  };
}

/**
 * Step 2 of password reset: overwrite the stored password hash.
 */
export async function resetPasswordDemo(email, newPassword) {
  await ensureSeeded();
  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long.');
  }

  const users = readUsers();
  const key = normalizeEmail(email);
  const user = users[key];

  if (!user) {
    throw new Error('No account found with that email address.');
  }

  const salt = generateSalt();
  user.salt = salt;
  user.passwordHash = await hashPassword(newPassword, salt);
  user.passwordUpdatedAt = new Date().toISOString();

  users[key] = user;
  writeUsers(users);
}

/**
 * Remove the persisted session (logout).
 */
export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error(e);
  }
}

/**
 * Read the currently persisted session, if any.
 */
export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}