// /app/src/data/courses.js
/**
 * SkillPath Course Catalog
 * 10 Master Courses with structured metadata, prerequisites, and learning roadmaps
 */

export const COURSES = [
  {
    id: 'c-prog',
    title: 'Programming Fundamentals with C',
    category: 'Programming Fundamentals',
    difficulty: 'Beginner',
    durationWeeks: 6,
    totalHours: 24,
    estimatedHoursPerWeek: 4,
    prerequisites: [], // No prerequisites
    requiredSkills: ['Basic Computer Knowledge'],
    tags: ['Programming Fundamentals', 'C Programming', 'Memory Management', 'Algorithms', 'Logic Building'],
    shortDescription: 'Master foundational CS concepts, pointers, memory models, and structured programming in C.',
    description: 'Master the bedrock of computer science with C programming. Learn pointers, memory allocation, control flow, functions, and structured problem solving that prepares you for systems engineering and algorithm design.',
    syllabus: [
      'Week 1: Introduction to C syntax, compilers, memory layouts & variables',
      'Week 2: Conditionals, loops, bitwise operations & control flow',
      'Week 3: Modular programming with functions & variable scopes',
      'Week 4: Pointers, memory addresses, dereferencing & references',
      'Week 5: Arrays, strings, struct data models & nested types',
      'Week 6: Dynamic memory management (malloc, calloc, free) & file I/O'
    ],
    learningOutcomes: [
      'Understand how computers store and execute code at the hardware level',
      'Master pointers and direct heap/stack memory management',
      'Build solid algorithmic thinking for competitive programming and DSA',
      'Gain confidence debugging segmentation faults and memory leaks'
    ],
    rating: 4.8,
    reviewsCount: 3420,
    enrolledCount: 18500,
    levelBadge: 'Foundational',
    bannerGradient: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'html-fund',
    title: 'HTML Fundamentals',
    category: 'Web Development',
    difficulty: 'Beginner',
    durationWeeks: 3,
    totalHours: 12,
    estimatedHoursPerWeek: 4,
    prerequisites: [], // No prerequisites
    requiredSkills: ['Basic Computer Knowledge'],
    tags: ['Web Development', 'HTML', 'Semantic HTML', 'Accessibility', 'Web Basics'],
    shortDescription: 'Build modern semantic web structures, accessible forms, and SEO-friendly document markup.',
    description: 'Build solid foundations for web authoring. Learn semantic markup, accessible HTML5 elements, web forms, SEO best practices, and document structure that powers every website on the internet.',
    syllabus: [
      'Week 1: Web architecture, HTTP basics, HTML document skeleton & text hierarchy',
      'Week 2: Semantic tags (nav, section, article), images, audio/video & tables',
      'Week 3: Advanced HTML5 forms, input validation, microdata & ARIA accessibility'
    ],
    learningOutcomes: [
      'Author clean, compliant HTML5 pages adhering to W3C standards',
      'Implement web accessibility standards (WCAG / ARIA)',
      'Create interactive form elements with native browser validation',
      'Establish rock-solid structural foundation for modern CSS & JS frameworks'
    ],
    rating: 4.9,
    reviewsCount: 4890,
    enrolledCount: 29400,
    levelBadge: 'Core Starter',
    bannerGradient: 'from-amber-500 to-orange-600'
  },
  {
    id: 'css-responsive',
    title: 'CSS and Responsive Web Design',
    category: 'Web Development',
    difficulty: 'Beginner',
    durationWeeks: 5,
    totalHours: 20,
    estimatedHoursPerWeek: 4,
    prerequisites: ['html-fund'], // CSS requires HTML
    requiredSkills: ['HTML'],
    tags: ['Web Development', 'CSS', 'Responsive Design', 'Flexbox', 'CSS Grid', 'UI Styling'],
    shortDescription: 'Transform plain HTML into gorgeous, responsive layouts using modern Flexbox, Grid, and animations.',
    description: 'Transform raw HTML into visually stunning, responsive layouts. Master the CSS Box Model, Flexbox, CSS Grid, mobile-first media queries, transitions, and modern CSS custom properties.',
    syllabus: [
      'Week 1: Box model, specificity, cascade, units (rem/em/vh) & modern selectors',
      'Week 2: Flexbox layout deep-dive: alignment, wrapping, flex-basis & flex items',
      'Week 3: CSS Grid: 12-column systems, template areas & responsive auto-fit',
      'Week 4: Mobile-first responsive workflows, media queries & responsive typography',
      'Week 5: CSS variables, shadows, transitions, keyframe animations & UI polish'
    ],
    learningOutcomes: [
      'Build pixel-perfect websites that look stunning on mobile, tablet, and 4K displays',
      'Master modern Flexbox and Grid layouts without depending on external frameworks',
      'Create micro-interactions, smooth hover transitions, and engaging animations',
      'Structure scalable, maintainable CSS design systems'
    ],
    rating: 4.85,
    reviewsCount: 3950,
    enrolledCount: 23100,
    levelBadge: 'Visual Craft',
    bannerGradient: 'from-violet-600 to-purple-800'
  },
  {
    id: 'js-essentials',
    title: 'JavaScript Essentials',
    category: 'Web Development',
    difficulty: 'Intermediate',
    durationWeeks: 6,
    totalHours: 30,
    estimatedHoursPerWeek: 5,
    prerequisites: ['html-fund'], // JavaScript requires HTML
    requiredSkills: ['HTML'],
    tags: ['Web Development', 'JavaScript', 'DOM Manipulation', 'Async JS', 'ES6+'],
    shortDescription: 'Master modern ES6+, DOM manipulation, asynchronous programming, APIs, and client-side logic.',
    description: 'Unleash interactivity on the web. Dive deep into modern ES6+, DOM manipulation, event-driven programming, Promises, Fetch API, and asynchronous architecture that forms the engine of modern frontends.',
    syllabus: [
      'Week 1: Modern ES6+ syntax, let/const, arrow functions, destructuring & template literals',
      'Week 2: Arrays, objects, functional methods (map, filter, reduce) & closures',
      'Week 3: DOM traversal, event listeners, dynamic UI manipulation & localStorage',
      'Week 4: Asynchronous JavaScript: event loop, callbacks, Promises & Async/Await',
      'Week 5: Fetching REST APIs, error handling, JSON parsing & loading states',
      'Week 6: Mini-project: Building an interactive dashboard web application'
    ],
    learningOutcomes: [
      'Write clean, idiomatic modern JavaScript (ES6+)',
      'Manipulate the DOM dynamically in response to user inputs and interactions',
      'Handle asynchronous operations and external API requests seamlessly',
      'Build the prerequisite competence required for modern frontend frameworks like React'
    ],
    rating: 4.92,
    reviewsCount: 5610,
    enrolledCount: 34500,
    levelBadge: 'Interactive Web',
    bannerGradient: 'from-amber-500 to-yellow-600'
  },
  {
    id: 'python-prog',
    title: 'Python Programming',
    category: 'Programming Fundamentals',
    difficulty: 'Beginner',
    durationWeeks: 5,
    totalHours: 25,
    estimatedHoursPerWeek: 5,
    prerequisites: [], // No prerequisites
    requiredSkills: ['Basic Computer Knowledge'],
    tags: ['Programming Fundamentals', 'Python', 'Scripting', 'OOP', 'Data Handling'],
    shortDescription: 'Learn elegant Python syntax, data structures, object-oriented principles, and scripting.',
    description: 'Learn the versatile, beginner-friendly language powering modern AI, data science, automation, and backend development. Covers data structures, object-oriented programming, and real-world scripting.',
    syllabus: [
      'Week 1: Python environment, primitive types, loops, conditionals & formatting',
      'Week 2: Lists, dictionaries, tuples, sets & list/dictionary comprehensions',
      'Week 3: Modular functions, *args/**kwargs, decorators & standard library packages',
      'Week 4: Object-Oriented Programming (Classes, inheritance, encapsulation, polymorphism)',
      'Week 5: File operations, CSV/JSON handling, exception handling & CLI utilities'
    ],
    learningOutcomes: [
      'Write clean, readable, Pythonic code adhering to PEP 8 standards',
      'Build reusable classes and modules with Object-Oriented principles',
      'Parse, manipulate, and export JSON and tabular datasets',
      'Qualify as a prerequisite foundation for Data Science, AI, and DSA tracks'
    ],
    rating: 4.93,
    reviewsCount: 6180,
    enrolledCount: 38200,
    levelBadge: 'Popular Choice',
    bannerGradient: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'sql-db',
    title: 'SQL and Database Fundamentals',
    category: 'Database Management',
    difficulty: 'Beginner',
    durationWeeks: 4,
    totalHours: 16,
    estimatedHoursPerWeek: 4,
    prerequisites: [], // No prerequisites
    requiredSkills: ['Basic Computer Knowledge'],
    tags: ['Database Management', 'SQL', 'Relational Databases', 'Data Modeling', 'Queries'],
    shortDescription: 'Query, design, and manage relational databases with confidence using SQL statements and schema design.',
    description: 'Harness the power of relational databases. Learn relational modeling, schema design, complex joins, subqueries, grouping, aggregations, constraints, and data integrity.',
    syllabus: [
      'Week 1: Relational models, database architecture & basic CRUD operations (SELECT, INSERT, UPDATE, DELETE)',
      'Week 2: Filtering (WHERE, LIKE, IN), ORDER BY, LIMIT & aggregate functions (COUNT, AVG, SUM, GROUP BY, HAVING)',
      'Week 3: Multi-table relationships: INNER JOIN, LEFT/RIGHT JOIN, FULL OUTER JOIN & subqueries',
      'Week 4: Indexes, foreign keys, ACID transactions, views & practical normalization (1NF-3NF)'
    ],
    learningOutcomes: [
      'Author complex multi-table SQL queries with joins and subqueries',
      'Design clean, normalized database schemas with proper integrity constraints',
      'Understand query performance, indexing, and transactional safety',
      'Integrate SQL querying skills into web apps, analytics, and data science workflows'
    ],
    rating: 4.81,
    reviewsCount: 2940,
    enrolledCount: 19800,
    levelBadge: 'Data Backbone',
    bannerGradient: 'from-cyan-600 to-blue-700'
  },
  {
    id: 'dsa',
    title: 'Data Structures and Algorithms',
    category: 'DSA',
    difficulty: 'Intermediate',
    durationWeeks: 8,
    totalHours: 48,
    estimatedHoursPerWeek: 6,
    // "DSA requires either C Fundamentals OR Python Programming"
    prerequisites: {
      type: 'OR',
      options: ['c-prog', 'python-prog'],
      label: 'Programming Fundamentals with C OR Python Programming'
    },
    requiredSkills: ['C Programming OR Python'],
    tags: ['DSA', 'Data Structures', 'Algorithms', 'Time Complexity', 'Problem Solving'],
    shortDescription: 'Ace technical interviews with mastery of Big-O analysis, trees, graphs, sorting, and dynamic programming.',
    description: 'Ace technical interviews and write high-efficiency production code. Master Big-O asymptotic analysis, linked lists, stacks, queues, binary search trees, graph traversals, recursion, and dynamic programming patterns.',
    syllabus: [
      'Week 1: Asymptotic complexity (Big-O, Big-Omega), space complexity & recursion basics',
      'Week 2: Array techniques (two-pointers, sliding window, prefix sums) & string algorithms',
      'Week 3: Singly/doubly linked lists, stacks, queues & monotonic stacks',
      'Week 4: Binary Trees, Binary Search Trees (BST), tree traversals (In/Pre/Post/Level-order)',
      'Week 5: Heap / Priority Queue implementations & Hash table collision resolution',
      'Week 6: Graph representations (Adjacency lists/matrices), BFS, DFS & topological sort',
      'Week 7: Shortest paths (Dijkstra), minimum spanning trees & greedy strategies',
      'Week 8: Dynamic Programming fundamentals (Memoization, Tabulation, Knapsack variations)'
    ],
    learningOutcomes: [
      'Analyze time and memory trade-offs of any algorithmic approach',
      'Implement core data structures from scratch without relying on built-in helpers',
      'Solve medium-to-hard LeetCode / competitive programming problems methodically',
      'Confidently pass top-tier tech technical interview rounds'
    ],
    rating: 4.96,
    reviewsCount: 7420,
    enrolledCount: 31200,
    levelBadge: 'Interview Ready',
    bannerGradient: 'from-purple-700 to-indigo-900'
  },
  {
    id: 'react-beginners',
    title: 'React for Beginners',
    category: 'Web Development',
    difficulty: 'Intermediate',
    durationWeeks: 6,
    totalHours: 30,
    estimatedHoursPerWeek: 5,
    // "React requires JavaScript"
    prerequisites: ['js-essentials'],
    requiredSkills: ['JavaScript', 'HTML'],
    tags: ['Web Development', 'React', 'Frontend', 'JSX', 'Hooks', 'Components'],
    shortDescription: 'Build modern, reactive single-page applications with React 18+, JSX, Hooks, and modular UI patterns.',
    description: 'Build dynamic, modern single-page applications. Learn JSX, component architecture, state management with React Hooks (useState, useEffect, useMemo), component lifecycle, and component composition.',
    syllabus: [
      'Week 1: Declarative UI paradigm, Vite project setup, JSX syntax & React component hierarchy',
      'Week 2: Props, immutability, conditional rendering & list rendering with keys',
      'Week 3: State management with useState, synthetic events, form handling & two-way binding',
      'Week 4: Side effects with useEffect, dependency arrays, API fetching & cleanup functions',
      'Week 5: Advanced Hooks (useRef, useMemo, useCallback), Custom Hooks & React Context API',
      'Week 6: Production capstone: Building a responsive SPA with full state persistence'
    ],
    learningOutcomes: [
      'Construct reactive, reusable component hierarchies using modern React Hooks',
      'Manage complex application states and side-effects efficiently',
      'Structure clean component trees, custom hooks, and context providers',
      'Deploy responsive single-page web applications ready for client delivery'
    ],
    rating: 4.94,
    reviewsCount: 5120,
    enrolledCount: 28900,
    levelBadge: 'Industry Standard',
    bannerGradient: 'from-indigo-600 to-violet-800'
  },
  {
    id: 'intro-ai',
    title: 'Introduction to Artificial Intelligence',
    category: 'AI',
    difficulty: 'Intermediate',
    durationWeeks: 6,
    totalHours: 36,
    estimatedHoursPerWeek: 6,
    // AI requires Python Programming
    prerequisites: ['python-prog'],
    requiredSkills: ['Python'],
    tags: ['AI', 'Data Science', 'Machine Learning', 'Python', 'Neural Networks'],
    shortDescription: 'Demystify artificial intelligence, machine learning pipelines, neural networks, and modern generative AI.',
    description: 'Explore modern AI fundamentals. Discover machine learning concepts, supervised & unsupervised learning, neural network architectures, computer vision, natural language processing, and modern LLM mechanics.',
    syllabus: [
      'Week 1: The AI landscape: history, symbolic AI vs. machine learning & ethical considerations',
      'Week 2: Data preparation with NumPy & Pandas: matrix operations, normalization & exploratory analysis',
      'Week 3: Supervised learning: Linear Regression, Logistic Regression, Decision Trees & evaluation metrics',
      'Week 4: Unsupervised learning: K-Means clustering, PCA dimensionality reduction & anomaly detection',
      'Week 5: Neural networks fundamentals: perceptrons, activation functions, backpropagation & PyTorch basics',
      'Week 6: Introduction to Generative AI, Transformers, Large Language Models & Prompt Engineering'
    ],
    learningOutcomes: [
      'Grasp foundational mathematical and conceptual mechanisms behind machine learning',
      'Preprocess datasets and train predictive ML models with Python',
      'Understand how deep neural networks and transformer architectures operate',
      'Evaluate model performance, mitigate algorithmic bias, and explore modern GenAI'
    ],
    rating: 4.89,
    reviewsCount: 3870,
    enrolledCount: 22400,
    levelBadge: 'Future Tech',
    bannerGradient: 'from-purple-600 to-pink-600'
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Fundamentals',
    category: 'UI/UX Design',
    difficulty: 'Beginner',
    durationWeeks: 4,
    totalHours: 16,
    estimatedHoursPerWeek: 4,
    prerequisites: [], // No prerequisites
    requiredSkills: ['Basic Computer Knowledge'],
    tags: ['UI/UX Design', 'Design', 'Figma', 'User Research', 'Design Systems', 'Wireframing'],
    shortDescription: 'Design intuitive, accessible digital products, master Figma prototyping, and craft engaging design systems.',
    description: 'Design intuitive, accessible digital products that users love. Master design thinking, user research, wireframing, color psychology, typography, Figma interactive prototyping, and usability testing.',
    syllabus: [
      'Week 1: Design thinking methodology, user personas, journey mapping & empathy mapping',
      'Week 2: Information architecture, sitemaps, low-fidelity wireframing & rapid layout prototyping',
      'Week 3: Visual design principles: 8pt grid systems, color harmony, accessible contrast & typography scales',
      'Week 4: High-fidelity component systems in Figma, interactive micro-prototyping & usability testing'
    ],
    learningOutcomes: [
      'Conduct user interviews, synthesize research, and map user journey workflows',
      'Build scalable UI component libraries with autolayout and variants in Figma',
      'Design accessible, WCAG-compliant color schemes and typography hierarchies',
      'Create interactive clickable prototypes to validate ideas before engineering'
    ],
    rating: 4.86,
    reviewsCount: 2680,
    enrolledCount: 16700,
    levelBadge: 'Creative Core',
    bannerGradient: 'from-fuchsia-600 to-rose-600'
  }
];

// Available categories for filtering
export const CATEGORIES = [
  'All',
  'Web Development',
  'Programming Fundamentals',
  'DSA',
  'AI',
  'Database Management',
  'UI/UX Design'
];

// Available difficulties for filtering
export const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

// Available interests for profile selection
export const INTEREST_OPTIONS = [
  'Web Development',
  'DSA',
  'AI',
  'Data Science',
  'Cybersecurity',
  'Database Management',
  'UI/UX Design',
  'Programming Fundamentals'
];

// Available existing skills for profile selection
export const SKILL_OPTIONS = [
  'HTML',
  'CSS',
  'JavaScript',
  'Python',
  'C Programming',
  'SQL',
  'Basic Computer Knowledge',
  'None'
];

// Demo Profile Presets as specified in the prompt
export const DEMO_PROFILES = {
  profileA: {
    id: 'profileA',
    name: 'Alex Chen',
    tagline: 'Aspiring Frontend & UX Designer',
    avatar: '👨‍💻',
    interests: ['Web Development', 'UI/UX Design'],
    skills: ['HTML', 'Basic Computer Knowledge'],
    studyHours: 5,
    initialCompletedCourses: ['html-fund'], // Knows HTML, so HTML Fundamentals completed
    initialInProgressCourses: ['css-responsive'] // Actively learning CSS
  },
  profileB: {
    id: 'profileB',
    name: 'Priya Sharma',
    tagline: 'AI Researcher & Competitive Programmer',
    avatar: '👩‍💻',
    interests: ['AI', 'DSA'],
    skills: ['Python', 'Basic Computer Knowledge'],
    studyHours: 10,
    initialCompletedCourses: ['python-prog'], // Knows Python, so Python completed
    initialInProgressCourses: ['dsa'] // Actively tackling DSA
  }
};