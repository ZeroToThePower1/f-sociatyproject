# CourseCompass 🧭

> **Smart Online Course Recommendation System**
> A personalized learning path advisor that recommends online courses based on a student's interests, current skills, and available study time.

---

## 📌 Project Overview

**CourseCompass** is a web application built for students who want to learn online but feel overwhelmed by the endless number of courses available. Instead of scrolling through hundreds of options, students enter their **interests**, **existing skills**, and **weekly study hours**, and the app:

- Ranks courses from **most suitable → least suitable**
- Explains **why** each course was recommended
- Suggests a **learning order** (which course to take first)
- Tracks progress (**Not Started / In Progress / Completed**)
- Blocks courses whose prerequisites haven't been completed

---

## 👥 Team: F-Society

| Name | Role | Branch / Year |
|------|------|---------------|
| **Sami** | Team Lead & Backend Developer | BCA – 2nd Year |
| **Jatin** | Frontend Developer | BCA – 2nd Year |
| **Himanshu** | Full-Stack / Database | B.Tech – 1st Year |
| **Ayush** | UI/UX & Frontend | BCA – 1st Year |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | **React (Create React App)** | UI, routing, state management |
| Styling | **CSS** | Custom, responsive UI |
| Backend / DB | **Supabase** | Postgres DB, Auth (optional), REST API |
| State / Data | **Supabase JS Client** | Query courses, save progress |
| Hosting | **Vercel** (frontend) + Supabase Cloud | Deployment |

> ⚠️ No external paid APIs. All course data is **sample data** stored in Supabase.

---

## 🎯 Main Features

1. **Course Catalog** – Browse sample courses with name, topic, difficulty, required skills, duration, description.
2. **Student Profile Input** – Select interests, known skills, and study hours/week.
3. **Smart Ranking** – Courses sorted by suitability with a reason per suggestion.
4. **Prerequisite-Aware Ordering** – Suggests a learning path; blocks locked courses.
5. **Progress Tracking** – Mark courses as Not Started / In Progress / Completed.
6. **Empty State Handling** – Friendly message when no course matches.

---

## 📂 Project Structure

```
coursecompass/
├── client/                        # React app (Create React App)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── CourseCard.jsx
│   │   │   ├── CourseList.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   ├── ProgressBadge.jsx
│   │   │   ├── ReasonTag.jsx
│   │   │   ├── LearningPath.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── ProfileSetup.jsx
│   │   │   ├── Recommendations.jsx
│   │   │   └── MyCourses.jsx
│   │   ├── lib/
│   │   │   ├── supabaseClient.js   # Supabase init
│   │   │   ├── recommender.js      # Ranking algorithm (frontend fallback)
│   │   │   └── constants.js
│   │   ├── hooks/
│   │   │   ├── useCourses.js
│   │   │   └── useProgress.js
│   │   ├── context/
│   │   │   └── StudentContext.jsx
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.local
│   └── package.json
│
├── backend/                       # Supabase logic (SQL + Edge Functions optional)
│   ├── supabase/
│   │   ├── migrations/
│   │   │   ├── 001_create_tables.sql
│   │   │   └── 002_seed_courses.sql
│   │   └── functions/
│   │       └── recommend/         # Optional Edge Function
│   │           └── index.ts
│   └── README.md
│
├── docs/
│   ├── algorithm.md               # Ranking & ordering logic
│   ├── schema.md                  # DB schema explanation
│   └── test-profiles.md           # 2 student profiles for testing
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🗄️ Database Schema (Supabase / Postgres)

### Table: `courses`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` (PK) | Auto-generated |
| `name` | `text` | e.g. "React Basics" |
| `topic` | `text` | e.g. "Web Development" |
| `difficulty` | `text` | `Beginner` / `Intermediate` / `Advanced` |
| `required_skills` | `text[]` | e.g. `['HTML','CSS']` |
| `duration_hours` | `int` | Total hours |
| `description` | `text` | Short summary |
| `prerequisite_course_id` | `uuid` (FK, nullable) | Points to another course in `courses` |

### Table: `student_profiles`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` (PK) | Auto |
| `name` | `text` | Student name |
| `interests` | `text[]` | Chosen topics |
| `known_skills` | `text[]` | Skills they already have |
| `hours_per_week` | `int` | Available study time |
| `created_at` | `timestamptz` | Default `now()` |

### Table: `progress`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` (PK) | Auto |
| `student_id` | `uuid` (FK) | → `student_profiles.id` |
| `course_id` | `uuid` (FK) | → `courses.id` |
| `status` | `text` | `not_started` / `in_progress` / `completed` |
| `updated_at` | `timestamptz` | Auto |

> **Unique constraint:** `(student_id, course_id)` so there is one row per course per student.

---

## 🧠 Recommendation Algorithm

Full details in [`docs/algorithm.md`](docs/algorithm.md). Summary:

### 1. Filtering
- Remove courses that have an unmet **prerequisite** from the *"Ready to Start"* list.
- Mark them as **Locked** with a message: `"Complete <Prerequisite Course> first."`

### 2. Scoring (0 – 100)

| Factor | Weight | How it's scored |
|--------|--------|-----------------|
| Topic match | **40** | +40 if course topic ∈ student interests |
| Skill match | **25** | +25 × (known skills ∩ required skills) / required skills |
| Time fit | **20** | +20 if `duration_hours ≤ hours_per_week × 4` (finish within ~4 weeks) |
| Difficulty fit | **15** | +15 if difficulty matches student's inferred level |

### 3. Explanation
Each suggestion shows a short reason derived from the top scoring factor:
- `"Matches your interest in Web Development."`
- `"You already know HTML, CSS — you're 60% ready."`
- `"Fits your 5 hrs/week schedule (20 hrs total)."`

### 4. Suggested Order (Learning Path)
- Build a **DAG** from `prerequisite_course_id`.
- Topologically sort courses that the student is eligible for.
- Show locked courses greyed out beneath their prerequisite.

---

## 🧪 Testing with Two Student Profiles

We test the app with **two different profiles** to prove recommendations change.

### Profile A — Aarav (Beginner, Web Focus)
```json
{
  "name": "Aarav",
  "interests": ["Web Development", "UI/UX"],
  "known_skills": ["HTML", "CSS"],
  "hours_per_week": 10
}
```

**Expected behavior:**
- Top pick: *JavaScript Fundamentals*
- *React Basics* shown as **Locked** (needs JavaScript)
- Advanced courses ranked low

### Profile B — Diya (Intermediate, Data Focus)
```json
{
  "name": "Diya",
  "interests": ["Data Science", "Python"],
  "known_skills": ["Python", "Statistics"],
  "hours_per_week": 5
}
```

**Expected behavior:**
- Top pick: *Pandas for Data Analysis*
- Web courses ranked low
- Longer courses pushed down due to 5 hrs/week limit

> ✅ Different profiles → different rankings → different learning paths.

---

## 🚀 Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/f-society/coursecompass.git
cd coursecompass
```

### 2. Frontend setup

The React app was created with:
```bash
npx create-react-app@latest client
```

To install its dependencies:
```bash
cd client
npm install
```

Create `.env.local`:
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

Run:
```bash
npm start
```

### 3. Supabase setup
1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run:
   - `backend/supabase/migrations/001_create_tables.sql`
   - `backend/supabase/migrations/002_seed_courses.sql`
3. Copy your **Project URL** and **anon key** into `.env.local`.

### 4. Seed Data
`002_seed_courses.sql` inserts ~12 sample courses across topics like:
- Web Development (HTML, CSS, JavaScript, React)
- Data Science (Python, Pandas, ML)
- App Development
- UI/UX Design

Includes at least **one prerequisite chain** (e.g. *JavaScript → React*).

---

## 🖥️ Pages & Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Home | Landing + CTA to start |
| `/profile` | ProfileSetup | Choose interests, skills, hours |
| `/recommendations` | Recommendations | Ranked list + reasons + path |
| `/my-courses` | MyCourses | Track Not Started / In Progress / Completed |

---

## 🧩 Key Components & Responsibilities

| Component | Responsibility |
|-----------|----------------|
| `CourseCard` | Shows one course with score, reason, status toggle |
| `FilterPanel` | Chips for interests, skills, slider for hours |
| `ReasonTag` | Renders "why recommended" text |
| `LearningPath` | Visual ordered list with locked steps |
| `ProgressBadge` | Colored chip: grey / yellow / green |
| `EmptyState` | Message when no courses match |

---

## 📜 Scripts

| Command | What it does |
|---------|--------------|
| `npm start` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run tests |

---

## 🔒 Important Rules (Recap)

- ✅ Only **sample data** — no paid APIs.
- ✅ Never mark a locked course as "Ready to Start."
- ✅ Always show **what to complete first**.
- ✅ Always show a **friendly empty state** if nothing matches.
- ✅ Recommendation reason must be **human-readable**.

---

## 📅 Suggested Development Plan (Hackathon)

| Day | Goal |
|-----|------|
| Day 1 | Supabase project + tables + seed data (Sami, Himanshu) |
| Day 1 | React scaffold + routing + CSS setup (Jatin, Ayush) |
| Day 2 | Profile form + course list rendering (Jatin, Ayush) |
| Day 2 | Recommender logic + prerequisite check (Sami, Himanshu) |
| Day 3 | Progress tracking + learning path UI (All) |
| Day 3 | Test 2 profiles + polish + demo (All) |

---

## 🤝 Contributing

This is a college hackathon project. Internal workflow:
1. Pull latest `main`.
2. Create a branch: `feat/<feature>` or `fix/<bug>`.
3. Commit with clear messages.
4. Open PR → 1 reviewer → merge.

---

## 📄 License

MIT License — free to use for learning and academic purposes.

---

## 💡 Future Ideas

- Supabase Auth for multi-user accounts
- Course ratings from peers
- AI-generated learning path explanations
- Export path as PDF
- Mobile-first PWA

---

> Built with ❤️ by **F-Society** — Sami, Jatin, Himanshu, Ayush.